import type { NextApiRequest, NextApiResponse } from 'next'
import { Ollama } from 'ollama'

// Define the response type
type ModelsResponse = {
  models: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ModelsResponse | { error: string }>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Create an Ollama client instance
    const ollama = new Ollama({
      host: 'http://localhost:11434',
    })

    // Get models from Ollama
    const response = await ollama.list()

    // Return model names
    return res.status(200).json({
      models: response.models.map(model => model.name),
    })
  } catch (error) {
    console.error('Error listing models:', error)
    return res
      .status(500)
      .json({ error: 'Failed to fetch models from Ollama service' })
  }
}
