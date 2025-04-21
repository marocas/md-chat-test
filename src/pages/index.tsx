import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ChatIcon from '@mui/icons-material/Chat'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home() {
  const [currentYear, setCurrentYear] = useState<number | null>(null)

  // Set the year on client-side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <>
      <Head>
        <title>MediChat - Healthcare Communication Platform</title>
        <meta
          name="description"
          content="Your comprehensive healthcare communication platform"
        />
      </Head>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            MediChat
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            color="text.secondary"
            paragraph
          >
            Your comprehensive healthcare communication platform
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            startIcon={<ChatIcon />}
          >
            Start Chat
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Our Services
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <SearchIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography gutterBottom variant="h5" component="h2">
                    Medical Search
                  </Typography>
                  <Typography>
                    Access reliable information about symptoms, conditions, and
                    treatments.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <MedicalServicesIcon
                    color="primary"
                    sx={{ fontSize: 48, mb: 2 }}
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Find Doctors
                  </Typography>
                  <Typography>
                    Discover healthcare providers by specialty, location, and
                    availability.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" color="primary">
                    Find Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <CalendarMonthIcon
                    color="primary"
                    sx={{ fontSize: 48, mb: 2 }}
                  />
                  <Typography gutterBottom variant="h5" component="h2">
                    Appointments
                  </Typography>
                  <Typography>
                    Schedule, manage, and receive reminders for your medical
                    appointments.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" color="primary">
                    Schedule
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <ChatIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography gutterBottom variant="h5" component="h2">
                    Consultations
                  </Typography>
                  <Typography>
                    Chat with healthcare professionals securely through text or
                    video.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" color="primary">
                    Start Chat
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            bgcolor: 'primary.light',
            borderRadius: 4,
            p: 6,
            my: 6,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to take control of your healthcare?
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Join thousands of patients who have simplified their healthcare
            journey with MediChat.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            py: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear || ''} MediChat. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </>
  )
}
