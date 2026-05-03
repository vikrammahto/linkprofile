"use client";

import type { ProfileAnalysis } from "@/types/analysis";
import { ScoreRing } from "@/components/score-ring";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const ProfileAnalysisTab = ({ data }: { data: ProfileAnalysis }) => {
  return (
    <div className="space-y-6">
      {/* Score and Summary */}
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center md:justify-start">
          <ScoreRing score={data.profileScore} />
        </div>
        <div className="flex items-center">
          <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
        </div>
      </div>

      {/* Top Skills */}
      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Top skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.topSkills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      {/* Seniority and Fit */}
      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Seniority and fit
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{data.seniorityLevel}</Badge>
          {data.industryFit.map((industry) => (
            <Badge key={industry} variant="outline">
              {industry}
            </Badge>
          ))}
        </div>
      </section>

      {/* Strengths */}
      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Strengths
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.strengths.map((strength) => (
            <Card key={strength.label} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <CardTitle className="mb-2 text-base">{strength.label}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {strength.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Areas to Improve */}
      <section>
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Areas to improve
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.gaps.map((gap) => (
            <Card key={gap.label} className="border-l-4 border-l-red-400">
              <CardContent className="p-4">
                <CardTitle className="mb-2 text-base">{gap.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{gap.suggestion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
