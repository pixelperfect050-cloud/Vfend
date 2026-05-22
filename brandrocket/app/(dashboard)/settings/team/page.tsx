'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Copy, Plus, MoreHorizontal } from 'lucide-react'

const MOCK_MEMBERS = [
  { id: '1', name: 'You', email: 'you@example.com', role: 'Owner', initial: 'Y' },
  { id: '2', name: 'Sarah Adams', email: 'sarah@example.com', role: 'Admin', initial: 'SA' },
  { id: '3', name: 'Mike Chen', email: 'mike@example.com', role: 'Member', initial: 'MC' },
]

export default function TeamSettingsPage() {
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
            <Input id="workspaceName" defaultValue="Acme Corp" />
          </div>
          <div className="space-y-2 max-w-md">
            <Label htmlFor="workspaceId">Workspace ID</Label>
            <div className="flex gap-2">
              <Input id="workspaceId" defaultValue="ws_01H49V8Z8..." readOnly className="bg-muted text-muted-foreground" />
              <Button variant="outline" size="icon" className="shrink-0">
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
          <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="h-4 w-4 mr-2" /> Invite Member
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y border-t">
            {MOCK_MEMBERS.map((member) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
