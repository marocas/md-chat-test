import { ChatMessage } from '@/services/ollamaService'
import SendIcon from '@mui/icons-material/Send'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Markdown from '../Markdown'

// Component for displaying a message
const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
          mr: isUser ? 0 : 2,
          ml: isUser ? 2 : 0,
        }}
      >
        {isUser ? 'U' : 'AI'}
      </Avatar>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '70%',
          borderRadius: 2,
          bgcolor: isUser ? 'primary.light' : 'background.paper',
        }}
      >
        <Markdown>{message.content}</Markdown>
      </Paper>
    </Box>
  )
}

interface ChatInterfaceMCPProps {
  initialMessages?: ChatMessage[]
}

export default function ChatInterfaceMCP({
  initialMessages = [],
}: ChatInterfaceMCPProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [model, setModel] = useState('mistral')

  // Handles sending a new message
  const handleSendMessage = async () => {
    if (input.trim() === '') return

    // Add user message to state
    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call the MCP API endpoint
      const response = await fetch('/api/ollama/mcp-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Add assistant's response to messages
      if (data.message) {
        setMessages(prev => [...prev, data.message])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          MediChat MCP (Doctor Tools)
        </Typography>
      </Paper>

      {/* Messages container */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          backgroundColor: 'background.default',
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              textAlign: 'center',
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Welcome to MediChat
            </Typography>
            <Typography variant="body1">
              Ask about doctors, treatments, or medical conditions.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Examples:
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                • "Can you recommend a cardiologist?"
              </Typography>
              <Typography variant="body2">
                • "Which doctors accept Blue Cross insurance?"
              </Typography>
              <Typography variant="body2">
                • "Find neurologists accepting new patients"
              </Typography>
            </Box>
          </Box>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))
        )}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box
        component="form"
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'background.paper',
        }}
        onSubmit={e => {
          e.preventDefault()
          handleSendMessage()
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about doctors or medical questions..."
          value={input}
          onChange={e => setInput(e.target.value)}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={isLoading || input.trim() === ''}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}
