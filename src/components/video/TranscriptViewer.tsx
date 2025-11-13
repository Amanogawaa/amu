'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Copy, Check, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/loggers';

interface TranscriptViewerProps {
  lessonId: string;
  videoId?: string;
  autoFetch?: boolean;
}

interface TranscriptData {
  transcript: string;
  language: string;
  fetchedAt?: string;
  stats?: {
    wordCount: number;
    duration: number;
    segmentCount: number;
    averageWordsPerMinute: number;
  };
}

export const TranscriptViewer = ({
  lessonId,
  videoId,
  autoFetch = true,
}: TranscriptViewerProps) => {
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (autoFetch) {
      fetchTranscript();
    }
  }, [lessonId, autoFetch]);

  const fetchTranscript = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(
        `${apiUrl}/api/lessons/${lessonId}/transcript`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('No transcript available for this video');
        } else {
          throw new Error('Failed to fetch transcript');
        }
        return;
      }

      const data = await response.json();
      setTranscript(data);
    } catch (err) {
      logger.error('Error fetching transcript:', err);
      setError('Failed to load transcript. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateTranscript = async () => {
    if (!videoId) {
      setError('No video selected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(
        `${apiUrl}/api/lessons/${lessonId}/transcript`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId }),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate transcript');
      }

      const data = await response.json();
      setTranscript({
        transcript: data.transcript,
        language: data.language,
        fetchedAt: data.lesson?.transcriptFetchedAt,
        stats: data.stats,
      });
    } catch (err: any) {
      logger.error('Error generating transcript:', err);
      setError(err.message || 'Failed to generate transcript');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!transcript?.transcript) return;

    try {
      await navigator.clipboard.writeText(transcript.transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy:', err);
    }
  };

  const downloadTranscript = () => {
    if (!transcript?.transcript) return;

    const blob = new Blob([transcript.transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${lessonId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Video Transcript
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !transcript) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Video Transcript
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            {videoId && (
              <Button onClick={generateTranscript} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Transcript
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!transcript) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Video Transcript
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No transcript available yet</p>
            {videoId && (
              <Button onClick={generateTranscript} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Transcript
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Video Transcript
          </CardTitle>
          <div className="flex items-center gap-2">
            {transcript.language && (
              <Badge variant="secondary">
                {transcript.language.toUpperCase()}
              </Badge>
            )}
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              size="sm"
              title="Copy transcript"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={downloadTranscript}
              variant="ghost"
              size="sm"
              title="Download transcript"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {transcript.stats && (
          <div className="flex gap-4 text-sm text-muted-foreground mt-2">
            <span>{transcript.stats.wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>
              {Math.floor(transcript.stats.duration / 60)}m{' '}
              {transcript.stats.duration % 60}s
            </span>
            <span>•</span>
            <span>{transcript.stats.averageWordsPerMinute} wpm</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {transcript.transcript}
          </div>
        </ScrollArea>
        {transcript.fetchedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Fetched: {new Date(transcript.fetchedAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
