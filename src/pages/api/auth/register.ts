// pages/api/register.ts
import { createSessionToken } from '@/context/session'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    address,
    password,
    insuranceProvider,
    insuranceNumber,
    primaryCare,
    emergencyContact,
  } = req.body

  console.log(req.body)

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const users = db.collection('users')
    const sessions = db.collection('sessions')

    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const insertedUser = await users.insertOne({
      ...req.body,
      password: hashedPassword,
    })

    const sessionToken = createSessionToken()
    await sessions.insertOne({
      token: sessionToken,
      userId: insertedUser.insertedId.toString(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    })

    return res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}
