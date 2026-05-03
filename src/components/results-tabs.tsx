"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileAnalysisTab } from "@/components/profile-analysis-tab"
import { BannerConceptTab } from "@/components/banner-concept-tab"
import { JobMatchesTab } from "@/components/job-matches-tab"
import { Target, Palette, Briefcase, AlertCircle } from "lucide-react"
import type { AnalysisResult } from "@/types/analysis"

export const ResultsTabs = ({ data }: { data: AnalysisResult }) => {
  return (
    <Tabs defaultValue="analysis" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="analysis" className="gap-2">
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="banner" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Banner</span>
        </TabsTrigger>
        <TabsTrigger value="jobs" className="gap-2">
          <Briefcase className="h-4 w-4" />
          <span className="hidden sm:inline">Jobs</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analysis">
        {data.analysis ? (
          <ProfileAnalysisTab data={data.analysis} />
        ) : (
          <Card className="border-destructive/20">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium">Profile analysis unavailable</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.errors?.analysis || "Unable to analyze profile at this time. Please try again."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="banner">
        {data.banner ? (
          <BannerConceptTab data={data.banner} />
        ) : (
          <Card className="border-destructive/20">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium">Banner concept unavailable</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.errors?.banner || "Unable to generate banner concept at this time. Please try again."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="jobs">
        {data.jobs ? (
          <JobMatchesTab data={data.jobs} />
        ) : (
          <Card className="border-destructive/20">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium">Job matches unavailable</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.errors?.jobs || "Unable to find job matches at this time. Please try again."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
