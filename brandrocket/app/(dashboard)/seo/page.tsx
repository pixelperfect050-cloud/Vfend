'use client'

import * as React from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { SeoScannerForm } from '@/features/seo/components/seo-scanner-form'
import { SeoResults } from '@/features/seo/components/seo-results'
import { toast } from 'sonner'
import type { SeoReport } from '@/types'
import { seoAnalyzerSchema } from '@/lib/validations'
import type { z } from 'zod'

type SeoFormValues = z.infer<typeof seoAnalyzerSchema>

export default function SeoPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [report, setReport] = React.useState<SeoReport | null>(null)

  const onSubmit = async (data: SeoFormValues) => {
    setIsLoading(true)
    setReport(null)
    
    try {
      const response = await fetch('/api/ai/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to analyze URL')
      }

      const resultData = await response.json()
      
      const newReport: SeoReport = {
        id: crypto.randomUUID(),
        teamId: 'temp',
        url: data.url,
        overallScore: resultData.score,
        performanceScore: resultData.performanceScore || 0,
        accessibilityScore: resultData.accessibilityScore || 0,
        seoScore: resultData.seoScore || resultData.score,
        bestPracticesScore: resultData.bestPracticesScore || 0,
        issues: resultData.issues || [],
        headingStructure: resultData.headingStructure || {},
        createdBy: 'temp',
        loadTimeMs: resultData.loadTimeMs || 0,
        mobileReady: resultData.mobileReady || false,
        createdAt: new Date().toISOString()
      }

      setReport(newReport)
      toast.success('Analysis complete!')
    } catch (error: any) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="SEO Analyzer" 
        description="Scan any URL to identify SEO issues, get an AI-powered score, and receive actionable recommendations."
      />

      <SeoScannerForm onSubmit={onSubmit} isLoading={isLoading} />
      
      <SeoResults report={report} isLoading={isLoading} />
    </div>
  )
}
