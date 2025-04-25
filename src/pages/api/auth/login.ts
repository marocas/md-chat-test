// pages/api/login.ts
import { createSessionToken, setSessionCookie } from '@/context/session'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcrypt'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed')
  }

  const { email, password, rememberMe } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' })
  }

  const client = await clientPromise
  const db = client.db()
  const users = db.collection('users')
  const sessions = db.collection('sessions')

  const user = await users.findOne({ email })
  // console.log('\n=== user ===')
  // console.log(user)
  // console.log('===\n')

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  // console.log('\n=== passwordMatch ===')
  // console.log(passwordMatch)
  // console.log('===\n')

  // For testing purposes, we are not checking the password
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const expiresAt = new Date(
    Date.now() + (rememberMe ? 7 : 1) * 24 * 60 * 60 * 1000
  ) // 7 days or 1 day

  const sessionToken = createSessionToken()
  await sessions.insertOne({
    token: sessionToken,
    userId: user._id,
    createdAt: new Date(),
    expiresAt,
  })

  setSessionCookie(res, sessionToken, rememberMe)
  return res.status(200).json({
    user: { ...user, name: `${user.firstName} ${user.lastName}` },
    message: 'Logged in successfully',
  })
}
