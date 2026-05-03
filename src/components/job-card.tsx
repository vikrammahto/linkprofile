'use client';

import { ArrowUpRight, MapPin } from 'lucide-react';
import type { JobMatch } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const JobCard = ({ job }: { job: JobMatch }) => {
  const getMatchBadgeColor = (score: number) => {
    if (score >= 70)
      return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
    if (score >= 50) return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
    return 'bg-red-100 text-red-700 hover:bg-red-100';
  };

  return (
    <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(51,65,130,0.09)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(51,65,130,0.14)]">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-2">
          <CardTitle className="text-lg leading-6 font-bold text-slate-950">
            {job.job_title}
          </CardTitle>
          <CardDescription className="font-semibold text-slate-500">
            {job.employer_name}
          </CardDescription>
        </div>
        <Badge className={`rounded-full ${getMatchBadgeColor(job.matchScore)}`}>
          {job.matchScore}% match
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <MapPin size={15} />
          <span>
            {job.job_city}, {job.job_country}
          </span>
        </div>
        <p className="line-clamp-3 rounded-2xl bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
          {job.matchReason}
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-5">
        <Button
          size="sm"
          asChild
          className="rounded-xl bg-gradient-to-r from-violet-700 to-blue-500 px-4 font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-violet-600 hover:to-blue-400"
        >
          <a
            href={job.job_apply_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply now
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
        <Progress value={job.matchScore} className="h-2 w-28 bg-slate-100" />
      </CardFooter>
    </Card>
  );
};
