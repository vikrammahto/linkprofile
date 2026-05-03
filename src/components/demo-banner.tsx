"use client";

import { Button } from "@/components/ui/button";

export const DemoBanner = ({
  onUseDemo,
}: {
  onUseDemo: (url: string) => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-2 border-b bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-300">
      <span>Try it instantly with a demo profile</span>
      <Button
        variant="link"
        className="h-auto p-0 text-blue-600"
        onClick={() => onUseDemo("https://linkedin.com/in/williamhgates")}
      >
        Load demo
      </Button>
    </div>
  );
};
