// @ts-nocheck
import {
  completeOllamaRequest,
  registerOllamaRequest,
} from '@/services/ollamaRequestManager'
import getTools, { executeToolCall } from '@/services/ollamaTools'
import type { NextApiRequest, NextApiResponse } from 'next'
import { GenerateRequest, Ollama } from 'ollama'

// Define the message structure
interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  images?: string[]
  tool_calls?: ToolCall[]
  tool_call_id?: string
  name?: string
}

// Define the tool call structure as expected by Ollama
interface ToolCall {
  id: string
  type: string
  function: {
    name: string
    arguments: string
  }
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

    const tools = await getTools()

    // Create an Ollama client instance
    const ollama = new Ollama({ host: 'http://localhost:11434' })

    // Prepare messages array with system message if provided
    let chatMessages = [...messages]
    if (system) {
      chatMessages = [{ role: 'system', content: system }, ...chatMessages]
    }

    try {
      // Generate chat completion with tool handling
      const response = await ollama.chat({
        tools,
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

      let finalResponse = response

      // Check if we have tool calls from the model response
      if (
        response.message.tool_calls &&
        response.message.tool_calls.length > 0
      ) {
        // Process each tool call and gather tool results
        const toolResults = await Promise.all(
          response.message.tool_calls.map(async toolCall => {
            try {
              const toolName = toolCall.function.name
              let argsObj = {}

              // Add robust error handling for JSON parsing
              try {
                // Check if arguments are already an object
                if (typeof toolCall.function.arguments === 'object') {
                  argsObj = toolCall.function.arguments
                } else {
                  // Try to parse string as JSON
                  const argsStr = toolCall.function.arguments.trim()
                  // Handle empty arguments case
                  if (!argsStr || argsStr === '{}') {
                    argsObj = {}
                  } else {
                    try {
                      argsObj = JSON.parse(argsStr)
                    } catch (parseError) {
                      // For cases where the model returns malformed JSON
                      console.warn(
                        `Invalid JSON in tool arguments for ${toolName}:`,
                        toolCall.function.arguments
                      )

                      // Attempt to extract key-value pairs using regex for common patterns
                      if (
                        toolName === 'findDoctorsByInsurance' &&
                        typeof argsStr === 'string'
                      ) {
                        // Try to extract insurance name
                        const insuranceMatch = argsStr.match(
                          /insurance["\s:]+([^"}\s]+)/i
                        )
                        if (insuranceMatch && insuranceMatch[1]) {
                          argsObj = { insurance: insuranceMatch[1] }
                        }
                      } else if (
                        toolName === 'getDoctorsBySpecialty' &&
                        typeof argsStr === 'string'
                      ) {
                        // Try to extract specialty name
                        const specialtyMatch = argsStr.match(
                          /specialty["\s:]+([^"}\s]+)/i
                        )
                        if (specialtyMatch && specialtyMatch[1]) {
                          argsObj = { specialty: specialtyMatch[1] }
                        }
                      } else if (
                        toolName === 'searchDoctorsByName' &&
                        typeof argsStr === 'string'
                      ) {
                        // Try to extract doctor name
                        const nameMatch = argsStr.match(
                          /name["\s:]+([^"}\s]+)/i
                        )
                        if (nameMatch && nameMatch[1]) {
                          argsObj = { name: nameMatch[1] }
                        }
                      }

                      // If we couldn't extract parameters, use empty object
                      if (Object.keys(argsObj).length === 0) {
                        argsObj = {}
                      }
                    }
                  }
                }
              } catch (error) {
                console.error(
                  `Error parsing arguments for tool ${toolName}:`,
                  error
                )
                argsObj = {} // Fall back to empty arguments
              }

              console.log(`Executing tool ${toolName} with args:`, argsObj)

              // Execute the tool call with our executeToolCall function
              const result = await executeToolCall(toolName, argsObj)

              // Format the tool result as a message
              return {
                tool_call_id: toolCall.id,
                role: 'tool',
                name: toolName,
                content: JSON.stringify(result),
              } as ChatMessage
            } catch (error) {
              console.error(
                `Error executing tool call ${toolCall.function.name}:`,
                error
              )
              return {
                tool_call_id: toolCall.id,
                role: 'tool',
                name: toolCall.function.name,
                content: JSON.stringify({
                  error: `Error executing tool: ${error.message}`,
                }),
              } as ChatMessage
            }
          })
        )

        // Add the assistant message with tool calls and tool results to messages
        const updatedMessages = [
          ...chatMessages,
          response.message,
          ...toolResults,
        ]

        // Make another call with tool results
        const secondResponse = await ollama.chat({
          model,
          messages: updatedMessages,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            ...options,
          },
        })

        finalResponse = secondResponse
      }

      // Return the final response
      return res.status(200).json({
        message: {
          role: 'assistant',
          content: finalResponse.message.content,
        },
      })
    } catch (error) {
      console.error('Error during chat generation:', error)
      return res.status(500).json({ error: 'Internal server error' })
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
