"use client";

import { useState, useMemo } from "react";
import type { JobMatch } from "@/types/analysis";
import { JobCard } from "@/components/job-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const JobMatchesTab = ({ data }: { data: JobMatch[] }) => {
  const [sortOrder, setSortOrder] = useState<"match" | "alphabetical">("match");

  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [...data].sort((a, b) => {
      if (sortOrder === "match") {
        return b.matchScore - a.matchScore;
      }
      return a.job_title.localeCompare(b.job_title);
    });
  }, [data, sortOrder]);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No job matches found. Try a more detailed profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">
          {data.length} job matches found
        </p>
        <Select
          value={sortOrder}
          onValueChange={(value: "match" | "alphabetical") => setSortOrder(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Best match first</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedData.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Listings sourced from JSearch API via RapidAPI
      </p>
    </div>
  );
};
