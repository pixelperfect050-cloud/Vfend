import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { defaultModel } from '@/lib/openrouter/client'
import { requireAuth } from '@/lib/auth-api'

export async function POST(req: Request) {
  try {
    const { error: authError } = await requireAuth()
    if (authError) return authError

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages array' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are the BrandRocket AI Assistant, an elite marketing strategist, copywriter, and growth expert built directly into the user's SaaS dashboard.
Your goal is to help users generate campaigns, brainstorm content, write ad copy, improve SEO, and analyze marketing performance.
Always be extremely helpful, professional, concise, and highly intelligent. 
Format your responses using Markdown (lists, code blocks, bold text, headings) where appropriate to make your answers easy to read.
If the user asks who you are, introduce yourself as the BrandRocket AI.`

    const result = await streamText({
      model: defaultModel,
      system: systemPrompt,
      messages,
      temperature: 0.7,
    })

    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      { error: 'An error occurred during chat.' },
      { status: 500 }
    )
  }
}
