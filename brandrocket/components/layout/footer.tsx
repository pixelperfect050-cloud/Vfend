import Link from 'next/link'
import { Rocket, MessageCircle, Briefcase, Code } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-brand" />
              <span className="font-bold text-xl tracking-tight">BrandRocket</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The AI-powered marketing platform built for modern teams and ambitious startups.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Briefcase className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Code className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">Integrations</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">Changelog</Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">About</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">Careers</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">Status</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BrandRocket Inc. All rights reserved.</p>
          <p>Built with ♥ for marketers</p>
        </div>
      </div>
    </footer>
  )
}
