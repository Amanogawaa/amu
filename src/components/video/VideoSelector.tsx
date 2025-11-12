'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, ExternalLink } from 'lucide-react';
import { YouTubePlayer } from './YouTubePlayer';

interface Video {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  duration: string;
  viewCount: string;
}

interface VideoSelectorProps {
  lessonId: string;
  searchQuery: string;
  selectedVideoId?: string;
  onVideoSelect?: (videoId: string) => void;
}

export const VideoSelector = ({
  lessonId,
  searchQuery,
  selectedVideoId,
  onVideoSelect,
}: VideoSelectorProps) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(
    selectedVideoId || null
  );

  useEffect(() => {
    fetchVideos();
  }, [lessonId]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/lessons/${lessonId}/videos`);

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data.videos || []);

      // Auto-select first video if none selected
      if (!selectedVideo && data.videos && data.videos.length > 0) {
        const firstVideoId = data.videos[0].videoId;
        setSelectedVideo(firstVideoId);
        onVideoSelect?.(firstVideoId);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setError('Failed to load videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
    onVideoSelect?.(videoId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full aspect-video" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchVideos} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              No videos found for this lesson.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  searchQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Search on YouTube
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentVideo = videos.find((v) => v.videoId === selectedVideo);

  return (
    <div className="space-y-6">
      {/* Main Video Player */}
      {selectedVideo && (
        <div>
          <YouTubePlayer videoId={selectedVideo} title={currentVideo?.title} />
          <div className="mt-3">
            <h3 className="font-semibold text-lg">{currentVideo?.title}</h3>
            <p className="text-sm text-muted-foreground">
              {currentVideo?.channelTitle}
            </p>
          </div>
        </div>
      )}

      {/* Video Recommendations */}
      {videos.length > 1 && (
        <div>
          <h4 className="font-semibold mb-3">Related Videos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <Card
                key={video.videoId}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedVideo === video.videoId ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleVideoSelect(video.videoId)}
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-32 h-20 object-cover rounded"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm line-clamp-2 mb-1">
                        {video.title}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {video.channelTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {parseInt(video.viewCount).toLocaleString()} views
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Fallback: Manual Search */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Can't find the right video?
        </p>
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
              searchQuery
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Search on YouTube
          </a>
        </Button>
      </div>
    </div>
  );
};
