import AppleIcon from '@mui/icons-material/Apple'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import FacebookIcon from '@mui/icons-material/Facebook'
import GoogleIcon from '@mui/icons-material/Google'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
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
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const steps = [
  'Personal Information',
  'Account Security',
  'Medical Information',
]

export default function RegisterPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    password: '',
    confirmPassword: '',
    insuranceProvider: '',
    insuranceNumber: '',
    primaryCare: '',
    emergencyContact: '',
    agreeTerms: false,
  })

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleNext = () => {
    // Validation logic based on current step
    if (activeStep === 0) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('Please fill in all required fields')
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address')
        return
      }
    }

    if (activeStep === 1) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please set your password')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }
    }

    if (activeStep === 2) {
      if (!formData.agreeTerms) {
        setError('Please agree to the terms and conditions')
        return
      }
    }

    // Clear any previous errors
    setError(null)

    if (activeStep === steps.length - 1) {
      handleRegistration()
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleRegistration = () => {
    // In a real app, this would submit the form data to an API
    console.log('Registration data:', formData)

    // Simulating successful registration
    router.push('/auth/register-success')
  }

  const handleSocialSignup = (provider: string) => {
    // In a real app, this would initiate OAuth flow with the selected provider
    console.log(`Signup with ${provider}`)
  }

  // Render different form content based on the active step
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Personal Information
        return (
          <>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  autoFocus
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </>
        )
      case 1: // Account Security
        return (
          <>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
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
              </Grid>
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Password requirements:</Typography>
              <ul>
                <li>
                  <Typography variant="body2">At least 8 characters</Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Include uppercase and lowercase letters
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Include at least one number
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Include at least one special character
                  </Typography>
                </li>
              </ul>
            </Box>
          </>
        )
      case 2: // Medical Information
        return (
          <>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Insurance Provider"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Insurance ID Number"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Primary Care Physician"
                  name="primaryCare"
                  value={formData.primaryCare}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Emergency Contact (Name and Phone)"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeTerms"
                      color="primary"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the Terms of Service, Privacy Policy, and
                      consent to the use of my data for healthcare services
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </>
        )
      default:
        return 'Unknown step'
    }
  }

  return (
    <>
      <Head>
        <title>Create Account - MediChat</title>
        <meta
          name="description"
          content="Create your MediChat account to access personalized healthcare services"
        />
      </Head>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Create Your MediChat Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join our healthcare platform for better care management
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {}
              const labelProps: { icon?: React.ReactElement } = {}

              if (index === 0) {
                labelProps.icon = <PersonIcon />
              } else if (index === 1) {
                labelProps.icon = <LockIcon />
              } else {
                labelProps.icon = <LocalHospitalIcon />
              }

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 2, mb: 4 }}>{getStepContent(activeStep)}</Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={
                activeStep === steps.length - 1 ? (
                  <CheckCircleOutlineIcon />
                ) : undefined
              }
            >
              {activeStep === steps.length - 1 ? 'Create Account' : 'Continue'}
            </Button>
          </Box>

          {activeStep === 0 && (
            <>
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
                    onClick={() => handleSocialSignup('Google')}
                    sx={{ py: 1 }}
                  >
                    Google
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FacebookIcon />}
                    onClick={() => handleSocialSignup('Facebook')}
                    sx={{ py: 1 }}
                  >
                    Facebook
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AppleIcon />}
                    onClick={() => handleSocialSignup('Apple')}
                    sx={{ py: 1 }}
                  >
                    Apple
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link href="/auth/login" passHref>
                    <MuiLink>Sign In</MuiLink>
                  </Link>
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </>
  )
}
