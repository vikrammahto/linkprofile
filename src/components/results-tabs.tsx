'use client';

import { BarChart3, BriefcaseBusiness, ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileAnalysisTab } from '@/components/profile-analysis-tab';
import { BannerConceptTab } from '@/components/banner-concept-tab';
import { JobMatchesTab } from '@/components/job-matches-tab';
import type { AnalysisResult } from '@/types/analysis';

export const ResultsTabs = ({ data }: { data: AnalysisResult }) => {
  return (
    <Tabs defaultValue="analysis" className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white/85 p-2 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur sm:grid-cols-3">
        <TabsTrigger
          value="analysis"
          className="h-12 rounded-xl text-slate-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-700 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20"
        >
          <BarChart3 className="h-4 w-4" />
          Profile analysis
        </TabsTrigger>
        <TabsTrigger
          value="banner"
          className="h-12 rounded-xl text-slate-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-700 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20"
        >
          <ImageIcon className="h-4 w-4" />
          Banner concept
        </TabsTrigger>
        <TabsTrigger
          value="jobs"
          className="h-12 rounded-xl text-slate-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-700 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20"
        >
          <BriefcaseBusiness className="h-4 w-4" />
          Job matches
        </TabsTrigger>
      </TabsList>

      <TabsContent value="analysis" className="mt-7">
        {data.analysis ? (
          <ProfileAnalysisTab data={data.analysis} />
        ) : (
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(51,65,130,0.10)]">
            <CardContent className="p-6">
              <p className="text-slate-600">Profile analysis unavailable.</p>
              {data.errors?.analysis && (
                <p className="mt-2 text-sm text-red-500">
                  Error: {data.errors.analysis}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="banner" className="mt-7">
        {data.banner ? (
          <BannerConceptTab data={data.banner} />
        ) : (
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(51,65,130,0.10)]">
            <CardContent className="p-6">
              <p className="text-slate-600">Banner concept unavailable.</p>
              {data.errors?.banner && (
                <p className="mt-2 text-sm text-red-500">
                  Error: {data.errors.banner}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="jobs" className="mt-7">
        {data.jobs ? (
          <JobMatchesTab data={data.jobs} />
        ) : (
          <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(51,65,130,0.10)]">
            <CardContent className="p-6">
              <p className="text-slate-600">Job matches unavailable.</p>
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
  );
};
