'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useCreditStore } from '@/stores/credit-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, CreditCard, ExternalLink, Zap, Check, X } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    price: 0,
    period: 'forever',
    credits: 100,
    features: ['5 AI generations/day', 'Basic templates', 'Email support', '1 workspace'],
    notIncluded: ['Advanced templates', 'Priority support', 'API access'],
  },
  {
    name: 'Pro',
    price: 29,
    period: 'month',
    credits: 500,
    popular: true,
    features: ['Unlimited AI generations', 'All templates', 'Priority email support', '5 workspaces', 'Advanced analytics', 'Export functionality'],
    notIncluded: ['API access', 'Dedicated support'],
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    credits: -1,
    features: ['Everything in Pro', 'Unlimited workspaces', 'API access', 'Dedicated support', 'Custom branding', 'SLA guarantee', 'SSO'],
    notIncluded: [],
  },
]

export default function BillingSettingsPage() {
  const { creditsUsed, creditsTotal, plan, isNearLimit, isExhausted } = useCreditStore()
  const [showPlans, setShowPlans] = React.useState(false)
  
  const percentageUsed = Math.min((creditsUsed / creditsTotal) * 100, 100)
  const isDanger = isNearLimit() || isExhausted()

  const handleCustomerPortal = () => {
    // In production, this would call an API route to generate a Stripe Customer Portal session URL
    alert("Redirecting to Stripe Customer Portal...")
  }

  return (
    <div className="space-y-6">
      
      {/* Current Plan Overview */}
      <Card className="border-border shadow-sm overflow-hidden relative">
        {/* Subtle gradient background based on plan */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-brand/40" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {plan} Plan
                <Badge variant="secondary" className="bg-brand/10 text-brand font-medium">Active</Badge>
              </CardTitle>
              <CardDescription className="mt-2 text-sm max-w-md">
                You are currently on the Pro plan, billed $29/month. Your next billing date is June 24, 2026.
              </CardDescription>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-3xl font-bold tracking-tight">$29<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-foreground text-background hover:bg-foreground/90 transition-colors" onClick={handleCustomerPortal}>
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Billing
            </Button>
            <Button variant="outline" className="border-border hover:bg-muted/50 transition-colors" onClick={() => setShowPlans(true)}>
              Compare Plans
            </Button>

            <Dialog open={showPlans} onOpenChange={setShowPlans}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">Compare Plans</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {PLANS.map((p) => (
                    <div key={p.name} className={cn("relative rounded-xl border p-5 flex flex-col", p.popular ? "border-brand bg-brand/5" : "border-border")}>
                      {p.popular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white">Most Popular</Badge>
                      )}
                      <div className="mb-4">
                        <h3 className="font-bold text-lg">{p.name}</h3>
                        <div className="mt-2">
                          {p.price === 0 ? (
                            <span className="text-3xl font-bold">Free</span>
                          ) : (
                            <>
                              <span className="text-3xl font-bold">${p.price}</span>
                              <span className="text-muted-foreground text-sm">/{p.period}</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {p.credits === -1 ? 'Unlimited credits' : `${p.credits} AI credits/mo`}
                        </p>
                      </div>
                      <div className="space-y-2 mb-6 flex-1">
                        {p.features.map((f) => (
                          <div key={f} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                        {p.notIncluded.map((f) => (
                          <div key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <X className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      <Button className={p.popular ? "bg-brand hover:bg-brand/90" : "bg-muted-foreground"}>
                        {plan === p.name ? 'Current Plan' : p.price === 0 ? 'Downgrade' : 'Upgrade'}
                      </Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* AI Usage Limits */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>AI Credits Usage</CardTitle>
          <CardDescription>Track your monthly AI generation credits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Monthly Allocation</span>
              <span className={isDanger ? 'text-destructive' : 'text-muted-foreground'}>
                {creditsUsed} / {creditsTotal} Credits
              </span>
            </div>
            <Progress 
              value={percentageUsed} 
              className="h-2.5" 
              indicatorClassName={isExhausted() ? 'bg-destructive' : isNearLimit() ? 'bg-warning' : 'bg-brand'}
            />
          </div>

          {isExhausted() ? (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Credit limit reached</p>
                <p className="text-xs text-destructive/80 mt-1 leading-snug">
                  You have exhausted your monthly AI credits. Please upgrade your plan or purchase an add-on to continue generating content.
                </p>
                <Button size="sm" variant="outline" className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10">
                  Upgrade Plan
                </Button>
              </div>
            </div>
          ) : isNearLimit() ? (
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 flex gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">Running low on credits</p>
                <p className="text-xs text-warning/80 mt-1 leading-snug">
                  You are approaching your monthly limit. Consider upgrading if you anticipate higher usage.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted/30 border border-border flex gap-3">
              <Zap className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">You're in good shape</p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  You have plenty of credits remaining for the month. Your credits will reset automatically on June 24, 2026.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  )
}
