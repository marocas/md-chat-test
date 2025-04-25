import { getSessionToken } from '@/context/session'
import clientPromise from '@/lib/mongodb'
import type { NextApiRequest } from 'next'

export async function getUserFromRequest(req: NextApiRequest) {
  const token = getSessionToken(req)
  if (!token) return null

  const client = await clientPromise
  const db = client.db()
  const session = await db.collection('sessions').findOne({ token })

  if (!session) return null
  return await db.collection('users').findOne({ _id: session.userId })
}
