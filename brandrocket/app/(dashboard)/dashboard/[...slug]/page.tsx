import { Bot, Construction, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ComingSoonPage({ params }: { params: { slug: string[] } }) {
  const featureName = params.slug[0].charAt(0).toUpperCase() + params.slug[0].slice(1)

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-6 ring-8 ring-brand/5">
        <Construction className="w-8 h-8" />
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        {featureName} is Coming Soon
      </h1>
      
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        We're actively training our AI agents for the <strong className="text-foreground font-medium">{featureName}</strong> module. This feature will be available in an upcoming release.
      </p>

      <div className="bg-card border rounded-xl p-6 text-left w-full max-w-md shadow-sm mb-8">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-brand/10 rounded-lg shrink-0 mt-0.5">
            <Bot className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Want early access?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Active users who launch campaigns in the Command Center will get priority access when this module unlocks.
            </p>
          </div>
        </div>
      </div>

      <Link href="/dashboard">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Return to Command Center
        </Button>
      </Link>
    </div>
  )
}
