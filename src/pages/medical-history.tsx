import DownloadIcon from '@mui/icons-material/Download'
import EventNoteIcon from '@mui/icons-material/EventNote'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MasksIcon from '@mui/icons-material/Masks'
import MedicationIcon from '@mui/icons-material/Medication'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart'
import PrintIcon from '@mui/icons-material/Print'
import ScienceIcon from '@mui/icons-material/Science'
import ShareIcon from '@mui/icons-material/Share'
import VaccinesIcon from '@mui/icons-material/Vaccines'
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useState } from 'react'

// Mock medical history data
const mockMedicalHistory = {
  visits: [
    {
      id: 'v1',
      date: 'March 15, 2025',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      location: 'New York Medical Center',
      reason: 'Annual heart checkup',
      notes:
        'Blood pressure slightly elevated at 140/85. EKG normal. Recommended lifestyle changes and follow-up in 6 months.',
      documents: ['EKG Report', 'Blood Work Results'],
      prescriptions: ['Lisinopril 10mg'],
    },
    {
      id: 'v2',
      date: 'January 5, 2025',
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      location: 'Downtown Health Clinic',
      reason: 'Skin rash evaluation',
      notes:
        'Diagnosed with contact dermatitis. Prescribed topical cream for treatment.',
      documents: ['Skin Evaluation Report'],
      prescriptions: ['Hydrocortisone 1%'],
    },
    {
      id: 'v3',
      date: 'November 10, 2024',
      doctor: 'Dr. Emily Patterson',
      specialty: 'Primary Care',
      location: 'Family Health Center',
      reason: 'Flu symptoms',
      notes:
        'Diagnosed with seasonal influenza. Rest, fluids, and over-the-counter medication recommended.',
      documents: ['Flu Test Results'],
      prescriptions: ['Tamiflu 75mg'],
    },
  ],
  vaccinations: [
    {
      name: 'COVID-19 Booster',
      date: 'February 2, 2025',
      provider: 'Community Vaccination Center',
      manufacturer: 'Pfizer',
      lotNumber: 'PZ45678',
      nextDose: null,
    },
    {
      name: 'Influenza (Flu)',
      date: 'October 15, 2024',
      provider: 'Local Pharmacy',
      manufacturer: 'Sanofi',
      lotNumber: 'FL23456',
      nextDose: 'October 2025',
    },
    {
      name: 'Tetanus/Diphtheria (Td)',
      date: 'May 20, 2021',
      provider: 'Family Health Center',
      manufacturer: 'GlaxoSmithKline',
      lotNumber: 'TD12345',
      nextDose: 'May 2031',
    },
  ],
  labResults: [
    {
      id: 'lab1',
      name: 'Complete Blood Count (CBC)',
      date: 'March 15, 2025',
      orderedBy: 'Dr. Sarah Johnson',
      facility: 'New York Medical Center Lab',
      status: 'Completed',
      results: [
        {
          test: 'WBC',
          value: '7.5',
          unit: 'x10^9/L',
          range: '4.5-11.0',
          flag: 'Normal',
        },
        {
          test: 'RBC',
          value: '4.8',
          unit: 'x10^12/L',
          range: '4.5-5.5',
          flag: 'Normal',
        },
        {
          test: 'Hemoglobin',
          value: '14.2',
          unit: 'g/dL',
          range: '13.5-17.5',
          flag: 'Normal',
        },
        {
          test: 'Hematocrit',
          value: '42',
          unit: '%',
          range: '41-50',
          flag: 'Normal',
        },
        {
          test: 'Platelets',
          value: '290',
          unit: 'x10^9/L',
          range: '150-450',
          flag: 'Normal',
        },
      ],
    },
    {
      id: 'lab2',
      name: 'Lipid Panel',
      date: 'March 15, 2025',
      orderedBy: 'Dr. Sarah Johnson',
      facility: 'New York Medical Center Lab',
      status: 'Completed',
      results: [
        {
          test: 'Total Cholesterol',
          value: '205',
          unit: 'mg/dL',
          range: '<200',
          flag: 'High',
        },
        {
          test: 'LDL',
          value: '130',
          unit: 'mg/dL',
          range: '<100',
          flag: 'High',
        },
        {
          test: 'HDL',
          value: '45',
          unit: 'mg/dL',
          range: '>40',
          flag: 'Normal',
        },
        {
          test: 'Triglycerides',
          value: '150',
          unit: 'mg/dL',
          range: '<150',
          flag: 'Normal',
        },
      ],
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
      id={`medical-history-tabpanel-${index}`}
      aria-labelledby={`medical-history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function MedicalHistoryPage() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
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
          Medical History
        </Typography>
        <Box>
          <Button startIcon={<DownloadIcon />} sx={{ mr: 1 }}>
            Download
          </Button>
          <Button startIcon={<PrintIcon />}>Print</Button>
        </Box>
      </Box>

      <Paper elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="medical history tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<EventNoteIcon />}
              iconPosition="start"
              label="Visit History"
            />
            <Tab
              icon={<VaccinesIcon />}
              iconPosition="start"
              label="Vaccinations"
            />
            <Tab
              icon={<ScienceIcon />}
              iconPosition="start"
              label="Lab Results"
            />
          </Tabs>
        </Box>

        {/* Visit History Tab */}
        <TabPanel value={tabValue} index={0}>
          <Timeline position="alternate">
            {mockMedicalHistory.visits.map(visit => (
              <TimelineItem key={visit.id}>
                <TimelineOppositeContent color="text.secondary">
                  {visit.date}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <LocalHospitalIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {visit.reason}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        {visit.doctor} - {visit.specialty}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Location:</strong> {visit.location}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body1" paragraph>
                        {visit.notes}
                      </Typography>
                      {visit.prescriptions.length > 0 && (
                        <>
                          <Typography variant="subtitle2">
                            Prescriptions:
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            {visit.prescriptions.map((prescription, idx) => (
                              <Chip
                                key={idx}
                                icon={<MedicationIcon />}
                                label={prescription}
                                variant="outlined"
                                color="primary"
                                sx={{ mr: 1, mb: 1 }}
                              />
                            ))}
                          </Box>
                        </>
                      )}
                      {visit.documents.length > 0 && (
                        <>
                          <Typography variant="subtitle2">
                            Documents:
                          </Typography>
                          <Box>
                            {visit.documents.map((doc, idx) => (
                              <Chip
                                key={idx}
                                icon={<FileOpenIcon />}
                                label={doc}
                                variant="outlined"
                                sx={{ mr: 1, mb: 1 }}
                              />
                            ))}
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </TabPanel>

        {/* Vaccinations Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {mockMedicalHistory.vaccinations.map((vaccination, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <VaccinesIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" component="div">
                        {vaccination.name}
                      </Typography>
                    </Box>

                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <EventNoteIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Date Administered"
                          secondary={vaccination.date}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <LocalHospitalIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Provider"
                          secondary={vaccination.provider}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <MasksIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Manufacturer"
                          secondary={vaccination.manufacturer}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <MonitorHeartIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Lot Number"
                          secondary={vaccination.lotNumber}
                        />
                      </ListItem>
                    </List>

                    {vaccination.nextDose && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 1,
                          bgcolor: 'primary.light',
                          borderRadius: 1,
                          color: 'white',
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Next Dose:</strong> {vaccination.nextDose}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Lab Results Tab */}
        <TabPanel value={tabValue} index={2}>
          {mockMedicalHistory.labResults.map(lab => (
            <Card key={lab.id} sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography variant="h6" component="div">
                      {lab.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      gutterBottom
                    >
                      {lab.date} - {lab.facility}
                    </Typography>
                    <Typography variant="body2">
                      Ordered by: {lab.orderedBy}
                    </Typography>
                  </Box>
                  <Chip
                    label={lab.status}
                    color={lab.status === 'Completed' ? 'success' : 'warning'}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ overflowX: 'auto' }}>
                  <Box sx={{ minWidth: 600 }}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                        gridGap: '8px',
                        fontWeight: 'bold',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                        py: 1,
                      }}
                    >
                      <Typography variant="subtitle2">Test</Typography>
                      <Typography variant="subtitle2">Result</Typography>
                      <Typography variant="subtitle2">Units</Typography>
                      <Typography variant="subtitle2">
                        Reference Range
                      </Typography>
                      <Typography variant="subtitle2">Status</Typography>
                    </Box>

                    {lab.results.map((result, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                          gridGap: '8px',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                          py: 1.5,
                        }}
                      >
                        <Typography variant="body2">{result.test}</Typography>
                        <Typography variant="body2">{result.value}</Typography>
                        <Typography variant="body2">{result.unit}</Typography>
                        <Typography variant="body2">{result.range}</Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              result.flag === 'Normal' ? 'green' : 'error.main',
                            fontWeight:
                              result.flag !== 'Normal' ? 'bold' : 'normal',
                          }}
                        >
                          {result.flag}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}
                >
                  <Button startIcon={<ShareIcon />} sx={{ mr: 1 }}>
                    Share Results
                  </Button>
                  <Button startIcon={<DownloadIcon />}>Download PDF</Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </TabPanel>
      </Paper>
    </Container>
  )
}
