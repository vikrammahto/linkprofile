"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Share2, Download, Sparkles } from "lucide-react"
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
    if (score >= 70) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 50) return "Average"
    return "Needs Work"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 70) return "from-emerald-500 to-teal-500"
    if (score >= 50) return "from-amber-500 to-orange-500"
    return "from-red-500 to-rose-500"
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
        <div className="dot-pattern absolute inset-0 opacity-40" />
        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6 py-24">
          <Card className="w-full max-w-md border-border/60 bg-card text-center soft-shadow">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">No results found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                We couldn&apos;t find any analysis results. Please try analyzing a profile first.
              </p>
              <Link href="/">
                <Button className="gradient-btn gap-2 border-0 text-white">
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
    <div className="relative min-h-screen">
      <div className="dot-pattern absolute inset-0 opacity-40" />
      
      <div className="relative mx-auto w-full max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/60 bg-card">
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
            <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/60 bg-card">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/60 bg-card">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Score Card */}
        {result?.analysis && (
          <div className="glass-card soft-shadow-lg mb-8 rounded-2xl p-6">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-6">
                <div className="relative flex h-28 w-28 items-center justify-center">
                  <svg className="h-28 w-28 -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-muted"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={`url(#scoreGradient)`}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(profileScore / 100) * 264} 264`}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5b5bd6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{profileScore}</span>
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
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Based on completeness, engagement potential, and industry best practices
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                <TrendingUp className="h-4 w-4" />
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
