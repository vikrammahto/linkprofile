'use client';

import { CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import type { ProfileAnalysis } from '@/types/analysis';
import { ScoreRing } from '@/components/score-ring';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

export const ProfileAnalysisTab = ({ data }: { data: ProfileAnalysis }) => {
  return (
    <div className="space-y-7">
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur md:grid-cols-[auto_1fr] md:p-8">
        <div className="flex justify-center md:justify-start md:pr-2">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-sky-50 p-5">
            <ScoreRing score={data.profileScore} />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Profile summary
          </div>
          <p className="text-lg leading-8 text-slate-600">{data.summary}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur">
        <SectionHeading title="Top skills" />
        <div className="flex flex-wrap gap-2">
          {data.topSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur">
        <SectionHeading title="Seniority and fit" />
        <div className="flex flex-wrap gap-2">
          <Badge className="rounded-full bg-gradient-to-r from-violet-700 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:from-violet-700 hover:to-blue-500">
            {data.seniorityLevel}
          </Badge>
          {data.industryFit.map((industry) => (
            <Badge
              key={industry}
              variant="outline"
              className="rounded-full border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {industry}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Strengths" />
        <div className="grid gap-4 md:grid-cols-2">
          {data.strengths.map((strength) => (
            <Card
              key={strength.label}
              className="rounded-3xl border-emerald-100 bg-white/90 shadow-[0_18px_50px_rgba(51,65,130,0.09)]"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <CardTitle className="mb-3 text-lg font-bold text-slate-950">
                  {strength.label}
                </CardTitle>
                <p className="text-sm leading-6 text-slate-600">
                  {strength.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title="Areas to improve" />
        <div className="grid gap-4 md:grid-cols-2">
          {data.gaps.map((gap) => (
            <Card
              key={gap.label}
              className="rounded-3xl border-amber-100 bg-white/90 shadow-[0_18px_50px_rgba(51,65,130,0.09)]"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <CardTitle className="mb-3 text-lg font-bold text-slate-950">
                  {gap.label}
                </CardTitle>
                <p className="text-sm leading-6 text-slate-600">
                  {gap.suggestion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

function SectionHeading({ title }: { title: string }) {
  return (
    <h3 className="mb-4 text-xs font-bold tracking-[0.18em] text-slate-500 uppercase">
      {title}
    </h3>
  );
}
