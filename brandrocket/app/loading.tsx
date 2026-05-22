import { Rocket } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="relative flex items-center justify-center">
        <div className="absolute animate-ping opacity-20 rounded-full h-16 w-16 bg-brand"></div>
        <div className="bg-brand text-brand-foreground p-3 rounded-xl shadow-lg relative z-10 animate-pulse">
          <Rocket className="h-8 w-8" />
        </div>
      </div>
      <p className="mt-6 text-muted-foreground animate-pulse text-sm font-medium">Loading BrandRocket...</p>
    </div>
  )
}
