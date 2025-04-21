import { Doctor, getDoctors, getSpecialties } from '@/data/mock/doctors'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [distance, setDistance] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [specialties, setSpecialties] = useState<string[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])

  useEffect(() => {
    // Fetch doctors and specialties
    const fetchData = async () => {
      const doctorsData = await getDoctors()
      const specialtiesData = await getSpecialties()
      setDoctors(doctorsData)
      setSpecialties(specialtiesData)
      setFilteredDoctors(doctorsData)
    }

    fetchData()
  }, [])

  const handleSpecialtyChange = (event: SelectChangeEvent) => {
    setSpecialty(event.target.value)
  }

  const handleDistanceChange = (event: SelectChangeEvent) => {
    setDistance(event.target.value)
  }

  // Filter doctors based on search term and filters
  useEffect(() => {
    const filtered = doctors.filter(doctor => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty = specialty ? doctor.specialty === specialty : true

      // Simple distance filtering
      let matchesDistance = true
      if (distance === '1') {
        matchesDistance = parseFloat(doctor.distance || '0') <= 1
      } else if (distance === '5') {
        matchesDistance = parseFloat(doctor.distance || '0') <= 5
      } else if (distance === '10') {
        matchesDistance = parseFloat(doctor.distance || '0') <= 10
      }

      return matchesSearch && matchesSpecialty && matchesDistance
    })

    setFilteredDoctors(filtered)
  }, [searchTerm, specialty, distance, doctors])

  return (
    <>
      <Head>
        <title>Find Doctors - MediChat</title>
        <meta
          name="description"
          content="Search for healthcare providers by specialty, location, and availability"
        />
      </Head>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Doctors
        </Typography>

        {/* Search Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Search by name, specialty, or condition"
                variant="outlined"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="specialty-select-label">Specialty</InputLabel>
                <Select
                  labelId="specialty-select-label"
                  value={specialty}
                  label="Specialty"
                  onChange={handleSpecialtyChange}
                >
                  <MenuItem value="">Any</MenuItem>

                  {specialties.map(s => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="distance-select-label">Distance</InputLabel>
                <Select
                  labelId="distance-select-label"
                  value={distance}
                  label="Distance"
                  onChange={handleDistanceChange}
                >
                  <MenuItem value="">Any</MenuItem>
                  <MenuItem value="1">Within 1 mile</MenuItem>
                  <MenuItem value="5">Within 5 miles</MenuItem>
                  <MenuItem value="10">Within 10 miles</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results */}
        <Typography variant="h6" gutterBottom>
          {filteredDoctors.length} doctors found
        </Typography>

        <Grid container spacing={3}>
          {filteredDoctors.map(doctor => (
            <Grid key={doctor.id} size={12}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: { xs: '100%', sm: 150 },
                    height: { xs: 200, sm: 150 },
                    objectFit: 'cover',
                  }}
                  image={doctor.profileImage}
                  alt={doctor.name}
                />
                <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                  <Typography variant="h5" component="div">
                    {doctor.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                    {doctor.specialty}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}
                  >
                    <Rating
                      value={doctor.rating}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {doctor.rating} ({doctor?.reviewsCount || 0} reviews)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon
                      color="action"
                      sx={{ mr: 1, fontSize: 18 }}
                    />
                    <Typography variant="body2">
                      {doctor.location} ({doctor.distance})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventAvailableIcon
                      color="primary"
                      sx={{ mr: 1, fontSize: 18 }}
                    />
                    <Typography variant="body2" color="primary">
                      {doctor.availability}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    {doctor.insurances.map(insurance => (
                      <Chip
                        key={insurance}
                        label={insurance}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  <Button variant="contained" sx={{ minWidth: 150, mb: 1 }}>
                    Book Appointment
                  </Button>
                  <Button variant="outlined" sx={{ minWidth: 150 }}>
                    View Profile
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}
