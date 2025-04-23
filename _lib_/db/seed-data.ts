import { Doctor } from '@/types/doctor'
import { Specialty } from '@/types/specialty'

// Sample doctor data
export const sampleDoctors: Doctor[] = [
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
]

// Sample specialty data
export const sampleSpecialties: Specialty[] = [
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
