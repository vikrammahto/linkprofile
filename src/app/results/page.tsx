"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
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
    const stored = sessionStorage.getItem("profileiq_result")
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
    if (score >= 70) return "bg-green-500/10 text-green-600 border-green-500/20"
    if (score >= 50) return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    return "bg-red-500/10 text-red-600 border-red-500/20"
  }

  if (isLoading || (!result && !error)) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No results found.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              We couldn&apos;t find any analysis results. Please try analyzing a profile first.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const profileScore = result?.analysis?.profileScore ?? 0

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to home</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Results</h1>
        </div>
        {result?.analysis && (
          <Badge
            variant="outline"
            className={getScoreColor(profileScore)}
          >
            Score: {profileScore}/100
          </Badge>
        )}
      </div>

      {/* Results tabs */}
      <ResultsTabs data={result!} />
    </div>
  )
}
