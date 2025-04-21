import { FeedbackData } from '@/services/feedbackService'
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

// Directory to store feedback data (in a production environment, this would be a database)
const dataDir = path.join(process.cwd(), 'data', 'feedback')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const feedbackData = req.body as FeedbackData

    // Validate required fields
    if (!feedbackData.id || !feedbackData.messageId || !feedbackData.rating) {
      return res.status(400).json({ error: 'Missing required feedback fields' })
    }

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Generate a filename based on timestamp and feedback ID
    const filename = `feedback-${new Date().toISOString().replace(/:/g, '-')}-${
      feedbackData.id
    }.json`
    const filePath = path.join(dataDir, filename)

    // Store the feedback data (in a production environment, this would go to a database)
    fs.writeFileSync(filePath, JSON.stringify(feedbackData, null, 2))

    // Also append to a consolidated file for easier analysis
    const consolidatedFilePath = path.join(dataDir, 'all-feedback.json')
    let allFeedback = []

    if (fs.existsSync(consolidatedFilePath)) {
      const data = fs.readFileSync(consolidatedFilePath, 'utf8')
      allFeedback = JSON.parse(data)
    }

    allFeedback.push(feedbackData)
    fs.writeFileSync(consolidatedFilePath, JSON.stringify(allFeedback, null, 2))

    // Return success
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error storing feedback:', error)
    return res.status(500).json({ error: 'Failed to store feedback' })
  }
}
