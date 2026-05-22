import { NextResponse } from 'next/server'
import { defaultModel } from '@/lib/openrouter/client'
import { seoAnalyzerSchema } from '@/lib/validations'
import { generateText } from 'ai'
import * as cheerio from 'cheerio'
import { requireAuth } from '@/lib/auth-api'

export async function POST(req: Request) {
  try {
    const { error: authError } = await requireAuth()
    if (authError) return authError

    const body = await req.json()
    const parsedData = seoAnalyzerSchema.safeParse(body)
    
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid URL provided', details: parsedData.error.flatten() },
        { status: 400 }
      )
    }

    const { url } = parsedData.data

    // 1. Fetch the target URL HTML
    let html = ''
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const res = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'BrandRocket SEO Bot 1.0 (Mozilla/5.0 compatible)'
        }
      })
      clearTimeout(timeoutId)
      
      if (!res.ok) throw new Error(`Status ${res.status}`)
      html = await res.text()
    } catch (e: any) {
      return NextResponse.json(
        { error: 'Failed to fetch the URL. Make sure it is publicly accessible and returns a valid HTML document.' },
        { status: 400 }
      )
    }

    // 2. Extract key SEO elements using cheerio
    const $ = cheerio.load(html)
    const title = $('title').text()
    const metaDescription = $('meta[name="description"]').attr('content') || ''
    const h1Count = $('h1').length
    const h1First = $('h1').first().text()
    const imagesCount = $('img').length
    const imagesWithoutAlt = $('img:not([alt]), img[alt=""]').length
    const wordCount = $('body').text().split(/\s+/).filter(w => w.length > 0).length

    // 3. Send extracted data to AI for scoring and recommendations
    const systemPrompt = `You are a strict, expert SEO analyst.
Evaluate the following SEO metrics for a webpage and provide a JSON response.
Do NOT use markdown code blocks (\`\`\`json) in your response, return ONLY raw valid JSON.

JSON Schema to follow:
{
  "score": <number 0-100>,
  "categories": {
    "onPage": <number 0-100>,
    "content": <number 0-100>,
    "technical": <number 0-100>
  },
  "issues": [
    { "type": "error" | "warning" | "success", "title": "<short title>", "description": "<detailed fix>" }
  ],
  "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"]
}
`

    const userPrompt = `Analyze these extracted SEO metrics for ${url}:
- Title: ${title} (${title.length} chars)
- Meta Description: ${metaDescription} (${metaDescription.length} chars)
- H1 Count: ${h1Count} (First H1: "${h1First}")
- Images without Alt Text: ${imagesWithoutAlt} out of ${imagesCount}
- Estimated Word Count: ${wordCount}
`

    const { text } = await generateText({
      model: defaultModel,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.1,
    })

    // Parse AI JSON response
    let aiResults
    try {
      // Clean potential markdown blocks if the AI ignored the instruction
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      aiResults = JSON.parse(cleanedText)
    } catch (e) {
      console.error('Failed to parse AI SEO response', text)
      throw new Error('AI returned malformed data')
    }

    return NextResponse.json({
      url,
      extracted: {
        title,
        metaDescription,
        h1Count,
        imagesCount,
        imagesWithoutAlt,
        wordCount,
      },
      ...aiResults
    })
    
  } catch (error: any) {
    console.error('SEO Analysis Error:', error)
    return NextResponse.json(
      { error: 'An error occurred during SEO analysis.' },
      { status: 500 }
    )
  }
}
