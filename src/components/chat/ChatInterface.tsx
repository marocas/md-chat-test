import { useAuth } from '@/components/auth/AuthProvider'
import ResponseFeedback from '@/components/feedback/ResponseFeedback'
import LoadingDots from '@/components/LoadingDots'
import Markdown from '@/components/Markdown'
import {
  ChatMessage,
  generateResponse,
  listModels,
} from '@/services/ollamaService'
import CancelIcon from '@mui/icons-material/Cancel'
import SendIcon from '@mui/icons-material/Send'
import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'
import { Bubble } from './ChatInterface.styled'
import { Message, ModelType, OllamaModel } from './ChatInterface.types'
import GreetingMessage from './GreetingMessage'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]) // For conversation history
  const [newMessage, setNewMessage] = useState('')
  const [availableModels, setAvailableModels] = useState<ModelType[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [useStreaming, setUseStreaming] = useState(false) // Default to streaming
  const [modelType, setModelType] = useState<ModelType['type']>('ollama')
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { enqueueSnackbar } = useSnackbar()
  const { currentUser: user } = useAuth()

  // Fetch available models on component mount
  useEffect(() => {
    async function fetchModels() {
      try {
        // Fetch Ollama models
        const ollamaModelNames = await listModels()
        const ollamaModels: OllamaModel[] = ollamaModelNames.map(name => ({
          type: 'ollama',
          name,
        }))

        // Combine all models
        const allModels = [...ollamaModels]
        setAvailableModels(allModels)

        // Set default model if available
        if (allModels.length > 0) {
          setSelectedModel(allModels[0])
        }
      } catch (error) {
        console.error('Error fetching models:', error)
        enqueueSnackbar('Failed to fetch available models', {
          variant: 'error',
        })
      }
    }

    fetchModels()
  }, [enqueueSnackbar])

  // Clean up abortion controller
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort()
      }
    }
  }, [abortController])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Function to abort the current query
  const handleAbortQuery = () => {
    if (abortController) {
      try {
        // Add a reason for aborting to prevent the "aborted without reason" error
        abortController.abort('Query cancelled by user')
      } catch (error) {
        console.log('Error aborting request:', error)
      }

      setAbortController(null)

      // Update the last message to show that it was aborted
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage.isLoading) {
          return prev.map(msg =>
            msg.id === lastMessage.id
              ? {
                  ...msg,
                  content: msg.content + '\n\n*Query was aborted by user*',
                  isLoading: false,
                }
              : msg
          )
        }
        return prev
      })

      setIsLoading(false)
      enqueueSnackbar('Query cancelled', { variant: 'info' })
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || selectedModel === null) return

    // Create a new AbortController for this request
    const controller = new AbortController()
    setAbortController(controller)

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])

    // Add to chat history for context
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: newMessage,
    }

    const updatedChatMessages = [...chatMessages, userChatMessage]
    setChatMessages(updatedChatMessages)

    setNewMessage('')
    setIsLoading(true)

    try {
      // Create a placeholder for the assistant's message
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: '',
        sender: 'assistant',
        timestamp: new Date(),
        modelInfo: `Ollama: ${selectedModel.name}`,
        isLoading: true,
        queryText: newMessage, // Track the query
      }

      // Add the empty message to the state
      setMessages(prev => [...prev, assistantMessage])

      // Handle response based on model type and streaming preference

      await handleOllamaResponse(
        selectedModel,
        updatedChatMessages,
        newMessage,
        assistantMessageId,
        controller.signal
      )
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Request was aborted')
      } else if (error === 'Query cancelled by user') {
        console.error('Error generating response:', error)
      } else {
        console.error('Unexpected error:', error)
        enqueueSnackbar('Failed to generate response', { variant: 'error' })
      }
    } finally {
      setIsLoading(false)
      setAbortController(null)
    }
  }

  // Handle response from Ollama models
  const handleOllamaResponse = async (
    model: OllamaModel,
    messages: ChatMessage[],
    prompt: string,
    messageId: string,
    abortSignal: AbortSignal
  ) => {
    try {
      // Use non-streaming approach
      const assistantResponse = await generateResponse({
        model: model.name,
        prompt,
        messages,
        options: { signal: abortSignal },
      })

      // Check if request has been aborted
      if (abortSignal.aborted) {
        return
      }

      // Update the message with the full response
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, content: assistantResponse, isLoading: false }
            : msg
        )
      )

      // Update chat history
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: assistantResponse },
      ])
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Response request aborted')
        enqueueSnackbar('Response request aborted', { variant: 'info' })
      } else {
        console.log('Error generating response:', error)
        enqueueSnackbar('Failed to generate response', { variant: 'error' })
        throw error
      }
    }
  }

  const handleModelChange = (event: SelectChangeEvent<string>) => {
    const modelValue = event.target.value
    const selected = availableModels.find(model => {
      if (model.type === 'ollama') {
        return model.name === modelValue
      } else {
        return model.name === modelValue
      }
    })

    if (selected) {
      setSelectedModel(selected)
    }
  }

  const toggleStreaming = () => {
    setUseStreaming(prev => !prev)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100dvh - 282px)',
        p: 2,
      }}
    >
      {/* Chat header with model selection */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mb: 2,
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h5">MediChat</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Streaming
              </Typography>
              <Switch
                checked={useStreaming}
                onChange={toggleStreaming}
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormControl fullWidth size="small">
            <InputLabel id="model-select-label">Select Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={selectedModel ? selectedModel.name : ''}
              onChange={handleModelChange}
              label="Select Model"
            >
              {availableModels
                .filter(model => model.type === modelType)
                .map(model => (
                  <MenuItem key={model.name} value={model.name}>
                    {model.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Chat messages area */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 ? (
          <GreetingMessage />
        ) : (
          messages.map(message => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                mb: 2,
                alignSelf:
                  message.sender === 'user' ? 'flex-end' : 'flex-start',
                justifyContent:
                  message.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Avatar
                sx={{
                  bgcolor:
                    message.sender === 'assistant'
                      ? message.modelInfo?.includes('Medical')
                        ? 'error.main' // Red for medical models
                        : 'primary.main' // Blue for general models
                      : 'secondary.main',
                  mr: 2,
                  ml: message.sender === 'assistant' ? 0 : 2,
                  order: message.sender === 'user' ? 1 : 0,
                }}
              >
                {message.sender === 'user'
                  ? `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`
                  : 'MC'}
              </Avatar>

              <Bubble elevation={1} sender={message.sender}>
                {message.sender === 'assistant' ? (
                  message.isLoading ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <LoadingDots />
                    </Box>
                  ) : (
                    <>
                      <Markdown>{message.content}</Markdown>

                      {message.id !== 'greeting' && (
                        <ResponseFeedback
                          messageId={message.id}
                          queryText={message.queryText || ''}
                          responseText={message.content}
                          modelInfo={message.modelInfo || ''}
                          userId={user?.id || 'anonymous'}
                          conversationContext={chatMessages}
                        />
                      )}
                    </>
                  )
                ) : (
                  <Typography variant="body1">{message.content}</Typography>
                )}

                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 1, opacity: 0.7 }}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Bubble>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Message input area */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={
            modelType === 'ollama'
              ? 'Type a message...'
              : 'Ask a medical question...'
          }
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          disabled={isLoading}
        />
        {isLoading ? (
          <Tooltip title="Cancel current query">
            <IconButton color="error" onClick={handleAbortQuery} sx={{ ml: 1 }}>
              <CancelIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton
            color={modelType === 'ollama' ? 'primary' : 'error'}
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading || !selectedModel}
            sx={{ ml: 1 }}
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        )}
      </Box>
    </Box>
  )
}
