"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResultsTabs } from "@/components/results-tabs"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import type { AnalysisResult } from "@/types/analysis"

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem("linkprofile_result")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnalysisResult
        setResult(parsed)
      } catch {
        setError(true)
      }
    } else {
      setError(true)
    }
    setIsLoading(false)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-success/10 text-success border-success/20"
    if (score >= 50) return "bg-warning/10 text-warning border-warning/20"
    return "bg-destructive/10 text-destructive border-destructive/20"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 50) return "Average"
    return "Needs Work"
  }

  if (isLoading || (!result && !error)) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative">
        <div className="hero-glow" />
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6 py-24">
          <Card className="w-full max-w-md border-border/50 bg-card/50 text-center backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">No results found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                We couldn&apos;t find any analysis results. Please try analyzing a profile first.
              </p>
              <Link href="/">
                <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600">
                  <ArrowLeft className="h-4 w-4" />
                  Back to home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const profileScore = result?.analysis?.profileScore ?? 0

  return (
    <div className="relative">
      <div className="hero-glow" />
      <div className="grid-bg absolute inset-0" />
      
      <div className="relative mx-auto w-full max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-border/50 bg-secondary/30">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to home</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analysis Results</h1>
              <p className="text-sm text-muted-foreground">Your personalized profile insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/50 bg-secondary/30">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/50 bg-secondary/30">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Score Card */}
        {result?.analysis && (
          <div className="glow mb-8 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-6">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-secondary"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(profileScore / 100) * 283} 283`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{profileScore}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Profile Score</h2>
                    <Badge variant="outline" className={getScoreColor(profileScore)}>
                      {getScoreLabel(profileScore)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Based on completeness, engagement potential, and industry best practices
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-success">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Top 25% of profiles</span>
              </div>
            </div>
          </div>
        )}

        {/* Results tabs */}
        <ResultsTabs data={result!} />
      </div>
    </div>
  )
}
