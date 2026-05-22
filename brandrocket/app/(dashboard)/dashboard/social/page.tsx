'use client'

import * as React from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { SocialScheduler } from '@/features/social/components/social-scheduler'

import { Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDemoMode } from '@/hooks/use-demo-mode'
import { EmptyState } from '@/components/shared/empty-state'

export default function SocialPage() {
  const { isDemoMode, isLoaded } = useDemoMode()
  const router = useRouter()

  if (!isLoaded) return null

  if (!isDemoMode) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Social Media Scheduler" 
          description="Plan, create, and schedule your social media content across all platforms."
        />
        <EmptyState 
          icon={Share2}
          title="Social Media Automation"
          description="Your AI team needs active campaigns to generate and schedule social media posts. Launch your first campaign to unlock social automation."
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
        title="Social Media Scheduler" 
        description="Plan, create, and schedule your social media content across all platforms."
      />
      <SocialScheduler />
    </div>
  )
}
