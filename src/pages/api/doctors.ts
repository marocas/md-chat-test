import { Doctor, getDoctorById, getDoctors } from '@/data/mock/doctors'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  const { id } = req.query as Pick<Doctor, 'id'>

  if (id) {
    const doctor = await getDoctorById(id)

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    return res.status(200).json(doctor)
  }

  const doctors = await getDoctors()
  return res.status(200).json(doctors)
}
