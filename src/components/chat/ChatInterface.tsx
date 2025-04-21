import { useAuth } from '@/components/auth/AuthProvider'
import ResponseFeedback from '@/components/feedback/ResponseFeedback'
import LoadingDots from '@/components/LoadingDots'
import Markdown from '@/components/Markdown'
import {
  MedicalModelProvider,
  generateMedicalResponse,
  generateStreamingMedicalResponse,
  listMedicalModels,
} from '@/services/medicalModelService'
import {
  ChatMessage,
  generateResponse,
  listModels,
} from '@/services/ollamaService'
import CancelIcon from '@mui/icons-material/Cancel'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import SendIcon from '@mui/icons-material/Send'
import StopIcon from '@mui/icons-material/Stop'
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'

// Define message type
interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant' | 'system'
  timestamp: Date
  modelInfo?: string
  isLoading?: boolean
  queryText?: string // Added to track the query that generated this response
}

// Define model types
interface OllamaModel {
  type: 'ollama'
  name: string
}

interface MedicalModel {
  type: 'medical'
  provider: MedicalModelProvider
  name: string
  description: string
}

type ModelType = OllamaModel | MedicalModel

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]) // For conversation history
  const [newMessage, setNewMessage] = useState('')
  const [availableModels, setAvailableModels] = useState<ModelType[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [useStreaming, setUseStreaming] = useState(false) // Default to streaming
  const [modelType, setModelType] = useState<'ollama' | 'medical'>('ollama')
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

        // Fetch medical models
        const medicalModelsData = await listMedicalModels()
        const medicalModels: MedicalModel[] = medicalModelsData.map(model => ({
          type: 'medical',
          provider: model.provider as MedicalModelProvider,
          name: model.model,
          description: model.description,
        }))

        // Combine all models
        const allModels = [...ollamaModels, ...medicalModels]
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

  // Display welcome message on first load
  useEffect(() => {
    // Only add greeting if messages array is empty and we have user information
    if (messages.length === 0 && user) {
      const greeting: Message = {
        id: 'greeting',
        content: `Hello ${user.firstName || 'there'}! Welcome to MediChat. How can I assist with your healthcare questions today?`,
        sender: 'assistant',
        timestamp: new Date(),
        modelInfo: 'System Greeting',
      }

      setMessages([greeting])

      // Also add greeting to chatMessages for context
      setChatMessages([
        {
          role: 'assistant',
          content: `Hello ${user.firstName || 'there'}! Welcome to MediChat. How can I assist with your healthcare questions today?`,
        },
      ])
    }
  }, [user, messages.length])

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
    if (!newMessage.trim() || !selectedModel) return

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
      // Different system prompts based on model type
      const systemPrompt =
        'You are a medical AI assistant. Provide healthcare information with appropriate disclaimers, always recommending professional medical consultation for serious concerns.'

      // Create a placeholder for the assistant's message
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        content: '',
        sender: 'assistant',
        timestamp: new Date(),
        modelInfo:
          selectedModel.type === 'ollama'
            ? `Ollama: ${selectedModel.name}`
            : `Medical: ${selectedModel.name}`,
        isLoading: true,
        queryText: newMessage, // Track the query
      }

      // Add the empty message to the state
      setMessages(prev => [...prev, assistantMessage])

      // Handle response based on model type and streaming preference
      if (selectedModel.type === 'ollama') {
        await handleOllamaResponse(
          selectedModel,
          systemPrompt,
          updatedChatMessages,
          newMessage,
          assistantMessageId,
          controller.signal
        )
      } else {
        await handleMedicalResponse(
          selectedModel,
          systemPrompt,
          updatedChatMessages,
          newMessage,
          assistantMessageId,
          controller.signal
        )
      }
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
    systemPrompt: string,
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
        system: systemPrompt,
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
      } else {
        throw error
      }
    }
  }

  // Handle response from medical models
  const handleMedicalResponse = async (
    model: MedicalModel,
    systemPrompt: string,
    messages: ChatMessage[],
    prompt: string,
    messageId: string,
    abortSignal: AbortSignal
  ) => {
    if (useStreaming) {
      // Use streaming for medical models
      const streamingResponse = await generateStreamingMedicalResponse({
        provider: model.provider,
        prompt,
        system: systemPrompt,
        messages,
        options: { stream: true, signal: abortSignal },
      })

      let fullResponse = ''

      try {
        // Process each chunk
        for await (const chunk of streamingResponse) {
          // Check if request has been aborted
          if (abortSignal.aborted) {
            break
          }

          fullResponse += chunk
          // Update the message with accumulated response
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId
                ? { ...msg, content: fullResponse, isLoading: false }
                : msg
            )
          )
        }

        // Only update chat history if not aborted
        if (!abortSignal.aborted) {
          setChatMessages(prev => [
            ...prev,
            { role: 'assistant', content: fullResponse },
          ])
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('Medical streaming response aborted')
        } else {
          throw error
        }
      }
    } else {
      try {
        // Use non-streaming approach
        const assistantResponse = await generateMedicalResponse({
          provider: model.provider,
          prompt,
          system: systemPrompt,
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
          console.log('Medical response request aborted')
        } else {
          throw error
        }
      }
    }
  }

  const handleModelTypeChange = (
    event: React.SyntheticEvent,
    newValue: 'ollama' | 'medical'
  ) => {
    setModelType(newValue)

    // Select the first model of the selected type
    const modelOfType = availableModels.find(model => model.type === newValue)
    if (modelOfType) {
      setSelectedModel(modelOfType)
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
        height: '600px',
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
          <Tabs
            value={modelType}
            onChange={handleModelTypeChange}
            sx={{ mb: 1 }}
          >
            <Tab label="General Models" value="ollama" />
            <Tab
              label="Medical Models"
              value="medical"
              icon={<LocalHospitalIcon />}
              iconPosition="start"
            />
          </Tabs>

          <FormControl fullWidth size="small">
            <InputLabel id="model-select-label">Select Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={
                selectedModel
                  ? selectedModel.type === 'ollama'
                    ? selectedModel.name
                    : selectedModel.name
                  : ''
              }
              onChange={handleModelChange}
              label="Select Model"
            >
              {availableModels
                .filter(model => model.type === modelType)
                .map(model => (
                  <MenuItem
                    key={
                      model.type === 'ollama'
                        ? model.name
                        : `${model.provider}-${model.name}`
                    }
                    value={model.type === 'ollama' ? model.name : model.name}
                  >
                    {model.type === 'ollama' ? (
                      model.name
                    ) : (
                      <Tooltip title={model.description}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>{model.name}</Typography>
                          <Chip
                            size="small"
                            label={model.provider}
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Tooltip>
                    )}
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
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ textAlign: 'center', mt: 4 }}
          >
            Start a conversation with a specialized medical AI assistant
          </Typography>
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
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor:
                    message.sender === 'assistant'
                      ? 'background.paper'
                      : 'primary.light',
                  borderRadius: 2,
                  color:
                    message.sender === 'user'
                      ? 'primary.contrastText'
                      : 'text.primary',
                }}
              >
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
                      <Tooltip title="Cancel response">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={handleAbortQuery}
                        >
                          <StopIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
              </Paper>
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
