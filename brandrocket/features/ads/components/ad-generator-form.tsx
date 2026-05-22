'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Sparkles } from 'lucide-react'
import type { z } from 'zod'

import { adGeneratorSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

type AdGeneratorFormValues = z.infer<typeof adGeneratorSchema>

interface AdGeneratorFormProps {
  onSubmit: (data: AdGeneratorFormValues) => void
  isLoading: boolean
}

export function AdGeneratorForm({ onSubmit, isLoading }: AdGeneratorFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdGeneratorFormValues>({
    resolver: zodResolver(adGeneratorSchema),
    defaultValues: {
      tone: 'professional',
      platform: 'facebook',
      goal: 'conversions',
    }
  })

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="e.g. BrandRocket"
                {...register('businessName')}
                disabled={isLoading}
              />
              {errors.businessName && (
                <p className="text-sm text-destructive">{errors.businessName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product or Service</Label>
              <Textarea
                id="product"
                placeholder="Describe what you are selling in a few sentences..."
                className="resize-none h-24"
                {...register('product')}
                disabled={isLoading}
              />
              {errors.product && (
                <p className="text-sm text-destructive">{errors.product.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                placeholder="e.g. Small business owners, tech founders"
                {...register('targetAudience')}
                disabled={isLoading}
              />
              {errors.targetAudience && (
                <p className="text-sm text-destructive">{errors.targetAudience.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Controller
                  name="platform"
                  control={control}
                  render={({ field }) => (
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">X / Twitter</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <Controller
                  name="tone"
                  control={control}
                  render={({ field }) => (
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Goal</Label>
                <Controller
                  name="goal"
                  control={control}
                  render={({ field }) => (
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                        <SelectItem value="traffic">Traffic</SelectItem>
                        <SelectItem value="conversions">Sales / Conversion</SelectItem>
                        <SelectItem value="leads">Lead Generation</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

          </div>

          <Button 
            type="submit" 
            className="w-full bg-brand text-brand-foreground hover:bg-brand/90" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Ad Copy
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
