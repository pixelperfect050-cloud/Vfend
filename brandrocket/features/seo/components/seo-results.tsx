'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertTriangle, XCircle, Globe, Image as ImageIcon, Type, FileCode } from 'lucide-react'
import type { SeoReport, SeoIssue } from '@/types'
import { cn } from '@/lib/utils'

interface SeoResultsProps {
  report: SeoReport | null
  isLoading: boolean
}

export function SeoResults({ report, isLoading }: SeoResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-32 p-6 bg-muted/20" />
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="h-64 p-6 bg-muted/20" />
        </Card>
      </div>
    )
  }

  if (!report) {
    return (
      <Card className="border-dashed bg-muted/10 border-2 shadow-none">
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <Globe className="h-10 w-10 text-muted-foreground/50 mb-4" />
          <h3 className="font-semibold text-lg text-foreground mb-1">No analysis run yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Enter a URL above to scan your website for SEO issues, performance bottlenecks, and accessibility improvements.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { 
    overallScore, 
    seoScore, 
    accessibilityScore, 
    bestPracticesScore,
    issues,
    metaTitle,
    metaDescription,
    imagesWithoutAlt,
    imagesCount,
    wordCount
  } = report

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success'
    if (score >= 70) return 'text-warning'
    return 'text-destructive'
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-success'
    if (score >= 70) return 'bg-warning'
    return 'bg-destructive'
  }

  const getIssueIcon = (type: SeoIssue['type']) => {
    switch (type) {
      case 'error': return <XCircle className="h-5 w-5 text-destructive shrink-0" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
      case 'info': return <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 border-border shadow-sm flex flex-col items-center justify-center p-6 text-center">
          <CardTitle className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">Overall Score</CardTitle>
          <div className="relative h-32 w-32 flex items-center justify-center">
            <svg className="h-full w-full absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted opacity-20" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" 
                stroke="currentColor" 
                className={cn("transition-all duration-1000 ease-out", getScoreColor(overallScore))}
                strokeWidth="8" 
                strokeDasharray={`${(overallScore / 100) * 283} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-4xl font-bold">{overallScore}</div>
          </div>
        </Card>

        <Card className="md:col-span-3 border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>SEO Performance</span>
                <span className={getScoreColor(seoScore)}>{seoScore}/100</span>
              </div>
              <Progress value={seoScore} className="h-2" indicatorClassName={getScoreBg(seoScore)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Accessibility</span>
                <span className={getScoreColor(accessibilityScore)}>{accessibilityScore}/100</span>
              </div>
              <Progress value={accessibilityScore} className="h-2" indicatorClassName={getScoreBg(accessibilityScore)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Best Practices</span>
                <span className={getScoreColor(bestPracticesScore)}>{bestPracticesScore}/100</span>
              </div>
              <Progress value={bestPracticesScore} className="h-2" indicatorClassName={getScoreBg(bestPracticesScore)} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extracted Metrics */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Page Statistics</CardTitle>
          <CardDescription>Raw data extracted from {report.url}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Type className="h-3 w-3" /> Title Length</p>
              <p className="font-semibold text-lg">{metaTitle?.length || 0} chars</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><FileCode className="h-3 w-3" /> Meta Desc</p>
              <p className="font-semibold text-lg">{metaDescription?.length || 0} chars</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Missing Alts</p>
              <p className="font-semibold text-lg">{imagesWithoutAlt || 0} / {imagesCount || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Type className="h-3 w-3" /> Word Count</p>
              <p className="font-semibold text-lg">~{wordCount || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues List */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Identified Issues</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {issues.map((issue: SeoIssue, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 hover:bg-muted/30 transition-colors">
                  {getIssueIcon(issue.type)}
                  <div>
                    <h4 className="text-sm font-semibold capitalize">{issue.category}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">{issue.message}</p>
                  </div>
                </div>
              ))}
              {issues.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No issues found! Great job.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Actionable steps to improve your ranking</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {issues.filter((issue: SeoIssue) => issue.recommendation).map((issue: SeoIssue, idx: number) => (
                <li key={idx} className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{issue.recommendation}</p>
                </li>
              ))}
              {issues.filter((issue: SeoIssue) => issue.recommendation).length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-4">
                  No specific recommendations right now.
                </div>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
