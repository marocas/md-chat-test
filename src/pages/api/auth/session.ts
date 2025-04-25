import { getSession } from '@/context/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req)

  if (!session) return res.status(200).json({ user: null })

  res.status(200).json(session)
}
