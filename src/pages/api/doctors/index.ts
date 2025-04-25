// pages/api/doctors/[id].ts
import clientPromise from '@/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req

  const client = await clientPromise
  const db = client.db('md-chat-db')
  const collection = db.collection('doctors')

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const doctors = await collection.find({}).toArray()

    if (!doctors) {
      return res.status(404).json({ message: 'Doctors not found' })
    }

    return res.status(200).json(doctors)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error retrieving doctor(s)', error: err })
  }
}
