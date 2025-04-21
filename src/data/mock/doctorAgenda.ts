import {
  AppointmentStatus,
  AppointmentType,
  mockAppointments,
} from './appointments'
import { mockDoctors } from './doctors'

// Define interfaces for doctor agenda
export interface TimeSlot {
  startTime: string // Format: HH:MM (24-hour)
  endTime: string // Format: HH:MM (24-hour)
  isAvailable: boolean
  appointmentId?: string // Reference to an appointment if slot is booked
}

export interface DailyAgenda {
  date: string // Format: YYYY-MM-DD
  slots: TimeSlot[]
}

export interface DoctorAgenda {
  doctorId: string
  doctorName: string
  agenda: DailyAgenda[]
}

// Generate time slots for a given day
const generateTimeSlots = (
  availableSlotTimes: string[] = [],
  bookedAppointments: any[] = []
): TimeSlot[] => {
  // Standard office hours (8am to 5pm with 30 min slots)
  const standardSlots: TimeSlot[] = []
  const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16']
  const minutes = ['00', '30']

  hours.forEach(hour => {
    minutes.forEach(min => {
      const startTime = `${hour}:${min}`

      // Calculate end time (30 min later)
      let endHour = parseInt(hour)
      let endMin = parseInt(min) + 30
      if (endMin >= 60) {
        endHour += 1
        endMin -= 60
      }
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`

      // Check if this slot is in the available slots list
      const isAvailable = availableSlotTimes.includes(startTime)

      // Check if this slot is booked
      const appointment = bookedAppointments.find(apt => {
        const aptStartTime = new Date(apt.dateTime).toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }
        )
        return aptStartTime === startTime
      })

      standardSlots.push({
        startTime,
        endTime,
        isAvailable: isAvailable && !appointment,
        appointmentId: appointment?.id,
      })
    })
  })

  return standardSlots
}

// Generate a multi-day agenda for a doctor
const generateDoctorAgenda = (
  doctorId: string,
  days: number = 14
): DoctorAgenda => {
  const doctor = mockDoctors.find(doc => doc.id === doctorId)
  if (!doctor) {
    throw new Error(`Doctor with ID ${doctorId} not found`)
  }

  const today = new Date()
  const agenda: DailyAgenda[] = []

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(currentDate.getDate() + i)

    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      continue
    }

    const dateString = currentDate.toISOString().split('T')[0] // YYYY-MM-DD

    // Find available slots for this date from doctor data
    const availableDay = doctor.availableSlots?.find(
      slot => slot.day === dateString
    )
    const availableSlotTimes = availableDay?.times || []

    // Find booked appointments for this doctor on this date
    const dateStart = new Date(dateString)
    const dateEnd = new Date(dateString)
    dateEnd.setHours(23, 59, 59)

    const bookedAppointments = mockAppointments.filter(
      apt =>
        apt.doctorId === doctorId &&
        apt.status !== AppointmentStatus.CANCELED &&
        new Date(apt.dateTime) >= dateStart &&
        new Date(apt.dateTime) <= dateEnd
    )

    // Generate slots for this day
    const slots = generateTimeSlots(availableSlotTimes, bookedAppointments)

    agenda.push({
      date: dateString,
      slots,
    })
  }

  return {
    doctorId: doctor.id,
    doctorName: doctor.name || `Dr. ${doctor.firstName} ${doctor.lastName}`,
    agenda,
  }
}

// Generate all doctor agendas
export const generateDoctorAgendas = (): DoctorAgenda[] => {
  return mockDoctors.map(doctor => generateDoctorAgenda(doctor.id))
}

// Get a specific doctor's agenda
export const getDoctorAgenda = (doctorId: string): DoctorAgenda | undefined => {
  return mockDoctorAgendas.find(agenda => agenda.doctorId === doctorId)
}

// Get available slots for a doctor on a specific date
export const getDoctorAvailableSlots = (
  doctorId: string,
  date: string
): TimeSlot[] => {
  const agenda = getDoctorAgenda(doctorId)
  const dayAgenda = agenda?.agenda.find(day => day.date === date)

  if (!dayAgenda) {
    return []
  }

  return dayAgenda.slots.filter(slot => slot.isAvailable)
}

// Get all appointments for a specific patient
export const getPatientAppointments = (patientId: string) => {
  return mockAppointments.filter(apt => apt.patientId === patientId)
}

// Get upcoming appointments for a specific patient
export const getPatientUpcomingAppointments = (patientId: string) => {
  const now = new Date()
  return mockAppointments
    .filter(
      apt =>
        apt.patientId === patientId &&
        apt.status !== AppointmentStatus.CANCELED &&
        apt.status !== AppointmentStatus.COMPLETED &&
        new Date(apt.dateTime) >= now
    )
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    )
}

// Get past appointments for a specific patient
export const getPatientPastAppointments = (patientId: string) => {
  const now = new Date()
  return mockAppointments
    .filter(
      apt =>
        apt.patientId === patientId &&
        (apt.status === AppointmentStatus.COMPLETED ||
          new Date(apt.dateTime) < now)
    )
    .sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    )
}

// Create the mock data
export const mockDoctorAgendas: DoctorAgenda[] = generateDoctorAgendas()

// Helper for formatting a date range in a human-readable way
export const formatDateRange = (
  startDate: Date = new Date(),
  days: number = 7
): string => {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + days)

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }

  return `${startDate.toLocaleDateString('en-US', options)} to ${endDate.toLocaleDateString('en-US', options)}`
}

// Get a formatted summary of a doctor's availability for the next N days
export const getDoctorAvailabilitySummary = (
  doctorId: string,
  days: number = 7
): string => {
  const agenda = getDoctorAgenda(doctorId)
  if (!agenda) {
    return `No availability information found for this doctor.`
  }

  const today = new Date()
  const relevantDays = agenda.agenda
    .filter(day => new Date(day.date) >= today)
    .slice(0, days)

  if (relevantDays.length === 0) {
    return `No upcoming availability for Dr. ${agenda.doctorName.split(' ')[1]} in the next ${days} days.`
  }

  const summary = relevantDays.map(day => {
    const availableSlots = day.slots.filter(slot => slot.isAvailable)
    const dayName = new Date(day.date).toLocaleDateString('en-US', {
      weekday: 'long',
    })
    const formattedDate = new Date(day.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    })

    if (availableSlots.length === 0) {
      return `${dayName}, ${formattedDate}: No available slots`
    }

    const times = availableSlots.map(slot => {
      // Convert from 24h to 12h format for display
      const startHour = parseInt(slot.startTime.split(':')[0])
      const startMinute = slot.startTime.split(':')[1]
      const ampm = startHour >= 12 ? 'PM' : 'AM'
      const hour12 = startHour % 12 || 12
      return `${hour12}:${startMinute} ${ampm}`
    })

    return `${dayName}, ${formattedDate}: ${times.join(', ')}`
  })

  return `Dr. ${agenda.doctorName.split(' ')[1]}'s availability for ${formatDateRange(today, days)}:\n${summary.join('\n')}`
}

// Get a formatted summary of a patient's upcoming appointments
export const getPatientAppointmentSummary = (patientId: string): string => {
  const upcomingAppointments = getPatientUpcomingAppointments(patientId)

  if (upcomingAppointments.length === 0) {
    return `You don't have any upcoming appointments scheduled.`
  }

  const appointmentSummaries = upcomingAppointments.map(apt => {
    const doctor = mockDoctors.find(doc => doc.id === apt.doctorId)
    const doctorName = doctor ? doctor.name : 'Unknown Doctor'
    const aptDate = new Date(apt.dateTime)
    const formattedDate = aptDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    const formattedTime = aptDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return `${formattedDate} at ${formattedTime} with ${doctorName} (${apt.type === AppointmentType.IN_PERSON ? 'In-person' : apt.type === AppointmentType.VIDEO ? 'Video call' : 'Phone call'})${apt.reason ? ` - ${apt.reason}` : ''}`
  })

  return `Your upcoming appointment${upcomingAppointments.length > 1 ? 's' : ''}:\n${appointmentSummaries.join('\n')}`
}
