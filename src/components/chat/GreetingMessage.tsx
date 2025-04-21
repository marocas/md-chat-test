import { Box, Typography } from '@mui/material'
import { useAuth } from '../auth/AuthProvider'

export default function GreetingMessage() {
  const { authState, currentUser: user } = useAuth()
  return (
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
      {authState.isAuthenticated ? (
        <Typography variant="h6" gutterBottom>
          Hello {user?.name}!
        </Typography>
      ) : (
        <Typography variant="h6" gutterBottom>
          Welcome to MediChat
        </Typography>
      )}
      <Typography variant="body1">
        Ask about doctors, treatments, or medical conditions.
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Examples:
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2">
          "Can you recommend a cardiologist?"
        </Typography>
        <Typography variant="body2">
          "Which doctors accept Blue Cross insurance?"
        </Typography>
        <Typography variant="body2">
          "Find neurologists accepting new patients"
        </Typography>
      </Box>
    </Box>
  )
}
