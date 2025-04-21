/**
 * OllamaRequestManager Service
 *
 * This service manages active Ollama API requests to support aborting requests cleanly
 * from the client side. It tracks active requests using AbortControllers and provides
 * methods to abort them when needed.
 */

interface ActiveRequest {
  controller: AbortController
  createdAt: number
}

// Map of requestId to AbortController instances
const activeRequests = new Map<string, ActiveRequest>()

// Cleanup interval in milliseconds (5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000

// Maximum request age before auto-cleanup (10 minutes)
const MAX_REQUEST_AGE = 10 * 60 * 1000

/**
 * Register a new Ollama request with an abort controller
 * @param requestId - Unique identifier for the request
 * @param controller - AbortController for the request
 */
export function registerOllamaRequest(
  requestId: string,
  controller: AbortController
): void {
  if (requestId) {
    // Store the controller with timestamp for cleanup purposes
    activeRequests.set(requestId, {
      controller,
      createdAt: Date.now(),
    })

    // Log for debugging (remove in production)
    console.log(
      `Registered Ollama request: ${requestId}, active requests: ${activeRequests.size}`
    )
  }
}

/**
 * Abort an active Ollama request
 * @param requestId - Unique identifier for the request to abort
 * @returns boolean indicating if abort was successful
 */
export function abortOllamaRequest(requestId: string): boolean {
  if (!requestId) return false

  const request = activeRequests.get(requestId)

  if (request) {
    try {
      // Abort the request
      request.controller.abort()

      // Remove from active requests
      activeRequests.delete(requestId)

      // Log for debugging (remove in production)
      console.log(
        `Aborted Ollama request: ${requestId}, remaining requests: ${activeRequests.size}`
      )

      return true
    } catch (error) {
      console.error(`Error aborting request ${requestId}:`, error)
      return false
    }
  }

  return false
}

/**
 * Get an abort controller for a request
 * @param requestId - Unique identifier for the request
 * @returns AbortController or null if not found
 */
export function getOllamaRequestController(
  requestId: string
): AbortController | null {
  const request = activeRequests.get(requestId)
  return request ? request.controller : null
}

/**
 * Complete a request - removes it from tracking
 * @param requestId - Unique identifier for the request
 */
export function completeOllamaRequest(requestId: string): void {
  if (requestId && activeRequests.has(requestId)) {
    activeRequests.delete(requestId)
    console.log(
      `Completed Ollama request: ${requestId}, remaining requests: ${activeRequests.size}`
    )
  }
}

// Periodically clean up old requests to prevent memory leaks
if (typeof window === 'undefined') {
  // Only run on server-side
  setInterval(() => {
    const now = Date.now()
    let cleanedCount = 0

    activeRequests.forEach((request, requestId) => {
      // If request is older than MAX_REQUEST_AGE, abort and remove it
      if (now - request.createdAt > MAX_REQUEST_AGE) {
        try {
          request.controller.abort()
          activeRequests.delete(requestId)
          cleanedCount++
        } catch (error) {
          console.error(`Error cleaning up request ${requestId}:`, error)
        }
      }
    })

    if (cleanedCount > 0) {
      console.log(
        `Cleaned up ${cleanedCount} stale Ollama requests, remaining: ${activeRequests.size}`
      )
    }
  }, CLEANUP_INTERVAL)
}
