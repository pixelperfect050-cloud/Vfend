import { z } from 'zod'

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

export type LoginValues = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(64, 'Name must be 64 characters or fewer'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /[A-Z]/,
        'Password must contain at least one uppercase letter',
      )
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupValues = z.infer<typeof signupSchema>

// ---------------------------------------------------------------------------
// AI Ad Generator
// ---------------------------------------------------------------------------

export const adTones = [
  'professional',
  'casual',
  'humorous',
  'urgent',
  'inspirational',
  'bold',
] as const

export const adPlatforms = [
  'google',
  'facebook',
  'instagram',
  'linkedin',
  'twitter',
  'tiktok',
] as const

export const adGoals = [
  'awareness',
  'traffic',
  'conversions',
  'leads',
  'sales',
  'engagement',
] as const

export const adGeneratorSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must be 100 characters or fewer'),
  product: z
    .string()
    .min(1, 'Product or service is required')
    .max(500, 'Product description must be 500 characters or fewer'),
  targetAudience: z
    .string()
    .min(1, 'Target audience is required')
    .max(300, 'Target audience must be 300 characters or fewer'),
  tone: z.enum(adTones, {
    message: 'Please select a tone',
  }),
  platform: z.enum(adPlatforms, {
    message: 'Please select a platform',
  }),
  goal: z.enum(adGoals, {
    message: 'Please select a campaign goal',
  }),
})

export type AdGeneratorValues = z.infer<typeof adGeneratorSchema>

// ---------------------------------------------------------------------------
// Blog Writer
// ---------------------------------------------------------------------------

export const blogTones = [
  'professional',
  'conversational',
  'academic',
  'storytelling',
  'persuasive',
] as const

export const blogLengths = ['short', 'medium', 'long'] as const

export const blogWriterSchema = z.object({
  keyword: z
    .string()
    .min(1, 'Keyword is required')
    .max(120, 'Keyword must be 120 characters or fewer'),
  tone: z.enum(blogTones, {
    message: 'Please select a tone',
  }),
  length: z.enum(blogLengths, {
    message: 'Please select a length',
  }),
  outline: z
    .string()
    .max(2000, 'Outline must be 2000 characters or fewer')
    .optional(),
})

export type BlogWriterValues = z.infer<typeof blogWriterSchema>

// ---------------------------------------------------------------------------
// SEO Analyzer
// ---------------------------------------------------------------------------

export const seoAnalyzerSchema = z.object({
  url: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'URL is required'),
})

export type SeoAnalyzerValues = z.infer<typeof seoAnalyzerSchema>

// ---------------------------------------------------------------------------
// Social Post
// ---------------------------------------------------------------------------

export const socialPlatforms = [
  'twitter',
  'linkedin',
  'facebook',
  'instagram',
  'threads',
  'tiktok',
] as const

export const socialPostSchema = z.object({
  platform: z.enum(socialPlatforms, {
    message: 'Please select a platform',
  }),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must be 5000 characters or fewer'),
  scheduledAt: z.coerce
    .date()
    .min(new Date(), 'Scheduled date must be in the future')
    .optional(),
})

export type SocialPostValues = z.infer<typeof socialPostSchema>
