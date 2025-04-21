import { mockSpecialty } from './specialties'

export interface Doctor {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  insurances: string[]
  specialty: string
  qualifications: string[]
  yearsOfExperience: number
  availability: string
  availableSlots?: {
    day: string
    times: string[]
  }[]
  rating?: number
  reviewsCount?: number
  reviews?: {
    userId: string
    rating: number
    comment: string
    date: string
  }[]
  hospital?: string
  bio?: string
  phone?: string
  profileImage?: string
  languages?: string[]
  acceptingNewPatients: boolean
  distance?: string
  location?: string
}

export const mockDoctors: Doctor[] = [
  {
    id: 'doc_001',
    name: 'Dr. Elizabeth Carter',
    firstName: 'Elizabeth',
    lastName: 'Carter',
    email: 'elizabeth.carter@medhospital.org',
    specialty: mockSpecialty[0],
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
      {
        day: '2025-04-24',
        times: ['13:00', '14:00', '15:00', '16:00'],
      },
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
    bio: 'Dr. Elizabeth Carter is a board-certified cardiologist specializing in preventive cardiology and heart disease management. She completed her medical training at Harvard Medical School and has been practicing for over 15 years.',
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
    specialty: mockSpecialty[1],
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
      {
        day: '2025-04-26',
        times: ['09:00', '10:00', '11:00'],
      },
    ],
    rating: 4.9,
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
    bio: 'Dr. James Wilson is dedicated to providing comprehensive primary care for patients of all ages. He has a particular interest in preventive medicine and chronic disease management.',
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
    specialty: mockSpecialty[2],
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
    bio: 'Dr. Sophia Patel specializes in diagnosing and treating complex neurological disorders. Her research focuses on innovative treatments for neurodegenerative diseases.',
    phone: '555-345-6789',
    languages: ['English', 'Hindi', 'Gujarati'],
    profileImage: 'https://randomuser.me/api/portraits/women/45.jpg',
    insurances: ['Aetna', 'Humana', 'Medicare'],
    acceptingNewPatients: true,
    distance: '2.5 miles',
    location: 'Neurological Institute',
  },
  {
    id: 'doc_004',
    name: 'Dr. Marcus Johnson',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.johnson@medhospital.org',
    specialty: mockSpecialty[3],
    qualifications: ['MD', 'FAAOS', 'Board Certified in Orthopedic Surgery'],
    yearsOfExperience: 18,
    availability: 'Next available: Thursday',
    availableSlots: [
      {
        day: '2025-04-29',
        times: ['08:00', '09:00', '13:00', '14:00'],
      },
      {
        day: '2025-04-30',
        times: ['10:00', '11:00', '15:00', '16:00'],
      },
    ],
    rating: 4.6,
    reviews: [
      {
        userId: 'usr_003',
        rating: 5,
        comment:
          'Dr. Johnson successfully treated my shoulder injury. Very professional and skilled surgeon.',
        date: '2025-01-05',
      },
      {
        userId: 'usr_005',
        rating: 4.2,
        comment:
          'Good doctor but office staff could be more organized with scheduling.',
        date: '2025-02-20',
      },
    ],
    hospital: 'Advanced Surgical Center',
    bio: 'Dr. Marcus Johnson is a leading orthopedic surgeon specializing in sports medicine and joint replacement. He has treated professional athletes and weekend warriors alike.',
    phone: '555-456-7890',
    languages: ['English'],
    profileImage: 'https://randomuser.me/api/portraits/men/54.jpg',
    insurances: ['Blue Cross', 'Medicare', 'United Healthcare'],
    acceptingNewPatients: false,
    distance: '3.1 miles',
    location: 'Advanced Surgical Center',
  },
  {
    id: 'doc_005',
    name: 'Dr. Lina Zhang',
    firstName: 'Lina',
    lastName: 'Zhang',
    email: 'lina.zhang@medhospital.org',
    specialty: mockSpecialty[4],
    qualifications: ['MD', 'FAAP', 'Board Certified in Pediatrics'],
    yearsOfExperience: 8,
    availability: 'Next available: Friday',
    availableSlots: [
      {
        day: '2025-04-22',
        times: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      },
      {
        day: '2025-04-23',
        times: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      },
      {
        day: '2025-04-25',
        times: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
      },
    ],
    rating: 5.0,
    reviews: [
      {
        userId: 'usr_001',
        rating: 5,
        comment:
          'Dr. Zhang is amazing with children. My son usually hates doctor visits but loves seeing Dr. Zhang.',
        date: '2025-03-15',
      },
      {
        userId: 'usr_002',
        rating: 5,
        comment:
          "Patient, kind, and thorough. Best pediatrician we've ever had.",
        date: '2025-04-01',
      },
    ],
    hospital: "Children's Medical Center",
    bio: 'Dr. Lina Zhang specializes in pediatric care with a focus on early childhood development and preventive health. She is known for her gentle approach with young patients.',
    phone: '555-567-8901',
    languages: ['English', 'Mandarin', 'Cantonese'],
    profileImage: 'https://randomuser.me/api/portraits/women/54.jpg',
    insurances: ['Aetna', 'Cigna', 'Medicaid'],
    acceptingNewPatients: true,
    distance: '2.0 miles',
    location: "Children's Medical Center",
  },
]

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  return await Promise.resolve(
    mockDoctors.find(doctor => doctor.id === id) || null
  )
}

export const getDoctorsBySpecialty = async (
  specialty: string
): Promise<Doctor[]> => {
  return await Promise.resolve(
    mockDoctors.filter(
      doctor => doctor.specialty.toLowerCase() === specialty.toLowerCase()
    )
  )
}

export const getAvailableDoctors = async (): Promise<Doctor[]> => {
  return await Promise.resolve(
    mockDoctors.filter(doctor => doctor.acceptingNewPatients)
  )
}

export const getDoctors = async (): Promise<Doctor[]> => {
  return await Promise.resolve(mockDoctors)
}
