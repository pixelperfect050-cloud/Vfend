'use client'

import * as React from 'react'
import Link from 'next/link'
import { Rocket, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b backdrop-blur-md bg-background/80 transition-all duration-200',
        isScrolled ? 'py-2' : 'py-4'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-brand text-brand-foreground p-1.5 rounded-lg group-hover:bg-brand/90 transition-colors">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">BrandRocket</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={pathname === '/' ? item.href : `/${item.href}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" aria-label="Log in">
              <Button variant="ghost" className="font-medium">
                Log in
              </Button>
            </Link>
            <Link href="/signup" aria-label="Get Started">
              <Button className="bg-brand text-brand-foreground hover:bg-brand/90 font-medium">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger aria-label="Toggle mobile menu" className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium hover:bg-muted hover:text-foreground transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-6">
                  <Link href="/" className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-brand" />
                    <span className="font-bold text-xl">BrandRocket</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={pathname === '/' ? item.href : `/${item.href}`}
                        className="text-lg font-medium text-muted-foreground hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-3 mt-4">
                    <Link href="/login" aria-label="Log in">
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" aria-label="Get Started Free">
                      <Button className="w-full bg-brand text-brand-foreground hover:bg-brand/90">
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
