'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Upload, FileText, X, Sparkles, Lock } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [rawText, setRawText] = useState(defaultText ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0].message);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultText) {
      setRawText(defaultText);
      setActiveTab('paste');
    }
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
      toast.error(error instanceof Error ? error.message : 'Failed to parse PDF');
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
    setActiveTab('paste');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
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
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tabs */}
      <div className="flex rounded-lg border border-border bg-muted/50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'upload'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Upload PDF
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'paste'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Paste Text
        </button>
      </div>

      {/* Upload Section */}
      {activeTab === 'upload' && (
        <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary/40">
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
            <label htmlFor="pdf-upload" className="flex cursor-pointer flex-col items-center gap-3">
              {isParsing ? (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Parsing PDF...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Upload LinkedIn PDF</p>
                    <p className="text-sm text-muted-foreground">Max 5MB, PDF format</p>
                  </div>
                </>
              )}
            </label>
          )}
        </div>
      )}

      {/* Paste Section */}
      {activeTab === 'paste' && (
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              placeholder="Paste your LinkedIn profile (About, Experience, Skills...)"
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                if (fileName) setFileName(null);
              }}
              className="min-h-40 resize-none rounded-xl border-border bg-muted/30 text-base placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              disabled={isLoading || isParsing}
            />
            <div className="absolute bottom-3 right-3">
              <span className="text-xs text-muted-foreground">{rawText.length} chars</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Include headline, about, experience, and skills for best results
            </p>
            <button
              type="button"
              onClick={loadDemo}
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
              disabled={isLoading || isParsing}
            >
              Try demo
            </button>
          </div>
        </div>
      )}

      {/* Divider with OR */}
      {activeTab === 'upload' && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or paste text below</span>
          </div>
        </div>
      )}

      {/* Text input for upload tab */}
      {activeTab === 'upload' && (
        <Textarea
          placeholder="Paste your LinkedIn profile text here..."
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            if (fileName) setFileName(null);
          }}
          className="min-h-24 resize-none rounded-xl border-border bg-muted/30 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50"
          disabled={isLoading || isParsing}
        />
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="gradient-btn w-full gap-2 rounded-xl border-0 py-6 text-base font-semibold text-white disabled:opacity-50"
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
            Analyze Profile
          </>
        )}
      </Button>

      {/* Loading progress */}
      {isLoading && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="shimmer h-full w-full rounded-full bg-primary/30" />
        </div>
      )}

      {/* Trust note */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>Your data is secure and not stored</span>
      </div>
    </form>
  );
};
