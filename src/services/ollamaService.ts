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

// Enhanced system prompt that helps the model know about doctor tools
const systemPrompt = `You are a medical AI assistant for MediChat. Provide healthcare information with appropriate disclaimers, always recommending professional medical consultation for serious concerns.
      
You have access to tools that allow you to search for doctors in our system. When users ask about finding doctors, specialists, or healthcare providers, USE THESE TOOLS IMMEDIATELY to provide the requested information. 

IMPORTANT INSTRUCTIONS:
1. DO NOT show the user the tool syntax or JSON format for calling tools
2. DO NOT ask for confirmation before using tools
3. DO NOT suggest that the user use the tools themselves
4. NEVER respond with text like {"name": "toolName", "parameters": {...}}
5. JUST USE the tools directly yourself and present the results in a friendly format

Available doctor tools:
- getAllDoctors: Get a list of all doctors - USE THIS WHEN USERS ASK FOR ALL DOCTORS
- getDoctorById: Get details of a specific doctor by their ID
- getDoctorsBySpecialty: Get all doctors with a specific medical specialty like Cardiology, Neurology, etc.
- getAvailableDoctors: Get doctors who are accepting new patients
- searchDoctorsByName: Search for doctors by name - USE THIS WHEN USERS ASK ABOUT A SPECIFIC DOCTOR BY NAME
- findDoctorsByInsurance: Find doctors who accept specific insurance providers

When users ask about a specific doctor by name, ALWAYS use the searchDoctorsByName tool immediately.

After retrieving information with tools, format the response in a user-friendly way. Include key details like specialty, location, contact information, and availability.`

// Generate response from Ollama API via our Next.js API route
export async function generateResponse({
  model,
  prompt,
  system = systemPrompt,
  messages = [],
  options = {},
}: GenerateRequestOptions): Promise<string> {
  try {
    // Use chat API if there are previous messages
    if (messages.length === 0) {
      messages.push({ role: 'user', content: prompt })
    }

    // For single prompts, we'll still use the chat endpoint but format differently
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (options.signal) {
      headers['X-Request-ID'] = Date.now().toString()
    }

    const response = await fetch('/api/ollama/chat', {
      method: 'POST',
      headers,
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
