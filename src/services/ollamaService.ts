// Ollama service client that uses Next.js API routes

// Define message structure
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  images?: string[] // Base64 encoded images if needed
}

interface GenerateRequestOptions {
  model: string
  prompt: string
  system?: string
  messages?: ChatMessage[]
  options?: {
    temperature?: number
    top_p?: number
    frequency_penalty?: number
    presence_penalty?: number
    seed?: number
    max_tokens?: number
    stream?: boolean
    signal?: AbortSignal
  }
}

// List available models from Ollama API via our Next.js API route
export async function listModels(): Promise<string[]> {
  try {
    const response = await fetch('/api/ollama/models')

    if (!response.ok) {
      console.error(`Failed to fetch models: ${response.statusText}`)
      return ['mistral']
    }

    const data = await response.json()
    return data.models
  } catch (error) {
    console.error('Error listing models:', error)
    throw error
  }
}

const defaultSystemMessage = `You are a medical assistant with expertise in healthcare information. 
Provide informative responses on medical topics while acknowledging limitations.
Always include appropriate disclaimers and recommend consulting healthcare professionals for specific advice.
Base your responses on peer-reviewed medical literature and clinical guidelines.`

// Generate response from Ollama API via our Next.js API route
export async function generateResponse({
  model,
  prompt,
  system = defaultSystemMessage,
  messages = [],
  options = {},
}: GenerateRequestOptions): Promise<string> {
  try {
    // Use chat API if there are previous messages
    if (messages.length === 0) {
      messages.push({ role: 'user', content: prompt })
    }

    // For single prompts, we'll still use the chat endpoint but format differently
    const response = await fetch('/api/ollama/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': options.signal ? Date.now().toString() : undefined,
      },
      body: JSON.stringify({
        model,
        messages,
        system,
        requestId: options.signal ? Date.now().toString() : undefined,
        options: {
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 0.9,
          frequency_penalty: options.frequency_penalty || 0.0,
          presence_penalty: options.presence_penalty || 0.0,
          seed: options.seed,
          max_tokens: options.max_tokens,
        },
      }),
      signal: options.signal,
    })
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.message?.content || 'No response received.'
  } catch (error) {
    console.error('Error generating response:', error)
    throw error
  }
}
