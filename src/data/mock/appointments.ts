import { mockDoctors } from './doctors'

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_SHOW = 'NO_SHOW',
}

export enum AppointmentType {
  IN_PERSON = 'IN_PERSON',
  VIDEO = 'VIDEO',
  PHONE = 'PHONE',
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  doctorName?: string
  doctorSpecialty?: string
  doctorImage?: string
  dateTime: string
  endDateTime: string
  status: AppointmentStatus
  type: AppointmentType
  reason: string
  notes?: string
  location?: string
  followUp?: boolean
  insuranceCopay?: number
}

// Function to create appointment data with doctor references
const createAppointmentsWithDoctorInfo = (): Appointment[] => {
  return [
    {
      id: 'apt-001',
      patientId: 'usr_001',
      doctorId: 'doc_001',
      doctorName: mockDoctors[0].name,
      doctorSpecialty: mockDoctors[0].specialty,
      doctorImage: mockDoctors[0].profileImage,
      dateTime: '2025-04-25T09:30:00',
      endDateTime: '2025-04-25T10:00:00',
      status: AppointmentStatus.SCHEDULED,
      type: AppointmentType.IN_PERSON,
      reason: 'Annual physical exam',
      notes:
        'Please bring your insurance card and list of current medications.',
      location: 'New York Medical Center, Room 302',
      followUp: false,
      insuranceCopay: 25,
    },
    {
      id: 'apt-002',
      patientId: 'usr_003',
      doctorId: 'doc_003',
      doctorName: mockDoctors[2].name,
      doctorSpecialty: mockDoctors[2].specialty,
      doctorImage: mockDoctors[2].profileImage,
      dateTime: '2025-04-30T14:15:00',
      endDateTime: '2025-04-30T14:45:00',
      status: AppointmentStatus.SCHEDULED,
      type: AppointmentType.VIDEO,
      reason: "Follow-up consultation for child's vaccination schedule",
      notes: 'Video link will be sent 15 minutes before appointment.',
      followUp: true,
      insuranceCopay: 15,
    },
    {
      id: 'apt-003',
      patientId: 'usr_003',
      doctorId: 'doc_002',
      doctorName: mockDoctors[1].name,
      doctorSpecialty: mockDoctors[1].specialty,
      doctorImage: mockDoctors[1].profileImage,
      dateTime: '2025-04-05T11:00:00',
      endDateTime: '2025-04-05T11:30:00',
      status: AppointmentStatus.COMPLETED,
      type: AppointmentType.IN_PERSON,
      reason: 'Skin rash examination',
      notes:
        'Prescribed topical corticosteroid cream. Follow up in two weeks if rash persists.',
      location: 'Downtown Health Clinic, Room 105',
      followUp: true,
      insuranceCopay: 30,
    },
    {
      id: 'apt-004',
      patientId: 'usr_004',
      doctorId: 'doc_004',
      doctorName: mockDoctors[3].name,
      doctorSpecialty: mockDoctors[3].specialty,
      doctorImage: mockDoctors[3].profileImage,
      dateTime: '2025-03-18T15:30:00',
      endDateTime: '2025-03-18T16:00:00',
      status: AppointmentStatus.COMPLETED,
      type: AppointmentType.IN_PERSON,
      reason: 'Knee pain evaluation',
      notes:
        'MRI ordered. Rest and ice recommended. Avoid high-impact activities.',
      location: 'Sports Medicine Center, Suite 210',
      followUp: true,
      insuranceCopay: 35,
    },
    {
      id: 'apt-005',
      patientId: 'usr_001',
      doctorId: 'doc_001',
      doctorName: mockDoctors[0].name,
      doctorSpecialty: mockDoctors[0].specialty,
      doctorImage: mockDoctors[0].profileImage,
      dateTime: '2025-03-10T10:00:00',
      endDateTime: '2025-03-10T10:30:00',
      status: AppointmentStatus.CANCELED,
      type: AppointmentType.PHONE,
      reason: 'Blood pressure medication review',
      notes: 'Canceled due to doctor illness. Need to reschedule.',
      followUp: false,
      insuranceCopay: 15,
    },
  ]
}

export const mockAppointments: Appointment[] =
  createAppointmentsWithDoctorInfo()
