"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const LOADING_MESSAGES = [
  { time: 0, message: "Fetching profile data..." },
  { time: 5000, message: "Analyzing with AI..." },
  { time: 12000, message: "Almost there..." },
];

export const UrlInputForm = ({ defaultUrl }: { defaultUrl?: string }) => {
  const router = useRouter();
  const [isPasteMode, setIsPasteMode] = useState(false);
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0].message);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (defaultUrl) setUrl(defaultUrl);
  }, [defaultUrl]);

  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      setLoadingMessage(LOADING_MESSAGES[0].message);
      
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        
        if (elapsed >= 12000) {
          setLoadingMessage(LOADING_MESSAGES[2].message);
        } else if (elapsed >= 5000) {
          setLoadingMessage(LOADING_MESSAGES[1].message);
        }
      }, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoading]);

  const validateInput = (): boolean => {
    if (!isPasteMode) {
      if (!url.includes("linkedin.com/in/")) {
        toast.error("Please enter a valid LinkedIn profile URL");
        return false;
      }
    } else {
      if (rawText.length <= 50) {
        toast.error("Please enter at least 50 characters of profile text");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: isPasteMode ? undefined : url,
          rawText: isPasteMode ? rawText : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to analyze profile");
      }

      const result = await response.json();
      sessionStorage.setItem("profileiq_result", JSON.stringify(result));
      router.push("/results");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {!isPasteMode ? (
        <Input
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-12 text-base"
          disabled={isLoading}
        />
      ) : (
        <Textarea
          placeholder="Paste your LinkedIn About or Experience..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="min-h-32 resize-none text-base"
          disabled={isLoading}
        />
      )}

      <button
        type="button"
        onClick={() => setIsPasteMode(!isPasteMode)}
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        disabled={isLoading}
      >
        {isPasteMode
          ? "Or enter your LinkedIn URL instead"
          : "Or paste your profile text instead"}
      </button>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze profile"
        )}
      </Button>

      {isLoading && (
        <p className="text-center text-sm text-muted-foreground">
          {loadingMessage}
        </p>
      )}
    </form>
  );
};
