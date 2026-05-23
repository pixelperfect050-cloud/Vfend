'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Copy, Plus, MoreHorizontal } from 'lucide-react'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { trackEvent } from '@/lib/analytics'

export default function TeamSettingsPage() {
  const { currentWorkspace } = useWorkspaceStore()
  
  const [members, setMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    if (!currentWorkspace?.id) return

    async function fetchMembers() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/team?team_id=${currentWorkspace?.id}`)
        if (res.ok) {
          const data = await res.json()
          setMembers(data.members || [])
        }
      } catch (err) {
        console.error('Failed to load team members:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [currentWorkspace?.id])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentWorkspace?.id || !inviteEmail) return
    
    setIsInviting(true)
    try {
      const res = await fetch(`/api/team?team_id=${currentWorkspace?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail })
      })
      const result = await res.json()
      if (res.ok) {
        trackEvent('Team Invite Sent', 'Team')
        alert(result.message)
        setIsInviteOpen(false)
        setInviteEmail('')
      } else {
        alert(result.error || 'Failed to send invite')
      }
    } catch (err) {
      console.error(err)
      alert("Error sending invite")
    } finally {
      setIsInviting(false)
    }
  }

  if (!currentWorkspace) return null

  return (
    <div className="space-y-6">
      
      {/* Workspace General Info */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
          <CardDescription>Manage the details of your current workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="workspaceName">Workspace Name</Label>
            <Input id="workspaceName" defaultValue={currentWorkspace.name} />
          </div>
          <div className="space-y-2 max-w-md">
            <Label htmlFor="workspaceId">Workspace ID</Label>
            <div className="flex gap-2">
              <Input id="workspaceId" value={currentWorkspace.id} readOnly className="bg-muted text-muted-foreground" />
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => navigator.clipboard.writeText(currentWorkspace.id)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 border-t p-4 flex justify-end">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      {/* Team Members */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription className="mt-1">Manage who has access to this workspace.</CardDescription>
          </div>
          <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90" onClick={() => setIsInviteOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Invite Member
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y border-t">
            {isLoading ? (
              <div className="p-6 text-center text-muted-foreground">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No members found</div>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-brand/10 text-brand font-medium">
                        {member.initial}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">
                        {member.name}
                        {member.role === 'Owner' && <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-muted">Owner</Badge>}
                      </p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-sm text-muted-foreground mr-4">
                      {member.role}
                    </div>
                    {member.role !== 'Owner' && (
                      <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an email invitation to join your workspace.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="colleague@example.com" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isInviting || !inviteEmail}>
                {isInviting ? 'Sending...' : 'Send Invite'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
    </div>
  )
}
