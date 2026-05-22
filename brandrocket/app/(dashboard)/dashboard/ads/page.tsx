'use client'

import * as React from 'react'
import { useCompletion } from '@ai-sdk/react'
import { PageHeader } from '@/components/shared/page-header'
import { AdGeneratorForm } from '@/features/ads/components/ad-generator-form'
import { AdOutputCard } from '@/features/ads/components/ad-output-card'
import { toast } from 'sonner'
import type { z } from 'zod'
import { adGeneratorSchema } from '@/lib/validations'
import { Megaphone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDemoMode } from '@/hooks/use-demo-mode'
import { EmptyState } from '@/components/shared/empty-state'

type AdFormValues = z.infer<typeof adGeneratorSchema>

export default function AdsPage() {
  const [platform, setPlatform] = React.useState<string>('Facebook')
  
  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/ai/generate',
    onError: (err) => {
      toast.error('Failed to generate ad copy. Please try again.')
      console.error(err)
    }
  })

  const onSubmit = async (data: AdFormValues) => {
    setPlatform(data.platform)
    // The useCompletion hook expects a single string prompt by default,
    // but we can pass our object as JSON
    await complete(JSON.stringify(data))
  }

  const { isDemoMode, isLoaded } = useDemoMode()
  const router = useRouter()

  if (!isLoaded) return null

  if (!isDemoMode) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="AI Ad Generator" 
          description="Create highly converting ad copy tailored for specific platforms and audiences in seconds."
        />
        <EmptyState 
          icon={Megaphone}
          title="Ad Generation"
          description="Your AI team needs active campaigns to generate targeted ad copy. Launch your first campaign to unlock ad generation features."
          action={{
            label: "Launch Campaign",
            onClick: () => router.push('/dashboard/campaign-builder')
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Ad Generator" 
        description="Create highly converting ad copy tailored for specific platforms and audiences in seconds."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-5 h-fit sticky top-20">
          <AdGeneratorForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-7">
          <AdOutputCard 
            content={completion} 
            platform={platform}
            isStreaming={isLoading} 
          />
        </div>
      </div>
    </div>
  )
}
