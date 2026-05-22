'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Check, Rocket, Users, Sparkles, ArrowRight, Building2 } from 'lucide-react'

const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'),
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder')
)

const STEPS = [
  { id: 'welcome', title: 'Welcome', description: 'Get started with BrandRocket' },
  { id: 'workspace', title: 'Workspace', description: 'Create your first workspace' },
  { id: 'team', title: 'Team', description: 'Invite your team members' },
  { id: 'complete', title: 'Ready', description: 'Start creating content' },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    workspaceName: '',
    workspaceSlug: '',
    teamMembers: [] as string[],
  })
  const router = useRouter()

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleNext = async () => {
    if (currentStep === STEPS.length - 1) {
      router.push('/dashboard')
      return
    }
    setCurrentStep((prev) => prev + 1)
  }

  const handleCreateWorkspace = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create workspace
      const slug = formData.workspaceName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const { error } = await supabase
        .from('teams')
        .insert({
          name: formData.workspaceName,
          slug: `${slug}-${Date.now()}`,
          owner_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Mark onboarding step as complete
      await supabase.from('onboarding_steps').upsert({
        user_id: user.id,
        step: 'workspace_created',
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,step' })

      handleNext()
    } catch (error: unknown) {
      console.error('Workspace creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInviteTeam = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get the workspace
      const { data: workspace } = await supabase
        .from('teams')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (workspace) {
        // Add team members
        // Add team members (prepared for future API)
        formData.teamMembers
          .filter(email => email.trim())
          .map(email => ({
            team_id: workspace.id,
            email,
            role: 'member',
          }))

        // Note: In production, you'd send invitations
        // For now, just mark as complete
        
        await supabase.from('onboarding_steps').upsert({
          user_id: user.id,
          step: 'team_invited',
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,step' })
      }

      handleNext()
    } catch (error: unknown) {
      console.error('Team invite error:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center">
              <Rocket className="h-8 w-8 text-brand" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome to BrandRocket</h2>
              <p className="text-muted-foreground mt-2">
                Your AI-powered marketing platform. Let&apos;s get you set up in just a few steps.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <Sparkles className="h-6 w-6 mx-auto text-brand mb-2" />
                <p className="text-sm font-medium">AI Content</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <Users className="h-6 w-6 mx-auto text-brand mb-2" />
                <p className="text-sm font-medium">Team Collaboration</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <Building2 className="h-6 w-6 mx-auto text-brand mb-2" />
                <p className="text-sm font-medium">Workspaces</p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Create Your Workspace</h2>
              <p className="text-muted-foreground text-sm">
                This is where your team will collaborate
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspaceName">Workspace Name</Label>
              <Input
                id="workspaceName"
                placeholder="My Company"
                value={formData.workspaceName}
                onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Workspace URL</Label>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md text-muted-foreground text-sm">
                <span>brandrocket.app/</span>
                <span className="font-medium text-foreground">
                  {formData.workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'your-workspace'}
                </span>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Invite Your Team</h2>
              <p className="text-muted-foreground text-sm">
                Collaborate with your team from day one
              </p>
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Input
                  key={i}
                  type="email"
                  placeholder={`team member ${i + 1}@example.com`}
                  onChange={(e) => {
                    const newMembers = [...formData.teamMembers]
                    newMembers[i] = e.target.value
                    setFormData({ ...formData, teamMembers: newMembers })
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              You can always add more team members later
            </p>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">You&apos;re Ready!</h2>
              <p className="text-muted-foreground mt-2">
                Your workspace is set up. Time to create amazing content.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <Button className="bg-brand hover:bg-brand/90" asChild>
                <a href="/dashboard/ads">Create First Ad</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard/templates">Browse Templates</a>
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <Progress value={progress} className="h-1.5" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step, i) => (
              <span key={step.id} className={i <= currentStep ? 'text-brand' : ''}>
                {step.title}
              </span>
            ))}
          </div>
        </CardHeader>
        <CardContent className="py-8">
          {renderStep()}
        </CardContent>
        {currentStep < 3 && (
          <div className="px-6 pb-6 flex justify-end">
            <Button
              onClick={currentStep === 1 ? handleCreateWorkspace : currentStep === 2 ? handleInviteTeam : handleNext}
              disabled={loading || (currentStep === 1 && !formData.workspaceName)}
              className="bg-brand hover:bg-brand/90"
            >
              {loading ? 'Processing...' : currentStep === 3 ? 'Get Started' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}