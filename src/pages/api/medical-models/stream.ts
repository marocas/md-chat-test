import type { NextApiRequest, NextApiResponse } from 'next'

// This is a placeholder streaming API endpoint for medical AI models
// In a production environment, you would implement actual streaming API calls

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  images?: string[]
}

interface MedicalStreamRequestBody {
  provider: 'gemini' | 'openai' | 'openbiollm' | 'huggingface'
  model: string
  messages: ChatMessage[]
  system?: string
  options?: {
    temperature?: number
    top_p?: number
    max_tokens?: number
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { provider, model, messages, system, options } =
      req.body as MedicalStreamRequestBody

    // Validate required fields
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' })
    }

    if (!model) {
      return res.status(400).json({ error: 'Model name is required' })
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' })
    }

    // Set up Server-Sent Events headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for Nginx proxy setups
    })

    // Get the user's query
    const userMessage = messages[messages.length - 1].content

    // Generate a mock medical response based on the provider
    const mockResponse = getMockMedicalResponse(userMessage, provider)
    const disclaimer =
      '\n\nPlease note: This information is for educational purposes only and should not replace professional medical advice. Consult with a healthcare provider for specific medical concerns.'

    // Format the full response based on the provider
    let fullResponse = ''
    switch (provider) {
      case 'gemini':
        fullResponse = `Based on Med-Gemini's analysis: ${mockResponse}${disclaimer}`
        break
      case 'openai':
        fullResponse = `Medical analysis from GPT-4o Medical: ${mockResponse}${disclaimer}`
        break
      case 'openbiollm':
        fullResponse = `BioMedLM analysis indicates: ${mockResponse}${disclaimer}`
        break
      case 'huggingface':
        fullResponse = `MedAlpaca medical assessment: ${mockResponse}${disclaimer}`
        break
      default:
        fullResponse = `Using general medical knowledge: ${mockResponse}${disclaimer}`
    }

    // Stream the response in smaller chunks to simulate streaming from an AI model
    // Using individual words makes for a smoother streaming experience
    const words = fullResponse.split(' ')

    // Use a smaller batch size for more realistic streaming
    const chunkSize = Math.max(1, Math.floor(Math.random() * 3))

    for (let i = 0; i < words.length; i += chunkSize) {
      // Take a batch of words and join them
      const chunk =
        words.slice(i, i + chunkSize).join(' ') +
        (i + chunkSize < words.length ? ' ' : '')

      // Properly format as SSE
      const eventData = JSON.stringify({ content: chunk })
      res.write(`data: ${eventData}\n\n`)

      // Flush to ensure immediate delivery
      // @ts-ignore - flush exists but TypeScript doesn't know about it
      if (res.flush) {
        // @ts-ignore
        res.flush()
      }

      // Add a small random delay to simulate realistic typing speed (20-80ms)
      await new Promise(resolve =>
        setTimeout(resolve, 20 + Math.floor(Math.random() * 60))
      )
    }

    // Send end signal
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (error) {
    console.error('Error generating streaming medical response:', error)

    // If we haven't started streaming yet, send a JSON error
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ error: 'Failed to generate streaming medical response' })
    }

    // If we've already started streaming, send an error in the stream format
    res.write(
      `data: ${JSON.stringify({ error: 'Error during streaming' })}\n\n`
    )
    res.end()
  }
}

// Mock function to simulate different medical model responses
function getMockMedicalResponse(query: string, provider: string): string {
  const lowerQuery = query.toLowerCase()

  // Provider-specific responses for demonstration
  const providerSpecificInfo = {
    gemini: ' (According to recent medical literature indexed by Med-Gemini)',
    openai: ' (Based on current clinical guidelines and medical research)',
    openbiollm: ' (Verified with PubMed and medical journals)',
    huggingface: ' (Cross-referenced with clinical databases)',
  }

  // Add provider-specific information for more realism
  const providerSuffix = providerSpecificInfo[provider] || ''

  // Simple keyword-based response system
  if (lowerQuery.includes('headache')) {
    return (
      "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or underlying medical conditions. Common types include tension headaches, migraines, and cluster headaches. For persistent or severe headaches, it's important to consult with a healthcare provider" +
      providerSuffix +
      '.'
    )
  } else if (
    lowerQuery.includes('blood pressure') ||
    lowerQuery.includes('hypertension')
  ) {
    return (
      'Normal blood pressure is typically around 120/80 mmHg. Hypertension (high blood pressure) is generally considered to be 130/80 mmHg or higher. Lifestyle modifications such as maintaining a healthy weight, regular exercise, reducing sodium intake, and limiting alcohol can help manage blood pressure' +
      providerSuffix +
      '.'
    )
  } else if (lowerQuery.includes('diabetes')) {
    return (
      'Diabetes is a chronic condition affecting how the body processes blood sugar. Type 1 diabetes involves immune system destruction of insulin-producing cells, while Type 2 diabetes involves insulin resistance. Management includes monitoring blood glucose, medication, healthy eating, and regular physical activity' +
      providerSuffix +
      '.'
    )
  } else if (
    lowerQuery.includes('covid') ||
    lowerQuery.includes('coronavirus')
  ) {
    return (
      'COVID-19 is caused by the SARS-CoV-2 virus and symptoms can include fever, cough, fatigue, loss of taste or smell, and difficulty breathing. Prevention strategies include vaccination, good hand hygiene, and staying home when ill. Treatment depends on severity, with mild cases often managed at home while severe cases may require hospitalization' +
      providerSuffix +
      '.'
    )
  } else {
    return (
      "I understand you have a medical question. For accurate diagnosis and treatment advice, it's best to consult with a qualified healthcare professional who can evaluate your specific situation and medical history" +
      providerSuffix +
      '.'
    )
  }
}
