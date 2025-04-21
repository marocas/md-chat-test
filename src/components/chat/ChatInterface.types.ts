// Define message type
export interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant' | 'system'
  timestamp: Date
  modelInfo?: string
  isLoading?: boolean
  queryText?: string // Added to track the query that generated this response
}

// Define model types
export interface OllamaModel {
  type: 'ollama'
  name: string
}

export type ModelType = OllamaModel
