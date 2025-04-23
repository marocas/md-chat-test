// A simplified JavaScript seed script for MongoDB
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })

const mongoose = require('mongoose')

// Define the schemas directly in this script for simplicity
const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, required: true },
})

const SlotSchema = new mongoose.Schema({
  day: { type: String, required: true },
  times: [{ type: String, required: true }],
})

const DoctorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    insurances: [{ type: String }],
    specialty: { type: String, required: true },
    qualifications: [{ type: String }],
    yearsOfExperience: { type: Number, required: true },
    availability: { type: String },
    availableSlots: [SlotSchema],
    rating: { type: Number, min: 0, max: 5 },
    reviewsCount: { type: Number },
    reviews: [ReviewSchema],
    hospital: { type: String },
    bio: { type: String },
    phone: { type: String },
    profileImage: { type: String },
    languages: [{ type: String }],
    acceptingNewPatients: { type: Boolean, default: true },
    distance: { type: String },
    location: { type: String },
  },
  {
    timestamps: true,
  }
)

const SpecialtySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
)

const MedicalInfoSchema = new mongoose.Schema({
  bloodType: String,
  allergies: [String],
  chronicConditions: [String],
  medications: [String],
  vaccinations: [
    {
      name: String,
      date: String,
    },
  ],
  surgeries: [
    {
      procedure: String,
      date: String,
      notes: String,
    },
  ],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
  },
})

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: String,
    address: String,
    profileImage: String,
    insurance: String,
    medicalInfo: MedicalInfoSchema,
    preferredDoctor: String,
  },
  {
    timestamps: true,
  }
)

// Sample data
const sampleDoctors = [
  {
    id: 'doc_001',
    name: 'Dr. Elizabeth Carter',
    firstName: 'Elizabeth',
    lastName: 'Carter',
    email: 'elizabeth.carter@medhospital.org',
    specialty: 'Cardiology',
    qualifications: ['MD', 'FACC', 'Board Certified in Cardiovascular Disease'],
    yearsOfExperience: 15,
    availability: 'Next available: Tuesday',
    availableSlots: [
      {
        day: '2025-04-22',
        times: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      },
      {
        day: '2025-04-23',
        times: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      },
      { day: '2025-04-24', times: ['13:00', '14:00', '15:00', '16:00'] },
    ],
    rating: 4.8,
    reviewsCount: 2,
    reviews: [
      {
        userId: 'usr_002',
        rating: 5,
        comment:
          'Dr. Carter took the time to thoroughly explain my condition and treatment options. Very knowledgeable and caring.',
        date: '2025-02-15',
      },
      {
        userId: 'usr_005',
        rating: 4.5,
        comment:
          'Excellent doctor who really listens to patient concerns. Wait times can be a bit long.',
        date: '2025-03-22',
      },
    ],
    hospital: 'Boston Medical Center',
    bio: 'Dr. Elizabeth Carter is a board-certified cardiologist specializing in preventive cardiology and heart disease management.',
    phone: '555-789-0123',
    languages: ['English', 'Spanish'],
    profileImage: 'https://randomuser.me/api/portraits/women/76.jpg',
    insurances: ['Blue Cross', 'Aetna', 'Medicare'],
    acceptingNewPatients: true,
    distance: '0.8 miles',
    location: 'Boston Medical Center',
  },
  {
    id: 'doc_002',
    name: 'Dr. James Wilson',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@medhospital.org',
    specialty: 'Family Medicine',
    qualifications: ['MD', 'FAAFP', 'Board Certified in Family Medicine'],
    yearsOfExperience: 12,
    availability: 'Next available: Monday',
    availableSlots: [
      {
        day: '2025-04-22',
        times: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00'],
      },
      {
        day: '2025-04-24',
        times: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00'],
      },
      { day: '2025-04-26', times: ['09:00', '10:00', '11:00'] },
    ],
    rating: 4.9,
    reviewsCount: 2,
    reviews: [
      {
        userId: 'usr_001',
        rating: 5,
        comment:
          'Dr. Wilson is fantastic with my whole family. Great bedside manner and very thorough.',
        date: '2025-01-30',
      },
      {
        userId: 'usr_003',
        rating: 4.8,
        comment:
          'Always takes the time to answer all my questions. Highly recommend.',
        date: '2025-02-18',
      },
    ],
    hospital: 'Community Health Partners',
    bio: 'Dr. James Wilson is dedicated to providing comprehensive primary care for patients of all ages.',
    phone: '555-234-5678',
    languages: ['English'],
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    insurances: ['Cigna', 'United Healthcare', 'Kaiser'],
    acceptingNewPatients: true,
    distance: '1.2 miles',
    location: 'Community Health Partners',
  },
  {
    id: 'doc_003',
    name: 'Dr. Sophia Patel',
    firstName: 'Sophia',
    lastName: 'Patel',
    email: 'sophia.patel@medhospital.org',
    specialty: 'Neurology',
    qualifications: ['MD', 'PhD', 'Board Certified in Neurology'],
    yearsOfExperience: 10,
    availability: 'Next available: Wednesday',
    availableSlots: [
      {
        day: '2025-04-23',
        times: ['10:00', '11:00', '13:00', '14:00', '15:00'],
      },
      {
        day: '2025-04-25',
        times: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      },
    ],
    rating: 4.7,
    reviewsCount: 1,
    reviews: [
      {
        userId: 'usr_004',
        rating: 5,
        comment:
          'Dr. Patel is incredibly knowledgeable and explained my condition in terms I could understand.',
        date: '2025-03-10',
      },
    ],
    hospital: 'Neurological Institute',
    bio: 'Dr. Sophia Patel specializes in diagnosing and treating complex neurological disorders.',
    phone: '555-345-6789',
    languages: ['English', 'Hindi', 'Gujarati'],
    profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    insurances: ['Aetna', 'Humana', 'Medicare'],
    acceptingNewPatients: true,
    distance: '2.5 miles',
    location: 'Neurological Institute',
  },
]

const sampleSpecialties = [
  { name: 'Cardiology' },
  { name: 'Family Medicine' },
  { name: 'Neurology' },
  { name: 'Orthopedic Surgery' },
  { name: 'Pediatrics' },
  { name: 'Dermatology' },
  { name: 'Psychiatry' },
  { name: 'Endocrinology' },
  { name: 'Gastroenterology' },
  { name: 'Oncology' },
  { name: 'Pulmonology' },
  { name: 'Rheumatology' },
  { name: 'Urology' },
  { name: 'Ophthalmology' },
  { name: 'Anesthesiology' },
  { name: 'Emergency Medicine' },
  { name: 'Internal Medicine' },
]

const sampleUsers = [
  {
    id: 'usr_001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    password: 'Password123', // In a real app, this should be hashed
    age: 35,
    gender: 'Male',
    phone: '555-123-4567',
    address: '123 Main St, Boston, MA',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    insurance: 'Blue Cross',
    medicalInfo: {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Hypertension'],
      medications: ['Lisinopril 10mg daily'],
    },
  },
  {
    id: 'usr_002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith@example.com',
    password: 'Password123', // In a real app, this should be hashed
    age: 28,
    gender: 'Female',
    phone: '555-987-6543',
    address: '456 Oak St, Boston, MA',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    insurance: 'Aetna',
    medicalInfo: {
      bloodType: 'A-',
      allergies: ['Sulfa drugs', 'Shellfish'],
      chronicConditions: ['Asthma'],
      medications: ['Albuterol inhaler as needed'],
    },
  },
]

// Main function to seed the database
async function seedDatabase() {
  console.log('Starting database seed process...')

  // Verify MongoDB URI
  console.log('Checking MongoDB URI...')
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI environment variable is not defined!')
    console.error(
      'Please ensure your .env.local or .env file contains a valid MongoDB URI.'
    )
    process.exit(1)
  } else {
    // Print MongoDB URI but mask the password for security
    const displayUri = MONGODB_URI.replace(
      /(mongodb\+srv:\/\/)([^:]+):([^@]+)@(.*)/,
      '$1$2:****@$4'
    )
    console.log(`Found MongoDB URI: ${displayUri}`)
  }

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB successfully!')

    // Create models
    const Doctor = mongoose.model('Doctor', DoctorSchema)
    const Specialty = mongoose.model('Specialty', SpecialtySchema)
    const User = mongoose.model('User', UserSchema)

    // Clear existing data
    console.log('Clearing existing data...')
    await Doctor.deleteMany({})
    await Specialty.deleteMany({})
    await User.deleteMany({})
    console.log('✅ Cleared existing data successfully!')

    // Seed specialties
    console.log('Seeding specialties...')
    const specialtyDocs = await Specialty.insertMany(sampleSpecialties)
    console.log(`✅ Seeded ${specialtyDocs.length} specialties successfully!`)

    // Seed doctors
    console.log('Seeding doctors...')
    const doctorDocs = await Doctor.insertMany(sampleDoctors)
    console.log(`✅ Seeded ${doctorDocs.length} doctors successfully!`)

    // Seed users
    console.log('Seeding users...')
    const userDocs = await User.insertMany(sampleUsers)
    console.log(`✅ Seeded ${userDocs.length} users successfully!`)

    console.log('✅ Database seeded successfully!')

    // Close the connection
    console.log('Closing MongoDB connection...')
    await mongoose.disconnect()
    console.log('MongoDB connection closed')

    console.log('Seed process complete')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:')
    console.error(error)

    // Try to disconnect MongoDB before exiting
    try {
      console.log('Attempting to close MongoDB connection after error...')
      await mongoose.disconnect()
      console.log('MongoDB connection closed after error')
    } catch (closeError) {
      console.error('Failed to close MongoDB connection:', closeError)
    }

    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
