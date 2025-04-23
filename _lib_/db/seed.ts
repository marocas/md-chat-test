import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Doctor from '../../src/lib/db/models/doctor'
import Specialty from '../../src/lib/db/models/specialty'
import User from '../../src/lib/db/models/user'
import { sampleDoctors, sampleSpecialties } from './seed-data'

// Force logging to the console, important for debugging
console.log('Starting database seed process...')

// Load environment variables from .env.local and .env
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

// Sample user data for seeding
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

// Verify MongoDB URI first
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

async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI!)
    console.log('Connected to MongoDB successfully!')

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

    // Exit with success code
    console.log('Seed process complete')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:')

    if (error instanceof Error) {
      console.error(`Error name: ${error.name}`)
      console.error(`Error message: ${error.message}`)
      console.error(`Error stack: ${error.stack}`)
    } else {
      console.error('Unknown error:', error)
    }

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
console.log('Starting database seed process...')
seedDatabase().catch(error => {
  console.error('Unhandled error in seed process:', error)
  process.exit(1)
})
