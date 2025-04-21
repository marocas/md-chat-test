import { AuthState } from '@/components/auth/AuthProvider'
import { getDoctorById } from '@/data/mock/doctors'
import { getUserById } from '@/data/mock/users'

/**
 * Builds the medical context object based on the current user state and selections
 *
 * @param doctorId - Optional doctor ID to include doctor information
 * @param patientId - Optional patient ID to include patient medical history
 * @param authState - Current authentication state
 * @returns A structured medical context object for AI conversations
 */
export default async function buildMedicalContext(
  doctorId: string | null,
  patientId: string | null,
  authState: AuthState
) {
  let medicalContext: any = {
    hasContext: false,
    doctor: null,
    patient: null,
  }

  // Add doctor info if specified
  if (doctorId) {
    const doctor = await getDoctorById(doctorId)
    if (doctor) {
      medicalContext.doctor = doctor
      medicalContext.hasContext = true
    }
  }

  // Add patient info if logged in and specified
  if (
    patientId &&
    authState.isAuthenticated &&
    authState.user &&
    authState.user.id === patientId
  ) {
    const patient = await getUserById(patientId)
    if (patient) {
      medicalContext.patient = {
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        age: patient.age,
        gender: patient.gender,
        medicalHistory: patient.medicalInfo?.chronicConditions || [],
        currentMedications: patient.medicalInfo?.medications || [],
        allergies: patient.medicalInfo?.allergies || [],
        // Don't include private info like contact or insurance
      }
      medicalContext.hasContext = true
    }
  }

  return medicalContext
}
