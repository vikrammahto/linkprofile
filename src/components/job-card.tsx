"use client";

import { MapPin } from "lucide-react";
import type { JobMatch } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const JobCard = ({ job }: { job: JobMatch }) => {
  const getMatchBadgeColor = (score: number) => {
    if (score >= 70) return "bg-green-100 text-green-800 hover:bg-green-100";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    return "bg-red-100 text-red-800 hover:bg-red-100";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-start space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">{job.job_title}</CardTitle>
          <CardDescription>{job.employer_name}</CardDescription>
        </div>
        <Badge className={`rounded-full ${getMatchBadgeColor(job.matchScore)}`}>
          {job.matchScore}% match
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin size={14} />
          <span>
            {job.job_city}, {job.job_country}
          </span>
        </div>
        <p className="text-sm text-muted-foreground italic line-clamp-2">
          {job.matchReason}
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a
            href={job.job_apply_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply now
          </a>
        </Button>
        <Progress value={job.matchScore} className="w-24" />
      </CardFooter>
    </Card>
  );
};
