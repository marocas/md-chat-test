import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AddIcon from '@mui/icons-material/Add'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PersonIcon from '@mui/icons-material/Person'
import PlaceIcon from '@mui/icons-material/Place'
import VideocamIcon from '@mui/icons-material/Videocam'
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import Head from 'next/head'
import { useState } from 'react'

// Mock appointment data
const mockAppointments = {
  upcoming: [
    {
      id: 'a1',
      doctorName: 'Dr. Sarah Johnson',
      doctorSpecialty: 'Cardiologist',
      date: 'April 22, 2025',
      time: '10:30 AM',
      location: 'New York Medical Center',
      type: 'in-person',
      status: 'confirmed',
    },
    {
      id: 'a2',
      doctorName: 'Dr. Michael Chen',
      doctorSpecialty: 'Dermatologist',
      date: 'May 5, 2025',
      time: '2:15 PM',
      location: 'Video Consultation',
      type: 'video',
      status: 'confirmed',
    },
  ],
  past: [
    {
      id: 'a3',
      doctorName: 'Dr. Emily Patterson',
      doctorSpecialty: 'Pediatrician',
      date: 'March 15, 2025',
      time: '9:00 AM',
      location: "Children's Hospital",
      type: 'in-person',
      status: 'completed',
    },
    {
      id: 'a4',
      doctorName: 'Dr. Robert Wilson',
      doctorSpecialty: 'Orthopedic Surgeon',
      date: 'February 20, 2025',
      time: '11:45 AM',
      location: 'Sports Medicine Center',
      type: 'in-person',
      status: 'completed',
    },
  ],
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointment-tabpanel-${index}`}
      aria-labelledby={`appointment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AppointmentsPage() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <>
      <Head>
        <title>My Appointments - MediChat</title>
        <meta
          name="description"
          content="Manage your healthcare appointments"
        />
      </Head>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1">
            My Appointments
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Schedule New Appointment
          </Button>
        </Box>

        {/* Appointment Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Badge
                badgeContent={mockAppointments.upcoming.length}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: 18,
                    height: 30,
                    width: 30,
                    borderRadius: '50%',
                  },
                }}
              >
                <EventAvailableIcon
                  color="primary"
                  sx={{ fontSize: 48, mb: 1 }}
                />
              </Badge>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Upcoming Appointments
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <CalendarMonthIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Next Appointment
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {mockAppointments.upcoming[0]?.date} at{' '}
                {mockAppointments.upcoming[0]?.time}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Badge
                badgeContent={mockAppointments.past.length}
                color="secondary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: 18,
                    height: 30,
                    width: 30,
                    borderRadius: '50%',
                  },
                }}
              >
                <CalendarMonthIcon
                  color="action"
                  sx={{ fontSize: 48, mb: 1 }}
                />
              </Badge>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Past Appointments
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Appointment Lists */}
        <Paper elevation={2}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="appointment tabs"
            >
              <Tab
                icon={<EventAvailableIcon />}
                iconPosition="start"
                label="Upcoming"
              />
              <Tab
                icon={<CalendarMonthIcon />}
                iconPosition="start"
                label="Past"
              />
            </Tabs>
          </Box>

          {/* Upcoming Appointments Tab */}
          <TabPanel value={tabValue} index={0}>
            {mockAppointments.upcoming.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No upcoming appointments
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  sx={{ mt: 2 }}
                >
                  Schedule an Appointment
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {mockAppointments.upcoming.map(appointment => (
                  <Grid size={12} key={appointment.id}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                bgcolor: 'primary.main',
                                width: 56,
                                height: 56,
                                mr: 2,
                              }}
                            >
                              {appointment.type === 'video' ? (
                                <VideocamIcon fontSize="large" />
                              ) : (
                                <PersonIcon fontSize="large" />
                              )}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {appointment.doctorName}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                {appointment.doctorSpecialty}
                              </Typography>
                              <Chip
                                size="small"
                                label={appointment.status.toUpperCase()}
                                color="success"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          </Box>
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <CalendarMonthIcon
                                color="primary"
                                sx={{ mr: 1, fontSize: 20 }}
                              />
                              <Typography variant="body1">
                                {appointment.date}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon
                                color="primary"
                                sx={{ mr: 1, fontSize: 20 }}
                              />
                              <Typography variant="body1">
                                {appointment.time}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PlaceIcon
                                color="primary"
                                sx={{ mr: 1, fontSize: 20 }}
                              />
                              <Typography variant="body1">
                                {appointment.location}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            sx={{ mr: 1 }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            sx={{ mr: 1 }}
                          >
                            Reschedule
                          </Button>
                          {appointment.type === 'video' && (
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<VideocamIcon />}
                            >
                              Join Video
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          {/* Past Appointments Tab */}
          <TabPanel value={tabValue} index={1}>
            {mockAppointments.past.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No past appointments
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {mockAppointments.past.map(appointment => (
                  <Grid size={12} key={appointment.id}>
                    <Card sx={{ opacity: 0.8 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                bgcolor: 'grey.500',
                                width: 56,
                                height: 56,
                                mr: 2,
                              }}
                            >
                              {appointment.type === 'video' ? (
                                <VideocamIcon fontSize="large" />
                              ) : (
                                <PersonIcon fontSize="large" />
                              )}
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {appointment.doctorName}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                {appointment.doctorSpecialty}
                              </Typography>
                              <Chip
                                size="small"
                                label={appointment.status.toUpperCase()}
                                color="default"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          </Box>
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <CalendarMonthIcon
                                color="action"
                                sx={{ mr: 1, fontSize: 20 }}
                              />
                              <Typography variant="body1">
                                {appointment.date}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon
                                color="action"
                                sx={{ mr: 1, fontSize: 20 }}
                              />
                              <Typography variant="body1">
                                {appointment.time}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PlaceIcon
                                color="action"
                                sx={{ mr: 1, fontSize: 20 }}
                              />
                              <Typography variant="body1">
                                {appointment.location}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                          }}
                        >
                          <Button variant="outlined">View Summary</Button>
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ ml: 1 }}
                          >
                            Book Follow-up
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        </Paper>
      </Container>
    </>
  )
}
