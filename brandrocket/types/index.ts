// =============================================================================
// BrandRocket — Global Type Definitions
// =============================================================================

// ---------------------------------------------------------------------------
// User & Auth
// ---------------------------------------------------------------------------

export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role: 'owner' | 'admin' | 'member'
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  creditsUsed: number
  creditsLimit: number
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Teams & Workspaces
// ---------------------------------------------------------------------------

export interface Team {
  id: string
  name: string
  slug: string
  logoUrl?: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  user: Pick<User, 'id' | 'email' | 'fullName' | 'avatarUrl'>
  joinedAt: string
}

// ---------------------------------------------------------------------------
// Campaign State Machine
// ---------------------------------------------------------------------------

export type CampaignState =
  | 'Draft'
  | 'Planning'
  | 'Orchestrating'
  | 'Executing'
  | 'Monitoring'
  | 'Optimizing'
  | 'Completed'

export type AgentId =
  | 'orchestrator'
  | 'seo'
  | 'ads'
  | 'content'
  | 'social'
  | 'analytics'

export type CampaignEventType =
  | 'status_update'
  | 'agent_thinking'
  | 'action_started'
  | 'action_completed'
  | 'insight_discovered'
  | 'optimization_applied'

export interface CampaignEvent {
  id: string
  campaignId: string
  agentId: AgentId
  eventType: CampaignEventType
  message: string
  metadata: Record<string, unknown>
  createdAt: string
}

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export interface Campaign {
  id: string
  teamId: string
  name: string
  description?: string
  status: CampaignState
  goal?: string
  startDate?: string
  endDate?: string
  budget?: number
  platforms: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// AI Ad Generation
// ---------------------------------------------------------------------------

export interface AdGeneration {
  id: string
  teamId: string
  campaignId?: string
  businessName: string
  product: string
  targetAudience: string
  tone: string
  platform: string
  goal: string
  generatedHeadlines: string[]
  generatedDescriptions: string[]
  generatedCta: string[]
  model: string
  creditsUsed: number
  createdBy: string
  createdAt: string
}

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export interface BlogPost {
  id: string
  teamId: string
  title: string
  slug: string
  keyword: string
  content: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  tone: string
  wordCount: number
  readingTime: number
  status: 'draft' | 'published' | 'archived'
  seoScore?: number
  model: string
  creditsUsed: number
  createdBy: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// SEO Reports
// ---------------------------------------------------------------------------

export interface SeoIssue {
  type: 'error' | 'warning' | 'info'
  category: string
  message: string
  recommendation: string
}

export interface SeoReport {
  id: string
  teamId: string
  url: string
  overallScore: number
  performanceScore: number
  accessibilityScore: number
  seoScore: number
  bestPracticesScore: number
  issues: SeoIssue[]
  metaTitle?: string
  metaDescription?: string
  headingStructure: Record<string, number>
  loadTimeMs: number
  mobileReady: boolean
  createdBy: string
  createdAt: string
  imagesWithoutAlt?: number
  imagesCount?: number
  wordCount?: number
}

// ---------------------------------------------------------------------------
// Social Posts
// ---------------------------------------------------------------------------

export interface ScheduledPost {
  id: string
  teamId: string
  campaignId?: string
  platform: string
  content: string
  mediaUrls: string[]
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt?: string
  publishedAt?: string
  engagement?: {
    likes: number
    comments: number
    shares: number
    clicks: number
  }
  createdBy: string
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export interface Notification {
  id: string
  userId: string
  teamId?: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  actionUrl?: string
  read: boolean
  createdAt: string
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export interface Template {
  id: string
  name: string
  description: string
  category: 'ad' | 'blog' | 'social' | 'email' | 'seo'
  content: string
  variables: TemplateVariable[]
  thumbnail?: string
  isPremium: boolean
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface TemplateVariable {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number'
  placeholder?: string
  options?: string[]
  required: boolean
}

// ---------------------------------------------------------------------------
// Credit Usage & Billing
// ---------------------------------------------------------------------------

export interface CreditUsage {
  id: string
  teamId: string
  userId: string
  action: 'ad_generation' | 'blog_writing' | 'seo_analysis' | 'social_post' | 'ai_chat'
  creditsUsed: number
  model: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface Subscription {
  id: string
  teamId: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  createdAt: string
  updatedAt: string
}

// ---------------------------------------------------------------------------
// API Response Helpers
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T
  error: null
}

export interface ApiError {
  data: null
  error: {
    message: string
    code?: string
    status: number
  }
}

export type ApiResult<T> = ApiResponse<T> | ApiError

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

// ---------------------------------------------------------------------------
// Dashboard Analytics
// ---------------------------------------------------------------------------

export interface DashboardStats {
  totalGenerations: number
  creditsUsed: number
  creditsRemaining: number
  activeCampaigns: number
  scheduledPosts: number
  avgSeoScore: number
  generationsByDay: Array<{ date: string; count: number }>
  creditsByAction: Array<{ action: string; credits: number }>
  topPlatforms: Array<{ platform: string; count: number }>
}
