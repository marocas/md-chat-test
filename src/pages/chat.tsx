import { useAuth } from '@/components/auth/AuthProvider'
import ChatInterface from '@/components/chat/ChatInterface'
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function ChatPage() {
  const { authState, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !authState.isAuthenticated) {
      router.push('/auth/login?redirect=/chat')
    }
  }, [authState.isAuthenticated, isLoading, router])

  // Show loading state while authentication state is being determined
  if (isLoading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100dvh - 124px)',
          mt: 4,
        }}
      >
        <CircularProgress />
      </Container>
    )
  }

  // Don't render content unless authenticated
  if (!authState.isAuthenticated) {
    return null
  }

  return (
    <>
      <Head>
        <title>Chat with MediChat Assistant</title>
        <meta
          name="description"
          content="Chat with our medical assistant to find information, search for doctors, schedule appointments, or get medical advice."
        />
      </Head>
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          height: 'calc(100dvh - 124px)',
        }}
      >
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            MediChat Assistant
          </Typography>
          <Typography variant="body1">
            Chat with our medical assistant to find information, search for
            doctors, schedule appointments, or get medical advice.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <ChatInterface />
          </Box>
        </Paper>
      </Container>
    </>
  )
}
