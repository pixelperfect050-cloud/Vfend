'use client'

import { PageHeader } from '@/components/shared/page-header'
import { ChatInterface } from '@/features/assistant/components/chat-interface'

export default function AssistantPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <PageHeader 
        title="AI Assistant" 
        description="Your dedicated marketing strategist. Ask for ideas, copy, or growth advice."
        className="mb-0"
      />
      <div className="flex-1 mt-6">
        <ChatInterface />
      </div>
    </div>
  )
}
