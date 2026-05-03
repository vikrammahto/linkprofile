'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Upload, FileText, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const LOADING_MESSAGES = [
  { time: 0, message: 'Analyzing your profile...' },
  { time: 5000, message: 'Generating insights with AI...' },
  { time: 12000, message: 'Almost there...' },
];

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

export const UrlInputForm = ({ defaultText }: { defaultText?: string }) => {
  const router = useRouter();
  const [rawText, setRawText] = useState(defaultText ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(
    LOADING_MESSAGES[0].message,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be less than 5MB');
      return;
    }

    setIsParsing(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server returned invalid response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse PDF');
      }

      setRawText(data.text);
      toast.success('PDF parsed successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to parse PDF',
      );
      setFileName(null);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearFile = () => {
    setFileName(null);
    setRawText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadDemo = () => {
    setRawText(DEMO_PROFILE);
    setFileName(null);
    toast.success('Demo profile loaded');
  };

  const validateInput = (): boolean => {
    if (rawText.trim().length < 50) {
      toast.error('Please enter at least 50 characters of profile text');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawText: rawText,
        }),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error('Server returned invalid response');
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze profile');
      }

      sessionStorage.setItem('linkprofile_result', JSON.stringify(result));
      router.push('/results');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File Upload Section */}
      <div className="rounded-xl border border-border/50 bg-secondary/30 p-5 transition-colors hover:border-border">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
          disabled={isLoading || isParsing}
        />

        {fileName ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{fileName}</p>
                <p className="text-xs text-muted-foreground">PDF uploaded</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearFile}
              disabled={isLoading}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="pdf-upload"
            className="flex cursor-pointer flex-col items-center gap-3 py-4"
          >
            {isParsing ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Parsing PDF...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/50 transition-colors group-hover:border-primary">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Upload your LinkedIn PDF</p>
                  <p className="text-sm text-muted-foreground">
                    or paste your profile text below
                  </p>
                </div>
              </>
            )}
          </label>
        )}
      </div>

      {/* Text Input Section */}
      <div className="relative">
        <Textarea
          placeholder="Paste your LinkedIn profile text here (About section, Experience, Skills, etc.)"
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            if (fileName) setFileName(null);
          }}
          className="min-h-36 resize-none rounded-xl border-border/50 bg-secondary/30 text-base placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20"
          disabled={isLoading || isParsing}
        />
        <div className="absolute bottom-3 right-3">
          <span className="text-xs text-muted-foreground">
            {rawText.length} characters
          </span>
        </div>
      </div>

      {/* Helper text and demo button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Include headline, about, experience, and skills for best results.
        </p>
        <button
          type="button"
          onClick={loadDemo}
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          disabled={isLoading || isParsing}
        >
          Try demo
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
        disabled={isLoading || isParsing || rawText.trim().length < 50}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {loadingMessage}
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Analyze with AI
          </>
        )}
      </Button>

      {/* Loading progress indicator */}
      {isLoading && (
        <div className="space-y-2">
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div className="shimmer h-full w-full rounded-full bg-primary/30" />
          </div>
        </div>
      )}
    </form>
  );
};
