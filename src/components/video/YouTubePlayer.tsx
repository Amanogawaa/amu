'use client';

import { useState } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
}

export const YouTubePlayer = ({
  videoId,
  title = 'Video',
  autoplay = false,
}: YouTubePlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams(
    {
      autoplay: autoplay ? '1' : '0',
      rel: '0',
      modestbranding: '1',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
    }
  ).toString()}`;

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};
