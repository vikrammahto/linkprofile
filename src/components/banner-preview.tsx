'use client';

import { BannerConcept } from '@/types/analysis';
import { Badge } from '@/components/ui/badge';

export const BannerPreview = ({ banner }: { banner: BannerConcept }) => {
  return (
    <div
      className="relative aspect-[4/1] w-full overflow-hidden rounded-3xl shadow-[0_18px_60px_rgba(51,65,130,0.16)]"
      style={{ backgroundColor: banner.primaryColor }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_45%,rgba(255,255,255,0.10))]" />
      <div
        className="absolute top-0 right-0 h-full w-1/3 opacity-90"
        style={{ backgroundColor: banner.accentColor }}
      />
      <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute right-12 bottom-0 h-px w-48 rotate-[-18deg] bg-white/35" />

      <div className="absolute top-0 left-0 flex h-full max-w-[72%] flex-col justify-center pl-6 sm:pl-9">
        <p className="text-xl leading-tight font-extrabold text-balance text-white sm:text-3xl">
          {banner.tagline}
        </p>
        <Badge
          variant="secondary"
          className="mt-3 w-fit rounded-full border-0 bg-white/20 px-3 py-1 text-[10px] text-white uppercase backdrop-blur hover:bg-white/20"
        >
          {banner.theme}
        </Badge>
      </div>

      <span className="absolute bottom-3 left-6 text-xs text-white/60 sm:left-9">
        1584 x 396px preview
      </span>
    </div>
  );
};
