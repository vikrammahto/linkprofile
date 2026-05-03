"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

const loadingSteps = [
  "Parsing profile data...",
  "Analyzing skills and experience...",
  "Generating banner concepts...",
  "Finding job matches...",
  "Finalizing insights...",
]

export const LoadingSkeleton = () => {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const duration = 15000 // 15 seconds
    const interval = 100 // Update every 100ms
    const increment = (90 / duration) * interval // Target 90%

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer)
          return 90
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length)
    }, 3000)

    return () => clearInterval(stepInterval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600">
          <Sparkles className="h-8 w-8 animate-pulse text-white" />
        </div>
        <h2 className="text-xl font-semibold">Analyzing your profile</h2>
        <p className="mt-2 text-muted-foreground">{loadingSteps[currentStep]}</p>
      </div>

      {/* Progress bar */}
      <div className="space-y-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Processing</span>
          <span className="font-medium text-primary">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Skeleton cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {["Profile Analysis", "Banner Concept", "Job Matches"].map((title, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-primary/10" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
