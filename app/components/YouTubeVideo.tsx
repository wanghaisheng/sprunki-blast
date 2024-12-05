import { useCallback, useEffect, useState } from 'react';

interface YouTubeVideoProps {
  url: string;
  title: string;
  className?: string;
}

export function YouTubeVideo({ url, title, className = '' }: YouTubeVideoProps) {
  const [videoId, setVideoId] = useState<string | null>(null);

  const extractVideoId = useCallback((url: string) => {
    try {
      const videoUrl = new URL(url);
      if (videoUrl.hostname.includes('youtube.com')) {
        return videoUrl.searchParams.get('v');
      } else if (videoUrl.hostname.includes('youtu.be')) {
        return videoUrl.pathname.slice(1);
      }
    } catch (e) {
      console.error('Invalid YouTube URL:', url);
    }
    return null;
  }, []);

  useEffect(() => {
    const id = extractVideoId(url);
    setVideoId(id);
  }, [url, extractVideoId]);

  if (!videoId) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
        <span className="text-gray-500 dark:text-gray-400">Invalid video URL</span>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;

  return (
    <iframe
      src={embedUrl}
      title={title}
      className={className}
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
