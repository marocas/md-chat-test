// Medical AI model service for specialized healthcare LLMs
// This service integrates with medical-specific AI models via their APIs

import { ChatMessage } from './ollamaService'

// Available medical model providers
export type MedicalModelProvider =
  | 'gemini'
  | 'openai'
  | 'openbiollm'
  | 'huggingface'

// Configuration for different model providers
interface ModelConfig {
  apiKey?: string
  baseUrl?: string
  model: string
}

// Provider configurations
const providerConfigs: Record<MedicalModelProvider, ModelConfig> = {
  gemini: {
    model: 'med-gemini-pro',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
  },
  openai: {
    model: 'gpt-4o-medical',
    baseUrl: 'https://api.openai.com/v1',
  },
  openbiollm: {
    model: 'biomedlm-2-7b',
    baseUrl: 'https://api.openbiollm.org/v1',
  },
  huggingface: {
    model: 'medalpaca/medalpaca-13b',
    baseUrl: 'https://api-inference.huggingface.co/models',
  },
}

// Request options type
interface GenerateRequestOptions {
  provider: MedicalModelProvider
  prompt: string
  system?: string
  messages?: ChatMessage[]
  options?: {
    temperature?: number
    top_p?: number
    max_tokens?: number
    stream?: boolean
  }
}

/**
 * Get available medical AI models from supported providers
 */
export async function listMedicalModels(): Promise<
  { provider: string; model: string; description: string }[]
> {
  // In a real implementation, this might query the actual providers
  return [
    {
      provider: 'gemini',
      model: 'med-gemini-pro',
      description:
        "Google's medical version of Gemini, specialized for healthcare applications",
    },
    {
      provider: 'openai',
      model: 'gpt-4o-medical',
      description: "OpenAI's GPT-4o with medical knowledge fine-tuning",
    },
    {
      provider: 'openbiollm',
      model: 'biomedlm-2-7b',
      description:
        'Open-source biomedical language model trained on medical literature',
    },
    {
      provider: 'huggingface',
      model: 'medalpaca/medalpaca-13b',
      description: 'Medical version of Alpaca model fine-tuned on medical data',
    },
  ]
}

/**
 * Get a response from a specialized medical AI model
 */
export async function generateMedicalResponse({
  provider,
  prompt,
  system = 'You are a medical AI assistant. Provide clear, accurate medical information while acknowledging limitations and recommending professional healthcare when appropriate.',
  messages = [],
  options = {},
}: GenerateRequestOptions): Promise<string> {
  // Get config for the selected provider
  const config = providerConfigs[provider]
  if (!config) {
    throw new Error(`Provider ${provider} is not supported`)
  }

  try {
    // For demo purposes, we'll just call our API proxy endpoint
    // In a real implementation, this would directly call the provider APIs with proper formatting
    const response = await fetch('/api/medical-models/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        model: config.model,
        messages:
          messages.length > 0 ? messages : [{ role: 'user', content: prompt }],
        system,
        options: {
          temperature: options.temperature || 0.3, // Lower temperature for medical responses
          top_p: options.top_p || 0.95,
          max_tokens: options.max_tokens || 1000,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.content || 'No response received.'
  } catch (error) {
    console.error(`Error generating response from ${provider}:`, error)
    throw error
  }
}

/**
 * Generate a streaming response from a medical AI model
 * Fixed implementation to handle SSE responses correctly
 */
export async function* generateStreamingMedicalResponse({
  provider,
  prompt,
  system = 'You are a medical AI assistant. Provide clear, accurate medical information while acknowledging limitations and recommending professional healthcare when appropriate.',
  messages = [],
  options = {},
}: GenerateRequestOptions): AsyncGenerator<string, void, unknown> {
  // Get config for the selected provider
  const config = providerConfigs[provider]
  if (!config) {
    throw new Error(`Provider ${provider} is not supported`)
  }

  try {
    // Make the request to our streaming API endpoint
    const response = await fetch('/api/medical-models/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        model: config.model,
        messages:
          messages.length > 0 ? messages : [{ role: 'user', content: prompt }],
        system,
        options: {
          temperature: options.temperature || 0.3,
          top_p: options.top_p || 0.95,
          max_tokens: options.max_tokens || 1000,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    // Process the stream using the ReadableStream API
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()

        // Exit the loop when the stream is done
        if (done) {
          break
        }

        // Decode the chunk and add it to our buffer
        buffer += decoder.decode(value, { stream: true })

        // Split the buffer by double newlines (SSE format)
        const lines = buffer.split('\n\n')

        // Process all complete events (all except the last one which might be incomplete)
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim()

          // Check if this is a data line
          if (line.startsWith('data:')) {
            const data = line.substring(5).trim()

            // Check for the end of stream signal
            if (data === '[DONE]') {
              return
            }

            try {
              // Parse the JSON data
              const parsedData = JSON.parse(data)

              // Yield the content if it exists
              if (parsedData.content) {
                yield parsedData.content
              }

              // Handle any errors in the response
              if (parsedData.error) {
                throw new Error(parsedData.error)
              }
            } catch (e) {
              // Only log non-done events
              if (data !== '[DONE]') {
                console.warn('Error parsing SSE data:', e)
              }
            }
          }
        }

        // Keep the last (potentially incomplete) chunk in the buffer
        buffer = lines[lines.length - 1]
      }

      // Process any remaining data in the buffer
      if (buffer.trim()) {
        const line = buffer.trim()
        if (line.startsWith('data:')) {
          const data = line.substring(5).trim()
          if (data !== '[DONE]') {
            try {
              const parsedData = JSON.parse(data)
              if (parsedData.content) {
                yield parsedData.content
              }
            } catch (e) {
              // Ignore parse errors at the end
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing medical model stream:', error)
      throw error
    } finally {
      // Make sure to release the reader
      reader.releaseLock()
    }
  } catch (error) {
    console.error(`Error in streaming response from ${provider}:`, error)
    throw error
  }
}
