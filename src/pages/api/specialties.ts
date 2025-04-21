import { getSpecialties } from '@/data/mock/specialties'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const specialties = await getSpecialties()
  return res.status(200).json(specialties)
}
