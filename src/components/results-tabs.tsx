"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ProfileAnalysisTab } from "@/components/profile-analysis-tab"
import { BannerConceptTab } from "@/components/banner-concept-tab"
import { JobMatchesTab } from "@/components/job-matches-tab"
import type { AnalysisResult } from "@/types/analysis"

export const ResultsTabs = ({ data }: { data: AnalysisResult }) => {
  return (
    <Tabs defaultValue="analysis" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="analysis">Profile analysis</TabsTrigger>
        <TabsTrigger value="banner">Banner concept</TabsTrigger>
        <TabsTrigger value="jobs">Job matches</TabsTrigger>
      </TabsList>

      <TabsContent value="analysis" className="mt-6">
        {data.analysis ? (
          <ProfileAnalysisTab data={data.analysis} />
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Profile analysis unavailable.
              </p>
              {data.errors?.analysis && (
                <p className="mt-2 text-sm text-red-500">
                  Error: {data.errors.analysis}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="banner" className="mt-6">
        {data.banner ? (
          <BannerConceptTab data={data.banner} />
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Banner concept unavailable.
              </p>
              {data.errors?.banner && (
                <p className="mt-2 text-sm text-red-500">
                  Error: {data.errors.banner}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="jobs" className="mt-6">
        {data.jobs ? (
          <JobMatchesTab data={data.jobs} />
        ) : (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Job matches unavailable.
              </p>
              {data.errors?.jobs && (
                <p className="mt-2 text-sm text-red-500">
                  Error: {data.errors.jobs}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
