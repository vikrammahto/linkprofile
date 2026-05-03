'use client';

import { useState } from 'react';
import {
  Check,
  Copy,
  Layers,
  Palette,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { BannerConcept } from '@/types/analysis';
import { BannerPreview } from '@/components/banner-preview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const BannerConceptTab = ({ data }: { data: BannerConcept }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(data.imagePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <BannerPreview banner={data} />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-blue-500/20">
              <Palette className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-950">
              Color palette
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <ColorSwatch label="Primary" value={data.primaryColor} />
            <ColorSwatch label="Accent" value={data.accentColor} />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-950">
              Tagline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl leading-9 font-semibold text-slate-950">
              {data.tagline}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur">
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-950">
            Visual elements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            {data.visualElements.map((element, index) => (
              <li
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
              >
                {element}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-950">
            Layout description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-slate-600">
            {data.layoutDescription}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-200 bg-white/90 shadow-[0_18px_60px_rgba(51,65,130,0.10)] backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-blue-500/20">
              <WandSparkles className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-950">
              AI image prompt
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyPrompt}
            className="rounded-xl border-slate-200 bg-white"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy prompt
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <pre className="rounded-2xl bg-slate-950 p-5 font-mono text-xs leading-6 whitespace-pre-wrap text-slate-100">
            {data.imagePrompt}
          </pre>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-slate-500">
        Use this prompt with Midjourney, DALL-E, or fal.ai
      </p>
    </div>
  );
};

function ColorSwatch({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
      <div
        className="h-16 rounded-xl shadow-inner"
        style={{ backgroundColor: value }}
      />
      <p className="mt-3 text-xs font-bold text-slate-500 uppercase">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}
