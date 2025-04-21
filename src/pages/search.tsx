import ArticleIcon from '@mui/icons-material/Article'
import HealingIcon from '@mui/icons-material/Healing'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MedicationIcon from '@mui/icons-material/Medication'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

// Mock search results
const mockResults = {
  conditions: [
    {
      id: 'c1',
      title: 'Hypertension (High Blood Pressure)',
      description:
        'A common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems.',
      symptoms: ['Headaches', 'Shortness of breath', 'Nosebleeds'],
      treatments: ['Lifestyle changes', 'Medications', 'Regular monitoring'],
    },
    {
      id: 'c2',
      title: 'Type 2 Diabetes',
      description:
        'A chronic condition that affects the way your body metabolizes sugar (glucose).',
      symptoms: [
        'Increased thirst',
        'Frequent urination',
        'Increased hunger',
        'Weight loss',
      ],
      treatments: [
        'Diet management',
        'Regular exercise',
        'Medication',
        'Blood sugar monitoring',
      ],
    },
  ],
  medications: [
    {
      id: 'm1',
      name: 'Lisinopril',
      description: 'Used to treat high blood pressure and heart failure.',
      usedFor: ['Hypertension', 'Heart failure', 'Post-heart attack recovery'],
      sideEffects: ['Dizziness', 'Headache', 'Dry cough'],
    },
    {
      id: 'm2',
      name: 'Metformin',
      description:
        'First-line medication for the treatment of type 2 diabetes.',
      usedFor: ['Type 2 diabetes', 'Insulin resistance', 'Prediabetes'],
      sideEffects: ['Nausea', 'Diarrhea', 'Vitamin B12 deficiency'],
    },
  ],
  articles: [
    {
      id: 'a1',
      title: 'Understanding Blood Pressure Readings',
      summary:
        'Learn how to interpret blood pressure numbers and what they mean for your health.',
      source: 'American Heart Association',
      date: '2025-01-15',
    },
    {
      id: 'a2',
      title: 'Diet and Exercise Tips for Managing Diabetes',
      summary:
        'Practical advice on lifestyle changes to help control blood sugar levels.',
      source: 'National Diabetes Association',
      date: '2025-02-10',
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
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSearch = () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)

    // Simulate API call delay
    setTimeout(() => {
      setIsSearching(false)
      setHasSearched(true)
    }, 1500)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Medical Information Search
      </Typography>

      {/* Search Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, md: 10 }}>
            <TextField
              fullWidth
              label="Search for conditions, symptoms, medications, or treatments"
              variant="outlined"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch()
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSearching || !searchTerm.trim()}
              onClick={handleSearch}
              startIcon={
                isSearching ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SearchIcon />
                )
              }
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Search Results */}
      {hasSearched && (
        <Paper elevation={2}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="search results tabs"
            >
              <Tab
                icon={<HealingIcon />}
                iconPosition="start"
                label="Conditions"
              />
              <Tab
                icon={<MedicationIcon />}
                iconPosition="start"
                label="Medications"
              />
              <Tab
                icon={<ArticleIcon />}
                iconPosition="start"
                label="Articles"
              />
            </Tabs>
          </Box>

          {/* Conditions Tab */}
          <TabPanel value={tabValue} index={0}>
            {mockResults.conditions.map(condition => (
              <Card key={condition.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {condition.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {condition.description}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Common Symptoms:
                  </Typography>
                  <List dense>
                    {condition.symptoms.map((symptom, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                          <LocalHospitalIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary={symptom} />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Treatments:
                  </Typography>
                  <List dense>
                    {condition.treatments.map((treatment, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                          <HealingIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={treatment} />
                      </ListItem>
                    ))}
                  </List>

                  <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabPanel>

          {/* Medications Tab */}
          <TabPanel value={tabValue} index={1}>
            {mockResults.medications.map(medication => (
              <Card key={medication.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {medication.name}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {medication.description}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Used For:
                  </Typography>
                  <List dense>
                    {medication.usedFor.map((use, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                          <MedicationIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={use} />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="subtitle2" sx={{ mt: 2 }}>
                    Common Side Effects:
                  </Typography>
                  <List dense>
                    {medication.sideEffects.map((effect, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                          <LocalHospitalIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary={effect} />
                      </ListItem>
                    ))}
                  </List>

                  <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                    Full Information
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabPanel>

          {/* Articles Tab */}
          <TabPanel value={tabValue} index={2}>
            {mockResults.articles.map(article => (
              <Card key={article.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {article.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {article.source} - {article.date}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {article.summary}
                  </Typography>

                  <Button variant="outlined" color="primary">
                    Read Article
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabPanel>
        </Paper>
      )}

      {/* Initial State - No Search */}
      {!hasSearched && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h5" color="text.secondary" paragraph>
            Search for medical information above
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find details on conditions, symptoms, medications, and treatments
            from trusted sources.
          </Typography>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setSearchTerm('diabetes')}
            >
              Diabetes
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSearchTerm('hypertension')}
            >
              Hypertension
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSearchTerm('headache')}
            >
              Headache
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSearchTerm('common cold')}
            >
              Common Cold
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  )
}
