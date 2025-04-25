// pages/api/doctors/[id].ts
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
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

  if (!id) {
    return res.status(400).json({ message: 'ID is required' })
  }

  try {
    const doctor = await collection.findOne({
      _id: new ObjectId(id as string),
    })
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    return res.status(200).json(doctor)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error retrieving doctor(s)', error: err })
  }
}
