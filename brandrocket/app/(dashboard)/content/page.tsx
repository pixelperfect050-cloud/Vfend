'use client'

import { PageHeader } from '@/components/shared/page-header'
import { BlogWriter } from '@/features/blog/components/blog-writer'

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Blog Writer" 
        description="Generate long-form, SEO-optimized blog posts based on your keywords and outline."
      />
      <BlogWriter />
    </div>
  )
}
