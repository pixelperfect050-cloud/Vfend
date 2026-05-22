export const APP_NAME = 'BrandRocket'
export const APP_DESCRIPTION =
  'Your autonomous AI growth team — describe your goal and watch campaigns launch themselves.'
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const PLANS = {
  FREE: {
    name: 'Starter',
    price: 0,
    credits: 50,
    features: [
      '5 AI generations/mo',
      '1 team member',
      'Basic SEO analysis',
      'Email support',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 29,
    credits: 500,
    features: [
      'Unlimited AI generations',
      '5 team members',
      'Advanced SEO scanner',
      'Priority support',
      'Custom templates',
      'API access',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 99,
    credits: -1,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Custom AI models',
      'Dedicated support',
      'SSO & SAML',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
} as const

export type PlanKey = keyof typeof PLANS
export type Plan = (typeof PLANS)[PlanKey]

export const AI_MODELS = {
  DEFAULT: 'google/gemini-2.5-flash',
  ALTERNATIVES: [
    'anthropic/claude-sonnet-4',
    'openai/gpt-4o',
  ] as const,
} as const

export const NAV_ITEMS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Your AI Team', href: '#ai-team' },
  { label: 'Early Access', href: '#waitlist' },
] as const

export const DASHBOARD_NAV = [
  { label: 'Home', href: '/dashboard', icon: 'Home' },
  { label: 'New Campaign', href: '/dashboard/campaign-builder', icon: 'Plus' },
  { label: 'Intelligence', href: '/dashboard/intelligence', icon: 'Brain' },
  { label: 'Content', href: '/dashboard/content', icon: 'FileText' },
  { label: 'Ads', href: '/dashboard/ads', icon: 'Megaphone' },
  { label: 'Social', href: '/dashboard/social', icon: 'Share2' },
  { label: 'Templates', href: '/dashboard/templates', icon: 'LayoutTemplate' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]
export type DashboardNavItem = (typeof DASHBOARD_NAV)[number]
