"use client";

import { useState } from "react";
import { UrlInputForm } from "@/components/url-input-form";
import { Badge } from "@/components/ui/badge";
import { DemoBanner } from "@/components/demo-banner";

export default function Home() {
  const [demoText, setDemoText] = useState("");

  return (
    <>
      <DemoBanner onUseDemo={setDemoText} />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
        <div className="mx-auto w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Analyze your LinkedIn profile with AI
            </h1>
            <p className="text-pretty text-lg text-muted-foreground">
              Paste your profile text and get a breakdown, banner design concept, and job
              recommendations in 30 seconds.
            </p>
          </div>

          <UrlInputForm defaultText={demoText} />

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary">Profile analysis</Badge>
          <Badge variant="secondary">Banner concept</Badge>
          <Badge variant="secondary">Job matches</Badge>
        </div>
      </div>
    </div>
    </>
  );
}
