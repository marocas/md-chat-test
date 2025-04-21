export interface User {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  profileImage?: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  phone?: string
  age?: number
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  medicalInfo?: {
    bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
    allergies?: string[]
    chronicConditions?: string[]
    medications?: {
      name: string
      dosage: string
      frequency: string
      startDate: string
    }[]
    height?: number // in cm
    weight?: number // in kg
  }
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  insuranceInfo?: {
    provider: string
    policyNumber: string
    groupNumber?: string
    expirationDate?: string
  }
  registrationDate: string
  lastLogin?: string
}

export const mockUsers: User[] = [
  {
    id: 'usr_001',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    phone: '555-123-4567',
    age: 38,
    address: {
      street: '123 Main St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      country: 'USA',
    },
    medicalInfo: {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          startDate: '2020-03-15',
        },
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          startDate: '2019-11-20',
        },
      ],
      height: 180,
      weight: 85,
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '555-987-6543',
    },
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS12345678',
      groupNumber: 'GRP987654',
      expirationDate: '2025-12-31',
    },
    registrationDate: '2023-01-15',
    lastLogin: '2025-04-18T08:30:00',
  },
  {
    id: 'usr_002',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    dateOfBirth: '1992-08-21',
    gender: 'female',
    phone: '555-234-5678',
    age: 31,
    address: {
      street: '456 Elm St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'USA',
    },
    medicalInfo: {
      bloodType: 'A-',
      allergies: ['Sulfa drugs', 'Shellfish'],
      chronicConditions: ['Asthma'],
      medications: [
        {
          name: 'Albuterol',
          dosage: '90mcg',
          frequency: 'As needed',
          startDate: '2018-05-10',
        },
      ],
      height: 165,
      weight: 62,
    },
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Brother',
      phone: '555-876-5432',
    },
    insuranceInfo: {
      provider: 'Aetna',
      policyNumber: 'AET98765432',
      expirationDate: '2026-06-30',
    },
    registrationDate: '2023-03-22',
    lastLogin: '2025-04-17T14:45:00',
  },
  {
    id: 'usr_003',
    name: 'Miguel Gonzalez',
    firstName: 'Miguel',
    lastName: 'Gonzalez',
    email: 'miguel.g@example.com',
    dateOfBirth: '1978-11-03',
    gender: 'male',
    phone: '555-345-6789',
    age: 45,
    address: {
      street: '789 Oak Dr',
      city: 'Miami',
      state: 'FL',
      zipCode: '33130',
      country: 'USA',
    },
    medicalInfo: {
      bloodType: 'B+',
      allergies: [],
      chronicConditions: ['Arthritis'],
      medications: [
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'Twice daily as needed',
          startDate: '2022-01-05',
        },
      ],
      height: 175,
      weight: 78,
    },
    insuranceInfo: {
      provider: 'UnitedHealthcare',
      policyNumber: 'UHC45678901',
      groupNumber: 'GRPUHC123',
      expirationDate: '2025-09-30',
    },
    registrationDate: '2023-05-11',
    lastLogin: '2025-04-15T10:20:00',
  },
  {
    id: 'usr_004',
    name: 'Emily Chen',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@example.com',
    dateOfBirth: '1990-02-14',
    gender: 'female',
    phone: '555-456-7890',
    age: 31,
    address: {
      street: '101 Pine St',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
    },
    medicalInfo: {
      bloodType: 'AB+',
      allergies: ['Latex'],
      chronicConditions: [],
      height: 160,
      weight: 55,
    },
    emergencyContact: {
      name: 'David Chen',
      relationship: 'Father',
      phone: '555-765-4321',
    },
    insuranceInfo: {
      provider: 'Cigna',
      policyNumber: 'CIG34567890',
      expirationDate: '2025-08-31',
    },
    registrationDate: '2023-06-18',
    lastLogin: '2025-04-18T19:10:00',
  },
  {
    id: 'usr_005',
    name: 'Robert Williams',
    firstName: 'Robert',
    lastName: 'Williams',
    email: 'robert.w@example.com',
    dateOfBirth: '1965-07-22',
    gender: 'male',
    phone: '555-567-8901',
    age: 58,
    address: {
      street: '222 Maple Ave',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    medicalInfo: {
      bloodType: 'O-',
      allergies: ['Aspirin'],
      chronicConditions: ['Coronary Artery Disease', 'High Cholesterol'],
      medications: [
        {
          name: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily at bedtime',
          startDate: '2018-09-12',
        },
        {
          name: 'Aspirin',
          dosage: '81mg',
          frequency: 'Once daily',
          startDate: '2018-09-12',
        },
      ],
      height: 178,
      weight: 82,
    },
    emergencyContact: {
      name: 'Patricia Williams',
      relationship: 'Spouse',
      phone: '555-654-3210',
    },
    insuranceInfo: {
      provider: 'Medicare',
      policyNumber: 'MED12345678',
      expirationDate: '2025-12-31',
    },
    registrationDate: '2023-04-05',
    lastLogin: '2025-04-16T11:05:00',
  },
]

export const getUserById = async (userId: string): Promise<User | null> => {
  const user = mockUsers.find(user => user.id === userId)
  return await Promise.resolve(user || null)
}
export const getCurrentUser = async (): Promise<User> => {
  return await Promise.resolve(mockUsers[0])
}

export const getAllUsers = async (): Promise<User[]> => {
  return await Promise.resolve(mockUsers) // Return all users
}
