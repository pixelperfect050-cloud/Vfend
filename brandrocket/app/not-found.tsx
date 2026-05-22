import Link from 'next/link'
import { Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="bg-muted p-4 rounded-full mb-6">
        <Rocket className="h-10 w-10 text-brand" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">404 - Page not found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  )
}
