'use client'

import * as React from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Link2, CheckCircle2, XCircle, ExternalLink, RefreshCw, 
  Settings, Trash2, Globe
} from 'lucide-react'

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const ChromeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
)

interface Integration {
  id: string
  provider: string
  isActive: boolean
  accountName?: string
  lastSynced?: string
}

const AVAILABLE_INTEGRATIONS = [
  {
    id: 'meta',
    name: 'Meta Ads',
    description: 'Connect Facebook & Instagram ads for automated optimization',
    icon: FacebookIcon,
    color: 'bg-blue-600',
    features: ['Ad performance sync', 'Auto-optimization', 'Audience insights'],
    status: 'not_connected',
  },
  {
    id: 'google',
    name: 'Google Ads',
    description: 'Connect Google Ads for cross-platform campaign management',
    icon: ChromeIcon,
    color: 'bg-green-500',
    features: ['Search campaigns', 'Performance tracking', 'Budget optimization'],
    status: 'not_connected',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Ads',
    description: 'Connect LinkedIn for B2B advertising and lead generation',
    icon: LinkedinIcon,
    color: 'bg-blue-700',
    features: ['Sponsored content', 'Lead gen forms', 'Account targeting'],
    status: 'not_connected',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    description: 'Connect Twitter for organic and paid campaign management',
    icon: TwitterIcon,
    color: 'bg-black',
    features: ['Tweet scheduling', 'Analytics', 'Audience engagement'],
    status: 'not_connected',
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    description: 'Connect GA4 for comprehensive website analytics',
    icon: ChromeIcon,
    color: 'bg-orange-500',
    features: ['Traffic analysis', 'Conversion tracking', 'Audience insights'],
    status: 'connected',
  },
  {
    id: 'cms',
    name: 'Content Management',
    description: 'Connect WordPress, Webflow, or other CMS platforms',
    icon: Link2,
    color: 'bg-purple-500',
    features: ['Auto-publishing', 'Content sync', 'SEO optimization'],
    status: 'not_connected',
  },
]

export default function IntegrationsPage() {
  const [connectedIntegrations, setConnectedIntegrations] = React.useState<Integration[]>([
    { id: '1', provider: 'analytics', isActive: true, accountName: 'BrandRocket GA4', lastSynced: '5m ago' },
  ])

  const getIntegrationStatus = (providerId: string) => {
    const connected = connectedIntegrations.find(i => i.provider === providerId)
    if (!connected) return 'not_connected'
    return connected.isActive ? 'connected' : 'disconnected'
  }

  const handleConnect = (providerId: string) => {
    // In production, this would redirect to OAuth flow
    // For demo, simulate connection
    const newIntegration: Integration = {
      id: Date.now().toString(),
      provider: providerId,
      isActive: true,
      accountName: `${providerId.charAt(0).toUpperCase() + providerId.slice(1)} Account`,
      lastSynced: 'Just now',
    }
    setConnectedIntegrations([...connectedIntegrations, newIntegration])
  }

  const handleDisconnect = (providerId: string) => {
    setConnectedIntegrations(connectedIntegrations.filter(i => i.provider !== providerId))
  }

  const handleToggle = (providerId: string) => {
    setConnectedIntegrations(connectedIntegrations.map(i => 
      i.provider === providerId ? { ...i, isActive: !i.isActive } : i
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Integrations" 
          description="Connect your advertising platforms and tools for unified management."
        />
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync All
        </Button>
      </div>

      {/* Connected Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{connectedIntegrations.filter(i => i.isActive).length}</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-brand/10 rounded-lg">
              <Link2 className="h-6 w-6 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold">{AVAILABLE_INTEGRATIONS.length}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <ExternalLink className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Pending Setup</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <RefreshCw className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">15m</p>
              <p className="text-xs text-muted-foreground">Auto-sync</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_INTEGRATIONS.map((integration) => {
          const status = getIntegrationStatus(integration.id)
          const Icon = integration.icon
          const connected = connectedIntegrations.find(i => i.provider === integration.id)

          return (
            <Card key={integration.id} className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <p className="text-xs text-muted-foreground capitalize">{status.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {status !== 'not_connected' && (
                    <Badge variant={connected?.isActive ? 'default' : 'secondary'} className={connected?.isActive ? 'bg-success text-white' : ''}>
                      {connected?.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2">{integration.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                {status === 'not_connected' ? (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleConnect(integration.id)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Account</span>
                      <span className="font-medium">{connected?.accountName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last synced</span>
                      <span className="text-muted-foreground">{connected?.lastSynced}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={connected?.isActive || false}
                          onCheckedChange={() => handleToggle(integration.id)}
                        />
                        <span className="text-sm">Auto-sync</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}