"use client";

import { BannerConcept } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";

export const BannerPreview = ({ banner }: { banner: BannerConcept }) => {
  return (
    <div
      className="relative w-full aspect-[4/1] rounded-xl overflow-hidden"
      style={{ backgroundColor: banner.primaryColor }}
    >
      {/* Right accent strip */}
      <div
        className="absolute right-0 top-0 h-full w-1/4"
        style={{ backgroundColor: banner.accentColor }}
      />

      {/* Left side content */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-center pl-8">
        <p className="text-2xl font-bold text-white">{banner.tagline}</p>
        <Badge
          variant="secondary"
          className="mt-2 w-fit text-[10px] uppercase tracking-wide bg-white/20 text-white border-0"
        >
          {banner.theme}
        </Badge>
      </div>

      {/* Bottom-left size label */}
      <span className="absolute bottom-2 left-3 text-xs text-white/50">
        1584 x 396px preview
      </span>
    </div>
  );
};
