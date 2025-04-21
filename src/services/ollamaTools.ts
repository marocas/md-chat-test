import {
  getAvailableDoctors,
  getDoctorById,
  getDoctors,
  getDoctorsBySpecialty,
} from '@/data/mock/doctors'

// Define the Ollama tool format
export interface OllamaTool {
  type: string
  function: {
    name: string
    description: string
    parameters?: {
      type: string
      properties: Record<string, any>
      required?: string[]
    }
  }
}

// Tool to get all doctors
export const getDoctorsTool: OllamaTool = {
  type: 'function',
  function: {
    name: 'getDoctors',
    description: 'Get a list of all doctors in the system',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
}

// Tool to get a specific doctor by ID
export const getDoctorByIdTool: OllamaTool = {
  type: 'function',
  function: {
    name: 'getDoctorById',
    description: 'Get details of a specific doctor by their ID',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The unique identifier of the doctor',
        },
      },
      required: ['id'],
    },
  },
}

// Tool to get doctors by specialty
export const getDoctorsBySpecialtyTool: OllamaTool = {
  type: 'function',
  function: {
    name: 'getDoctorsBySpecialty',
    description: 'Get all doctors with a specific specialty',
    parameters: {
      type: 'object',
      properties: {
        specialty: {
          type: 'string',
          description: 'Medical specialty (e.g., Cardiology, Neurology)',
        },
      },
      required: ['specialty'],
    },
  },
}

// Tool to get all doctors accepting new patients
export const getAvailableDoctorsTool: OllamaTool = {
  type: 'function',
  function: {
    name: 'getAvailableDoctors',
    description: 'Get a list of all doctors currently accepting new patients',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
}

// Tool to search doctors by name
export const searchDoctorsByName: OllamaTool = {
  type: 'function',
  function: {
    name: 'searchDoctorsByName',
    description:
      'Search for doctors by name (first name, last name, or full name)',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Full or partial name of the doctor to search for',
        },
      },
      required: ['name'],
    },
  },
}

// Tool to find doctors by insurance
export const findDoctorsByInsurance: OllamaTool = {
  type: 'function',
  function: {
    name: 'findDoctorsByInsurance',
    description: 'Find doctors who accept a specific insurance',
    parameters: {
      type: 'object',
      properties: {
        insurance: {
          type: 'string',
          description: 'Insurance provider name',
        },
      },
      required: ['insurance'],
    },
  },
}

// Function to handle tool calls and execute the corresponding function
export async function executeToolCall(
  toolName: string,
  args: Record<string, any>
): Promise<any> {
  console.log({ toolName, args })

  if (toolName === 'getDoctors') {
    return await getDoctors()
  } else if (toolName === 'getDoctorById') {
    return await getDoctorById(args.id)
  } else if (toolName === 'getDoctorsBySpecialty') {
    return await getDoctorsBySpecialty(args.specialty)
  } else if (toolName === 'getAvailableDoctors') {
    return await getAvailableDoctors()
  } else if (toolName === 'searchDoctorsByName') {
    const doctors = await getDoctors()
    const searchTerm = args.name.toLowerCase()
    const filteredDoctors = doctors.filter(
      doctor =>
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.firstName.toLowerCase().includes(searchTerm) ||
        doctor.lastName.toLowerCase().includes(searchTerm)
    )
    console.log('\n=== Filtered Doctors ===\n')
    console.log('Search Term:', searchTerm)
    console.log('Doctors:', doctors)
    console.log('Filtered Doctors:', filteredDoctors)
    console.log('===\n')
    return filteredDoctors
  } else if (toolName === 'findDoctorsByInsurance') {
    const doctors = await getDoctors()
    const insuranceTerm = args.insurance.toLowerCase()
    const filteredDoctors = doctors.filter(doctor =>
      doctor.insurances.some(ins => ins.toLowerCase().includes(insuranceTerm))
    )
    console.log('\n=== Filtered Doctors ===\n')
    console.log('Insurance:', insuranceTerm)
    console.log('Doctors:', doctors)
    console.log('Filtered Doctors:', filteredDoctors)
    console.log('===\n')
    return filteredDoctors
  } else {
    throw new Error(`Unknown tool: ${toolName}`)
  }
}

// Get all tools in the format expected by Ollama
export default async function getTools(): Promise<OllamaTool[]> {
  return [
    getDoctorsTool,
    getDoctorByIdTool,
    getDoctorsBySpecialtyTool,
    getAvailableDoctorsTool,
    searchDoctorsByName,
    findDoctorsByInsurance,
  ]
}
