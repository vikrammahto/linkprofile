'use client';

import { useState, useMemo } from 'react';
import { BriefcaseBusiness, SlidersHorizontal } from 'lucide-react';
import type { JobMatch } from '@/types/analysis';
import { JobCard } from '@/components/job-card';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const JobMatchesTab = ({ data }: { data: JobMatch[] }) => {
  const [sortOrder, setSortOrder] = useState<'match' | 'alphabetical'>('match');

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [...data].sort((a, b) => {
      if (sortOrder === 'match') {
        return b.matchScore - a.matchScore;
      }
      return a.job_title.localeCompare(b.job_title);
    });
  }, [data, sortOrder]);

  if (!data || data.length === 0) {
    return (
      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(51,65,130,0.10)]">
        <CardContent className="py-8 text-center">
          <p className="text-slate-600">
            No job matches found. Try a more detailed profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/20">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">
              {data.length} job matches found
            </p>
            <p className="text-sm text-slate-500">
              Sorted recommendations based on profile fit
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <Select
            value={sortOrder}
            onValueChange={(value: 'match' | 'alphabetical') =>
              setSortOrder(value)
            }
          >
            <SelectTrigger className="w-full rounded-xl border-slate-200 bg-white sm:w-[190px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best match first</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {sortedData.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        Listings sourced from JSearch API via RapidAPI
      </p>
    </div>
  );
};
