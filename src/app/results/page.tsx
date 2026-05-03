"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProfileResult {
  analysis?: string;
  bannerConcept?: string;
  jobMatches?: string[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("profileiq_result");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        router.push("/");
      }
    } else {
      router.push("/");
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <Link href="/">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Button>
      </Link>

      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile Analysis</h1>

        {result.analysis && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Profile Breakdown</h2>
            <div className="rounded-lg border border-border bg-muted/50 p-6">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {result.analysis}
              </p>
            </div>
          </section>
        )}

        {result.bannerConcept && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Banner Design Concept</h2>
            <div className="rounded-lg border border-border bg-muted/50 p-6">
              <p className="whitespace-pre-wrap text-muted-foreground">
                {result.bannerConcept}
              </p>
            </div>
          </section>
        )}

        {result.jobMatches && result.jobMatches.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Job Recommendations</h2>
            <div className="rounded-lg border border-border bg-muted/50 p-6">
              <ul className="space-y-2">
                {result.jobMatches.map((job, index) => (
                  <li key={index} className="text-muted-foreground">
                    {job}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
