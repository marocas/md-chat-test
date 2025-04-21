// Feedback service for collecting and analyzing user feedback on AI responses
// This service enables quality evaluation of the MediChat assistant

import { ChatMessage } from './ollamaService'

// Feedback rating levels
export type FeedbackRating = 'positive' | 'neutral' | 'negative'

// Categories for feedback classification
export type FeedbackCategory =
  | 'accuracy'
  | 'clarity'
  | 'completeness'
  | 'safety'
  | 'helpfulness'
  | 'other'

// Structure for feedback data
export interface FeedbackData {
  id: string
  userId: string
  messageId: string
  rating: FeedbackRating
  categories?: FeedbackCategory[]
  comment?: string
  queryText: string
  responseText: string
  modelInfo: string
  timestamp: Date
  conversationContext?: ChatMessage[]
}

/**
 * Submit feedback for a specific AI response
 */
export async function submitFeedback(
  feedbackData: FeedbackData
): Promise<boolean> {
  try {
    // In a production environment, this would send data to your backend API
    const response = await fetch('/api/feedback/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })

    if (!response.ok) {
      throw new Error(`Failed to submit feedback: ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error('Error submitting feedback:', error)
    // For demo purposes, we'll store feedback locally if the API call fails
    storeFeedbackLocally(feedbackData)
    return false
  }
}

/**
 * Fallback function to store feedback locally if the API call fails
 */
function storeFeedbackLocally(feedbackData: FeedbackData): void {
  try {
    // Get existing feedback from localStorage
    const existingFeedback = localStorage.getItem('mediChatFeedback')
    const feedbackArray = existingFeedback ? JSON.parse(existingFeedback) : []

    // Add new feedback
    feedbackArray.push(feedbackData)

    // Store updated feedback
    localStorage.setItem('mediChatFeedback', JSON.stringify(feedbackArray))

    console.log('Feedback stored locally')
  } catch (error) {
    console.error('Error storing feedback locally:', error)
  }
}

/**
 * Get feedback statistics for model evaluation and improvement
 */
export async function getFeedbackStats(): Promise<any> {
  try {
    const response = await fetch('/api/feedback/stats')

    if (!response.ok) {
      throw new Error(`Failed to get feedback stats: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting feedback stats:', error)
    return null
  }
}

/**
 * Extract learning insights from collected feedback
 * This would typically be part of a batch processing pipeline
 */
export async function extractLearningInsights(): Promise<any> {
  // In a production system, this would trigger a backend process
  // to analyze feedback and generate insights for model fine-tuning

  try {
    const response = await fetch('/api/feedback/insights')

    if (!response.ok) {
      throw new Error(
        `Failed to extract learning insights: ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Error extracting learning insights:', error)
    return null
  }
}
