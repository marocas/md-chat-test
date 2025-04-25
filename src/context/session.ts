// lib/session.ts
import { parse, serialize } from 'cookie'
import { IncomingMessage } from 'http'
import type { NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import clientPromise from '../lib/mongodb'

const COOKIE_NAME = 'session_token'

export function createSessionToken(): string {
  return uuidv4()
}

export function setSessionCookie(
  res: NextApiResponse,
  token: string,
  rememberMe: boolean = false
) {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: (rememberMe ? 7 : 1) * 24 * 60 * 60, // 7 days or 1 day
  })

  res.setHeader('Set-Cookie', cookie)
}

export function clearSessionCookie(res: NextApiResponse) {
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: -1,
  })

  res.setHeader('Set-Cookie', cookie)
}

// Read session from cookie
export const getSession = async (req: IncomingMessage) => {
  const cookies = parse(req.headers.cookie || '')
  const token = cookies[COOKIE_NAME]

  if (!token) return null

  const client = await clientPromise
  const db = client.db()
  const sessions = db.collection('sessions')

  const session = await sessions.findOne({ token })
  if (!session) return null

  // Use aggregation to fetch user and add `name`
  const userAgg = await db
    .collection('users')
    .aggregate([
      { $match: { _id: session.userId } },
      {
        $addFields: { name: { $concat: ['$firstName', ' ', '$lastName'] } },
      },
      {
        $project: {
          password: 0, // Hide sensitive info if needed
        },
      },
    ])
    .toArray()

  const user = userAgg[0]
  if (!user) return null

  const result = {
    user: {
      ...user,
      _id: user._id.toString(), // Convert ObjectId to string
    },
  }

  console.log('User found:', result.user)

  return result
}
