export const mockSpecialty: string[] = [
  'Cardiology',
  'Family Medicine',
  'Neurology',
  'Orthopedic Surgery',
  'Pediatrics',
  'Dermatology',
  'Psychiatry',
  'Endocrinology',
  'Gastroenterology',
  'Oncology',
  'Pulmonology',
  'Rheumatology',
  'Urology',
  'Ophthalmology',
  'Anesthesiology',
  'Emergency Medicine',
  'Internal Medicine',
]

export const getSpecialties = async (): Promise<string[]> => {
  return await Promise.resolve(mockSpecialty)
}
