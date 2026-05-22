import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { defaultModel } from '@/lib/openrouter/client'
import { adGeneratorSchema } from '@/lib/validations'
import { requireAuth } from '@/lib/auth-api'

export async function POST(req: Request) {
  try {
    const { error: authError } = await requireAuth()
    if (authError) return authError

    // We expect the prompt variables in the request body
    const body = await req.json()
    
    // Validate the incoming data against our schema
    const parsedData = adGeneratorSchema.safeParse(body)
    
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsedData.error.flatten() },
        { status: 400 }
      )
    }

    const { businessName, product, targetAudience, tone, platform, goal } = parsedData.data

    const systemPrompt = `You are a world-class AI copywriter and marketing expert. 
Your goal is to generate highly converting, engaging, and platform-optimized ad copy.
Follow platform-specific best practices strictly (e.g., character limits, hashtag usage, formatting).
Never include introductory conversational filler like "Here is your ad copy:". Just return the copy.

Platform Guidelines:
- Facebook: Conversational, engaging, includes emojis, strong CTA.
- Google: Direct, keyword-rich, clear value proposition, strictly professional.
- Instagram: Visual-first tone, heavy emoji use, strong aesthetic feel, relevant hashtags.
- LinkedIn: Professional, value-driven, industry-standard language, clear B2B CTA.
- X/Twitter: Short, punchy, under 280 characters, trending hashtags.

Output Format:
Provide 3 distinct variations of the ad copy. Label them clearly as Variation 1, Variation 2, and Variation 3. Include suggested headlines where applicable.`

    const userPrompt = `Generate ad copy for the following:
Business Name: ${businessName}
Product/Service: ${product}
Target Audience: ${targetAudience}
Tone of Voice: ${tone}
Platform: ${platform}
Campaign Goal: ${goal}

Please provide 3 high-converting variations.`

    const result = await streamText({
      model: defaultModel,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    })

    return result.toTextStreamResponse()
    
  } catch (error: any) {
    console.error('AI Generation Error:', error)
    return NextResponse.json(
      { error: 'An error occurred during AI generation.' },
      { status: 500 }
    )
  }
}
