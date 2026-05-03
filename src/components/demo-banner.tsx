"use client";

import { Button } from "@/components/ui/button";

const DEMO_PROFILE = `Bill Gates
Co-chair, Bill & Melinda Gates Foundation

About:
Co-chair of the Bill & Melinda Gates Foundation. Founder of Breakthrough Energy. Co-founder of Microsoft. Voracious reader. Avid traveler. Active blogger.

Experience:
Co-chair at Bill & Melinda Gates Foundation (2000 - Present)
Leading global initiatives in healthcare, education, and poverty reduction. Directing billions in philanthropic investments toward solving the world's toughest problems.

Founder at Breakthrough Energy (2015 - Present)
Building a network of investment vehicles, philanthropic programs, and advocacy initiatives to accelerate the clean energy transition.

Co-founder at Microsoft (1975 - 2020)
Co-founded and led Microsoft from a startup to the world's most valuable company. Pioneered personal computing software that transformed how billions of people work and communicate.

Skills:
Technology Strategy, Software Development, Philanthropy, Global Health, Climate Change, Leadership, Public Speaking, Investment, Innovation, Business Development

Education:
Harvard University (dropped out to found Microsoft)
Lakeside School, Seattle`;

export const DemoBanner = ({
  onUseDemo,
}: {
  onUseDemo: (text: string) => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-2 border-b bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
      <span>Try it instantly with a demo profile</span>
      <Button
        variant="link"
        className="h-auto p-0 text-blue-600"
        onClick={() => onUseDemo(DEMO_PROFILE)}
      >
        Load demo
      </Button>
    </div>
  );
};
