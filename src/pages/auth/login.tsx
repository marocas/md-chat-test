import { useSession } from '@/context/SessionContext'
import { signIn } from '@/services/authService'
import AppleIcon from '@mui/icons-material/Apple'
import FacebookIcon from '@mui/icons-material/Facebook'
import GoogleIcon from '@mui/icons-material/Google'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useSession()

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    // Redirect to the originally requested page or home
    const redirect = router.query.redirect as string
    console.log('Redirecting to:', { redirect, email, password, rememberMe })

    const { user, error } = await login(email, password, rememberMe)

    if (error) {
      setError(error)
      return
    }

    window.location.href = redirect || '/'
  }

  const handleSocialLogin = async (provider: string) => {
    console.log('Logging in with:', provider)
    try {
      await signIn(null, null, rememberMe, provider)
      // Social login will handle redirect automatically
    } catch (err) {
      setError(`Error signing in with ${provider}`)
      console.error(`${provider} login error:`, err)
    }
  }

  return (
    <>
      <Head>
        <title>Sign In - MediChat</title>
        <meta
          name="description"
          content="Sign in to your MediChat account to access healthcare services"
        />
      </Head>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Welcome to MediChat
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to access your healthcare account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember me"
              />
              <MuiLink
                component={Link}
                href="/auth/forgot-password"
                passHref
                variant="body2"
              >
                Forgot password?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              size="large"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', my: 2 }}>
              <Typography variant="body2">
                Don&apos;t have an account?{' '}
                <MuiLink component={Link} href="/auth/register" passHref>
                  Sign Up
                </MuiLink>
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialLogin('Google')}
                  sx={{ py: 1 }}
                  disabled={isLoading}
                >
                  Google
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  onClick={() => handleSocialLogin('Facebook')}
                  sx={{ py: 1 }}
                  disabled={isLoading}
                >
                  Facebook
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AppleIcon />}
                  onClick={() => handleSocialLogin('Apple')}
                  sx={{ py: 1 }}
                  disabled={isLoading}
                >
                  Apple
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
