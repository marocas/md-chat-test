import { Doctor, getDoctors } from '@/data/mock/doctors'
import { getSpecialties } from '@/data/mock/specialties'
import { User } from '@/data/mock/users'

export interface ConsultationSuggestion {
  doctor: Doctor
  matchReason: string
  earliestAvailableSlot?: {
    date: string
    time: string
  }
}

/**
 * Suggests doctors for a user based on a requested specialty or practice
 *
 * @param user The user requesting the consultation
 * @param specialty The medical specialty or practice area requested
 * @returns An array of doctor suggestions with additional context
 */
export const suggestDoctorsForConsultation = async (
  user: User,
  specialty: string
): Promise<ConsultationSuggestion[]> => {
  const allDoctors = await getDoctors()
  const allSpecialties = await getSpecialties()

  // Find the best matching specialty from our known list
  const matchedSpecialty = findBestMatchingSpecialty(specialty, allSpecialties)
  if (!matchedSpecialty) {
    return []
  }

  // Filter doctors by the matched specialty
  const matchingDoctors = allDoctors.filter(
    doctor =>
      doctor.specialty.toLowerCase() === matchedSpecialty.toLowerCase() &&
      doctor.acceptingNewPatients
  )

  if (matchingDoctors.length === 0) {
    return []
  }

  // Create suggestions with context
  const suggestions: ConsultationSuggestion[] = matchingDoctors.map(doctor => {
    const suggestion: ConsultationSuggestion = {
      doctor,
      matchReason: `Specialist in ${doctor.specialty}`,
    }

    // Add insurance match information if applicable
    if (
      user.insuranceInfo &&
      doctor.insurances.includes(user.insuranceInfo.provider)
    ) {
      suggestion.matchReason += ` and accepts your ${user.insuranceInfo.provider} insurance`
    }

    // Find earliest available slot if any
    if (doctor.availableSlots && doctor.availableSlots.length > 0) {
      const today = new Date()
      // Sort available slots by date
      const sortedSlots = [...doctor.availableSlots].sort((a, b) => {
        return new Date(a.day).getTime() - new Date(b.day).getTime()
      })

      for (const slot of sortedSlots) {
        const slotDate = new Date(slot.day)
        if (slotDate >= today && slot.times.length > 0) {
          suggestion.earliestAvailableSlot = {
            date: slot.day,
            time: slot.times[0],
          }
          break
        }
      }
    }

    return suggestion
  })

  // Sort suggestions by those with insurance match first, then by earliest availability
  return suggestions.sort((a, b) => {
    // Prioritize insurance match
    const aHasInsuranceMatch = a.matchReason.includes('insurance') ? 1 : 0
    const bHasInsuranceMatch = b.matchReason.includes('insurance') ? 1 : 0

    if (aHasInsuranceMatch !== bHasInsuranceMatch) {
      return bHasInsuranceMatch - aHasInsuranceMatch
    }

    // Then sort by earliest available slot
    if (a.earliestAvailableSlot && b.earliestAvailableSlot) {
      const dateA = new Date(
        `${a.earliestAvailableSlot.date}T${a.earliestAvailableSlot.time}`
      )
      const dateB = new Date(
        `${b.earliestAvailableSlot.date}T${b.earliestAvailableSlot.time}`
      )
      return dateA.getTime() - dateB.getTime()
    }

    if (a.earliestAvailableSlot) return -1
    if (b.earliestAvailableSlot) return 1

    return 0
  })
}

/**
 * Finds the closest matching specialty from our known specialties list
 */
function findBestMatchingSpecialty(
  requested: string,
  knownSpecialties: string[]
): string | null {
  // Direct match
  const normalizedRequested = requested.toLowerCase().trim()

  for (const specialty of knownSpecialties) {
    if (specialty.toLowerCase() === normalizedRequested) {
      return specialty
    }
  }

  // Partial match
  for (const specialty of knownSpecialties) {
    if (
      specialty.toLowerCase().includes(normalizedRequested) ||
      normalizedRequested.includes(specialty.toLowerCase())
    ) {
      return specialty
    }
  }

  // Check for common keyword matches
  const specialtyKeywords: { [key: string]: string[] } = {
    Cardiology: [
      'heart',
      'cardiac',
      'cardiovascular',
      'chest pain',
      'blood pressure',
    ],
    'Family Medicine': ['general', 'primary care', 'check up', 'family doctor'],
    Neurology: ['brain', 'nerve', 'headache', 'migraine', 'seizure'],
    'Orthopedic Surgery': [
      'bone',
      'joint',
      'fracture',
      'knee',
      'shoulder',
      'orthopedic',
    ],
    Pediatrics: ['child', 'kid', 'baby', 'infant', 'children'],
    Dermatology: ['skin', 'rash', 'acne', 'dermatitis'],
    Psychiatry: ['mental', 'depression', 'anxiety', 'psychological'],
    Endocrinology: ['hormone', 'diabetes', 'thyroid', 'metabolism'],
    Gastroenterology: [
      'stomach',
      'intestine',
      'digestion',
      'liver',
      'digestive',
    ],
    Oncology: ['cancer', 'tumor', 'oncology'],
    Pulmonology: ['lung', 'breathing', 'respiratory', 'asthma', 'cough'],
    Rheumatology: ['arthritis', 'autoimmune', 'joint pain', 'rheumatic'],
    Urology: ['kidney', 'bladder', 'urinary', 'prostate'],
    Ophthalmology: ['eye', 'vision', 'sight'],
    Anesthesiology: ['anesthesia', 'pain management', 'sedation'],
    'Emergency Medicine': ['emergency', 'urgent', 'trauma'],
    'Internal Medicine': ['internal', 'adult medicine'],
  }

  for (const specialty in specialtyKeywords) {
    const keywords = specialtyKeywords[specialty]
    for (const keyword of keywords) {
      if (normalizedRequested.includes(keyword.toLowerCase())) {
        return specialty
      }
    }
  }

  return null
}

/**
 * Gets appointment availability for a specific doctor
 */
export const getDoctorAvailability = async (
  doctorId: string
): Promise<Array<{ date: string; timeSlots: string[] }>> => {
  const allDoctors = await getDoctors()
  const doctor = allDoctors.find(d => d.id === doctorId)

  if (!doctor || !doctor.availableSlots) {
    return []
  }

  return doctor.availableSlots.map(slot => ({
    date: slot.day,
    timeSlots: slot.times,
  }))
}
