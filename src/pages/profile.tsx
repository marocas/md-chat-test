import { useSession } from '@/context/SessionContext'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MedicationIcon from '@mui/icons-material/Medication'
import SaveIcon from '@mui/icons-material/Save'
import WarningIcon from '@mui/icons-material/Warning'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

// Mock user data
const mockUser = {
  id: 'u1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  dob: '1985-06-15',
  gender: 'Male',
  address: '123 Medical Ave, Healthcare City, HC 12345',
  emergencyContact: 'Jane Doe (555) 987-6543',
  profileImage: '/user-avatar.jpg',
  primaryCare: 'Dr. Sarah Johnson',
  allergies: [
    { name: 'Penicillin', severity: 'high' },
    { name: 'Peanuts', severity: 'medium' },
    { name: 'Latex', severity: 'low' },
  ],
  currentMedications: [
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
  ],
}

export default function ProfilePage() {
  const { user } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(user)
  const [tempUserData, setTempUserData] = useState<any>(user)

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - revert to original data
      setTempUserData(userData)
    } else {
      // Start editing - copy current data to temp
      setTempUserData({ ...userData })
    }
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    // In a real app, this would call an API to update the user profile
    setUserData(tempUserData)
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTempUserData({
      ...tempUserData,
      [name]: value,
    })
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Left side - Personal Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Typography variant="h5">Personal Information</Typography>
              <Button
                variant={isEditing ? 'outlined' : 'contained'}
                color={isEditing ? 'error' : 'primary'}
                startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                onClick={handleEditToggle}
                sx={{ ml: 1 }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              {isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  Save
                </Button>
              )}
            </Box>

            {isEditing ? (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={tempUserData?.name}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={tempUserData?.email}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={tempUserData?.phone}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={tempUserData?.dob}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={tempUserData?.gender}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={tempUserData?.address}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    name="emergencyContact"
                    value={tempUserData?.emergencyContact}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Primary Care Physician"
                    name="primaryCare"
                    value={tempUserData?.primaryCare}
                    onChange={handleInputChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            ) : (
              <Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {userData?.firstName} {userData?.lastName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {userData?.email}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {userData?.phone}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {userData?.dob}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {userData?.gender}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1" paragraph>
                  {userData?.address}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Emergency Contact
                </Typography>
                <Typography variant="body1" paragraph>
                  {userData?.emergencyContact}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Primary Care Physician
                </Typography>
                <Typography variant="body1">{userData?.primaryCare}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right side - Profile Summary & Medical Information */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={2} direction="column">
            <Grid>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Avatar
                  src={userData?.profileImage}
                  alt={userData?.name}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                >
                  {userData?.name
                    ?.split(' ')
                    .map(name => name.charAt(0))
                    .join('')}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {userData?.name}
                </Typography>
                <Button variant="outlined" size="small">
                  Change Photo
                </Button>
              </Paper>
            </Grid>

            <Grid>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <WarningIcon color="error" sx={{ mr: 1 }} />
                    Allergies
                  </Typography>
                  {userData?.allergies?.length === 0 ? (
                    <Typography variant="body1">No known allergies</Typography>
                  ) : (
                    <List dense>
                      {userData?.allergies?.map((allergy, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <WarningIcon
                              color={
                                allergy.severity === 'high'
                                  ? 'error'
                                  : allergy.severity === 'medium'
                                    ? 'warning'
                                    : 'action'
                              }
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={allergy.name}
                            secondary={`Severity: ${allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <MedicationIcon color="primary" sx={{ mr: 1 }} />
                    Current Medications
                  </Typography>
                  {userData?.currentMedications?.length === 0 ? (
                    <Typography variant="body1">
                      No current medications
                    </Typography>
                  ) : (
                    <List dense>
                      {userData?.currentMedications?.map((med, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <MedicationIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={med.name}
                            secondary={`${med.dosage}, ${med.frequency}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                href="/medical-history"
                startIcon={<LocalHospitalIcon />}
              >
                View Complete Medical History
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}
