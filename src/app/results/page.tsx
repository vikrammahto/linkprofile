'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  ImageIcon,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResultsTabs } from '@/components/results-tabs';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import type { AnalysisResult } from '@/types/analysis';

type StoredResultState =
  | { result: AnalysisResult; error: false }
  | { result: null; error: true }
  | { result: null; error: false };

function readStoredResult(): StoredResultState {
  if (typeof window === 'undefined') {
    return { result: null, error: false };
  }

  const stored = sessionStorage.getItem('linkprofile_result');
  if (!stored) {
    return { result: null, error: true };
  }

  try {
    return { result: JSON.parse(stored) as AnalysisResult, error: false };
  } catch {
    return { result: null, error: true };
  }
}

export default function ResultsPage() {
  const { result, error } = readStoredResult();

  const getScoreColor = (score: number) => {
    if (score >= 70)
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (score >= 50)
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  if (!result && !error) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-24">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No results found.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t find any analysis results. Please try analyzing a
              profile first.
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
    );
  }

  const profileScore = result?.analysis?.profileScore ?? 0;
  const bannerTheme = result?.banner?.theme ?? 'creative';
  const jobCount = result?.jobs?.length ?? 0;

  return (
    <div className="relative isolate min-h-full overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_42%,#f4f8ff_100%)]">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(79,70,229,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-28 left-[-180px] -z-10 h-[430px] w-[430px] rounded-full bg-fuchsia-400/30 blur-[95px]" />
      <div className="absolute top-[520px] right-[-190px] -z-10 h-[520px] w-[520px] rounded-full bg-blue-500/35 blur-[105px]" />
      <Sparkles className="absolute top-24 right-[12%] hidden h-9 w-9 text-indigo-100 md:block" />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="rounded-xl border border-slate-200 bg-white/80 px-4 text-slate-700 shadow-sm backdrop-blur hover:bg-white hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          {result?.analysis && (
            <Badge
              variant="outline"
              className={`rounded-full px-4 py-2 text-sm font-bold ${getScoreColor(profileScore)}`}
            >
              Score: {profileScore}/100
            </Badge>
          )}
        </div>

        <section className="mb-9 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_rgba(51,65,130,0.12)] backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-7 sm:p-9">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                <Sparkles className="h-4 w-4 text-amber-400" />
                AI profile report
              </div>
              <h1 className="max-w-3xl text-4xl leading-tight font-extrabold text-balance text-slate-950 sm:text-5xl">
                Your LinkedIn profile results are ready
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Review your profile score, sharpen your positioning, and turn
                the recommendations into a stronger LinkedIn presence.
              </p>
            </div>

            <div className="grid border-t border-slate-200 bg-gradient-to-br from-indigo-50/80 to-sky-50/80 sm:grid-cols-3 lg:grid-cols-1 lg:border-t-0 lg:border-l">
              <ResultStat
                icon={<BarChart3 className="h-5 w-5" />}
                label="Profile score"
                value={`${profileScore}/100`}
              />
              <ResultStat
                icon={<ImageIcon className="h-5 w-5" />}
                label="Banner theme"
                value={bannerTheme}
              />
              <ResultStat
                icon={<BriefcaseBusiness className="h-5 w-5" />}
                label="Job matches"
                value={`${jobCount}`}
              />
            </div>
          </div>
        </section>

        <ResultsTabs data={result!} />
      </div>
    </div>
  );
}

function ResultStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-200/80 p-6 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0 lg:border-r-0 lg:border-b lg:last:border-b-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-blue-500/20">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
        <p className="mt-1 text-xl font-extrabold text-slate-950 capitalize">
          {value}
        </p>
      </div>
    </div>
  );
}
