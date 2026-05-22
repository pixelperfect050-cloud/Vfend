import { Rocket } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Pane - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center lg:justify-start mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-brand text-brand-foreground p-1.5 rounded-lg">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">BrandRocket</span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right Pane - Branding (hidden on mobile) */}
      <div className="hidden lg:block relative w-0 flex-1 bg-muted/30">
        <div className="absolute inset-0 h-full w-full object-cover p-12 flex flex-col justify-between">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Supercharge your marketing.</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of marketers using AI to generate high-performing ads, blogs, and SEO campaigns in seconds.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-6 shadow-sm max-w-sm">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <span className="text-brand font-bold">SA</span>
              </div>
              <div>
                <p className="text-sm italic text-muted-foreground mb-2">
                  "BrandRocket has completely transformed how our agency handles content. We're delivering 10x the value in half the time."
                </p>
                <p className="text-sm font-semibold">— Sarah Adams, Growth Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
