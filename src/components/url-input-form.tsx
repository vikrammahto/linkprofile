'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const LOADING_MESSAGES = [
  { time: 0, message: 'Analyzing your profile...' },
  { time: 5000, message: 'Generating insights with AI...' },
  { time: 12000, message: 'Almost there...' },
];

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
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* File Upload Section */}
      <div className="border-border hover:border-muted-foreground/50 rounded-lg border-2 border-dashed p-4 transition-colors">
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
            <div className="flex items-center gap-2 text-sm">
              <FileText className="text-muted-foreground h-4 w-4" />
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
            className="flex cursor-pointer flex-col items-center gap-2"
          >
            {isParsing ? (
              <>
                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  Parsing PDF...
                </span>
              </>
            ) : (
              <>
                <Upload className="text-muted-foreground h-8 w-8" />
                <span className="text-sm font-medium">Upload LinkedIn PDF</span>
                <span className="text-muted-foreground text-xs">
                  or paste your profile text below
                </span>
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
          className="min-h-40 resize-none text-base"
          disabled={isLoading || isParsing}
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Upload your LinkedIn profile PDF or paste your profile content. Include
        your headline, about section, experience, and skills for the best
        analysis.
      </p>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading || isParsing || rawText.trim().length < 50}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze profile'
        )}
      </Button>

      {isLoading && (
        <p className="text-muted-foreground text-center text-sm">
          {loadingMessage}
        </p>
      )}
    </form>
  );
};
