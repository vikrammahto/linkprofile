"use client";

import { useState } from "react";
import { BannerConcept } from "@/types/analysis";
import { BannerPreview } from "@/components/banner-preview";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const BannerConceptTab = ({ data }: { data: BannerConcept }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(data.imagePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner Preview */}
      <BannerPreview banner={data} />

      {/* Color Palette */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <div
            className="h-12 w-12 rounded-lg"
            style={{ backgroundColor: data.primaryColor }}
          />
          <span className="text-xs text-muted-foreground">Primary</span>
          <span className="text-xs font-mono">{data.primaryColor}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div
            className="h-12 w-12 rounded-lg"
            style={{ backgroundColor: data.accentColor }}
          />
          <span className="text-xs text-muted-foreground">Accent</span>
          <span className="text-xs font-mono">{data.accentColor}</span>
        </div>
      </div>

      {/* Tagline Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tagline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl italic">{data.tagline}</p>
        </CardContent>
      </Card>

      {/* Visual Elements Card */}
      <Card>
        <CardHeader>
          <CardTitle>Visual elements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {data.visualElements.map((element, index) => (
              <li key={index}>{element}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Layout Description Card */}
      <Card>
        <CardHeader>
          <CardTitle>Layout description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {data.layoutDescription}
          </p>
        </CardContent>
      </Card>

      {/* AI Image Prompt Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>AI image prompt</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              "Copy prompt"
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono bg-muted p-3 rounded whitespace-pre-wrap">
            {data.imagePrompt}
          </pre>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Use this prompt with Midjourney, DALL-E, or fal.ai
      </p>
    </div>
  );
};
