import {
  completeOllamaRequest,
  registerOllamaRequest,
} from '@/services/ollamaRequestManager'
import type { NextApiRequest, NextApiResponse } from 'next'
import { GenerateRequest, Ollama } from 'ollama'

// Define the message structure
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  images?: string[]
}

// Define the request body structure
interface ChatRequestBody extends GenerateRequest {
  messages: ChatMessage[]
  requestId?: string
}

// Define the response structure
interface ChatResponse {
  message: {
    role: string
    content: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse | { error: string }>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get request ID from headers or body for abort tracking
  const requestId =
    req.headers['x-request-id']?.toString() || req.body.requestId

  // Create an abort controller for this request
  const controller = new AbortController()

  // Register the request if we have a requestId
  if (requestId) {
    registerOllamaRequest(requestId, controller)

    // Set up cleanup when client disconnects
    res.on('close', () => {
      if (!res.writableEnded) {
        completeOllamaRequest(requestId)
        controller.abort()
      }
    })
  }

  try {
    const { model, messages, system, options } = req.body as ChatRequestBody

    // Validate required fields
    if (!model) {
      return res.status(400).json({ error: 'Model name is required' })
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' })
    }

    // Create an Ollama client instance
    const ollama = new Ollama({
      host: 'http://localhost:11434',
      // Pass the abort signal to Ollama
      signal: controller.signal,
    })

    // Prepare messages array with system message if provided
    let chatMessages = [...messages]
    if (system) {
      chatMessages = [{ role: 'system', content: system }, ...chatMessages]
    }

    try {
      // Generate chat completion
      const response = await ollama.chat({
        model,
        messages: chatMessages,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          ...options,
        },
      })

      // Return the response
      return res.status(200).json({
        message: {
          role: 'assistant',
          content: response.message.content,
        },
      })
    } finally {
      // Clean up the request tracking
      if (requestId) {
        completeOllamaRequest(requestId)
      }
    }
  } catch (error) {
    // Clean up the request tracking
    if (requestId) {
      completeOllamaRequest(requestId)
    }

    // Check if this is an abort error
    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(499).json({ error: 'Request aborted by client' })
    }

    console.error('Error generating chat completion:', error)
    return res.status(500).json({ error: 'Failed to generate chat completion' })
  }
}
