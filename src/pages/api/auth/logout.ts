// pages/api/auth/logout.ts
import { clearSessionCookie } from '@/context/session'
import clientPromise from '@/lib/mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.session_token

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  clearSessionCookie(res)

  const client = await clientPromise
  const db = client.db()
  await db.collection('sessions').deleteOne({ token })

  return res.status(200).json({ message: 'Logged out successfully' })
}
