'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  FileText,
  Loader2,
  LockKeyhole,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const LOADING_MESSAGES = [
  { time: 0, message: 'Analyzing your profile...' },
  { time: 5000, message: 'Generating insights with AI...' },
  { time: 12000, message: 'Almost there...' },
];

export const UrlInputForm = () => {
  const router = useRouter();
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loadingElapsed, setLoadingElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoading) {
      intervalRef.current = setInterval(() => {
        setLoadingElapsed(Date.now() - startTimeRef.current);
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

  const loadingMessage =
    LOADING_MESSAGES.findLast(({ time }) => loadingElapsed >= time)?.message ??
    LOADING_MESSAGES[0].message;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be less than 10MB');
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
    setLoadingElapsed(0);
    startTimeRef.current = Date.now();

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
    <form
      id="analyze"
      onSubmit={handleSubmit}
      className="w-full rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-left shadow-[0_24px_80px_rgba(51,65,130,0.12)] backdrop-blur md:p-7"
    >
      <div className="grid grid-cols-2 rounded-t-2xl border border-b-0 border-slate-200 bg-white/80 text-sm font-semibold text-slate-600">
        <label
          htmlFor="pdf-upload"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-tl-2xl border-r border-slate-200 px-3 py-4 text-blue-700"
        >
          <Upload className="h-4 w-4" />
          Upload PDF
        </label>
        <label
          htmlFor="profile-text"
          className="flex items-center justify-center gap-2 px-3 py-4"
        >
          <FileText className="h-4 w-4 text-slate-500" />
          Paste Text
        </label>
      </div>

      <div className="space-y-5 rounded-b-2xl border border-slate-200 bg-white p-4 shadow-inner shadow-slate-100/80 md:p-5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
          disabled={isLoading || isParsing}
        />

        <div className="rounded-2xl border-2 border-dashed border-violet-300/80 bg-gradient-to-br from-white via-white to-blue-50/40 p-7 transition-colors hover:border-blue-400 md:p-10">
          {fileName ? (
            <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{fileName}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFile}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label
              htmlFor="pdf-upload"
              className="flex cursor-pointer flex-col items-center gap-3 text-center"
            >
              {isParsing ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                  <span className="text-sm text-slate-500">Parsing PDF...</span>
                </>
              ) : (
                <>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-md shadow-violet-200/60">
                    <Upload className="h-9 w-9" />
                  </span>
                  <span className="text-lg font-bold text-slate-950">
                    Upload LinkedIn PDF
                  </span>
                  <span className="text-sm text-slate-500">
                    Drag and drop your file here, or click to browse
                  </span>
                  <span className="text-xs text-slate-500">
                    Max size: 10MB - Format: PDF
                  </span>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs font-medium text-slate-500">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
          OR
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="relative">
        <Textarea
          id="profile-text"
          placeholder="Paste your LinkedIn profile text here (About section, Experience, Skills, etc.)"
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            if (fileName) setFileName(null);
          }}
          className="min-h-32 resize-none rounded-2xl border-slate-200 bg-white p-5 pr-20 text-base shadow-sm focus-visible:ring-blue-500"
          disabled={isLoading || isParsing}
        />
        <span className="absolute right-5 bottom-4 text-xs font-medium text-slate-500">
          {rawText.length} / 8000
        </span>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-6 h-14 w-full rounded-xl bg-gradient-to-r from-violet-700 via-indigo-600 to-sky-500 text-base font-bold shadow-xl shadow-blue-500/25 hover:from-violet-600 hover:to-sky-400"
        disabled={isLoading || isParsing || rawText.trim().length < 50}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            Analyze Profile
            <Sparkles className="h-4 w-4" />
          </>
        )}
      </Button>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
        <LockKeyhole className="h-4 w-4 text-emerald-600" />
        <span>Your data is secure and not stored</span>
      </div>

      {isLoading && (
        <p className="mt-3 text-center text-sm text-slate-500">
          {loadingMessage}
        </p>
      )}
    </form>
  );
};
