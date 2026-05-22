'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Search } from 'lucide-react'
import type { z } from 'zod'

import { seoAnalyzerSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

type SeoFormValues = z.infer<typeof seoAnalyzerSchema>

interface SeoScannerFormProps {
  onSubmit: (data: SeoFormValues) => void
  isLoading: boolean
}

export function SeoScannerForm({ onSubmit, isLoading }: SeoScannerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SeoFormValues>({
    resolver: zodResolver(seoAnalyzerSchema),
    defaultValues: {
      url: ''
    }
  })

  return (
    <Card className="border-border shadow-sm mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="url"
                placeholder="https://example.com"
                className="pl-10"
                {...register('url')}
                disabled={isLoading}
              />
            </div>
            {errors.url && (
              <p className="text-sm text-destructive pl-1">{errors.url.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="sm:w-32 bg-brand text-brand-foreground hover:bg-brand/90" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Scan Website'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
