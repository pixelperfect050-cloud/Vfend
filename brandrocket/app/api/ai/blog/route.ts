import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { defaultModel } from '@/lib/openrouter/client'
import { blogWriterSchema } from '@/lib/validations'
import { requireAuth } from '@/lib/auth-api'

export async function POST(req: Request) {
  try {
    const { error: authError } = await requireAuth()
    if (authError) return authError

    const body = await req.json()
    const parsedData = blogWriterSchema.safeParse(body)
    
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsedData.error.flatten() },
        { status: 400 }
      )
    }

    const { keyword, tone, length, outline } = parsedData.data

    const systemPrompt = `You are an expert SEO content writer and blogger.
Your goal is to write a highly engaging, SEO-optimized blog post based on the provided parameters.
Always use Markdown formatting (H2, H3, bullet points, bold text).
Write in a structure that includes an introduction, main body sections, and a conclusion.
Never include conversational filler like "Here is your blog post:" — just output the content directly.`

    let lengthInstruction = 'Make it concise and impactful (around 500-800 words).'
    if (length === 'medium') lengthInstruction = 'Make it comprehensive and detailed (around 1000-1500 words).'
    if (length === 'long') lengthInstruction = 'Make it an ultimate guide, highly detailed and exhaustive (1500+ words).'

    const userPrompt = `Write an SEO-optimized blog post with the following requirements:
- Main Keyword / Topic: ${keyword}
- Tone of Voice: ${tone}
- Desired Length: ${lengthInstruction}
- Outline / Key Points to Cover: ${outline || 'Generate a standard logical outline based on the topic.'}

Please generate the full blog post in Markdown.`

    const result = await streamText({
      model: defaultModel,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    })

    return result.toTextStreamResponse()
    
  } catch (error: any) {
    console.error('AI Blog Generation Error:', error)
    return NextResponse.json(
      { error: 'An error occurred during blog generation.' },
      { status: 500 }
    )
  }
}
