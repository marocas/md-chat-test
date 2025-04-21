import { abortOllamaRequest } from '@/services/ollamaRequestManager'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { requestId } = req.query

    // Validate required parameters
    if (!requestId || Array.isArray(requestId)) {
      return res.status(400).json({ error: 'Valid requestId is required' })
    }

    // Attempt to abort the request
    const success = abortOllamaRequest(requestId)

    // Return the result
    return res.status(200).json({
      success,
      message: success
        ? 'Request aborted successfully'
        : 'Request not found or already completed',
    })
  } catch (error) {
    console.error('Error aborting request:', error)
    return res.status(500).json({ error: 'Failed to abort request' })
  }
}
