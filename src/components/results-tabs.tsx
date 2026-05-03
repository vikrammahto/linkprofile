"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
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
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Profile analysis content will be displayed here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="banner" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Banner concept content will be displayed here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="jobs" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Job matches content will be displayed here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
