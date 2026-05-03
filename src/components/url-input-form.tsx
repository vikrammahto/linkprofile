"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const LOADING_MESSAGES = [
  { time: 0, message: "Analyzing your profile..." },
  { time: 5000, message: "Generating insights with AI..." },
  { time: 12000, message: "Almost there..." },
];

export const UrlInputForm = ({ defaultText }: { defaultText?: string }) => {
  const router = useRouter();
  const [rawText, setRawText] = useState(defaultText ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0].message);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (defaultText) setRawText(defaultText);
  }, [defaultText]);

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
    if (rawText.trim().length < 50) {
      toast.error("Please enter at least 50 characters of profile text");
      return false;
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
          rawText: rawText,
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
      <Textarea
        placeholder="Paste your LinkedIn profile text here (About section, Experience, Skills, etc.)"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        className="min-h-40 resize-none text-base"
        disabled={isLoading}
      />

      <p className="text-xs text-muted-foreground">
        Copy your profile content from LinkedIn and paste it above. Include your headline, about section, experience, and skills for the best analysis.
      </p>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading || rawText.trim().length < 50}
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
