import React from 'react';
import { X, Youtube, ExternalLink, Play } from 'lucide-react';
import { getYouTubeEmbedUrl, extractYouTubeVideoId } from '../utils/youtube';

interface YouTubeVideoModalProps {
  videoUrl: string | null;
  videoTitle?: string;
  onClose: () => void;
}

export const YouTubeVideoModal: React.FC<YouTubeVideoModalProps> = ({
  videoUrl,
  videoTitle,
  onClose
}) => {
  if (!videoUrl) return null;

  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  const embedUrl = getYouTubeEmbedUrl(videoId, true);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in-50 duration-150">
      <div className="bg-neutral-900 border border-neutral-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="p-3.5 sm:p-4 bg-neutral-950 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Youtube className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-sm sm:text-base text-white truncate">
                {videoTitle || 'BJJ Drill & Sparring Video Visual'}
              </h3>
              <p className="text-[11px] text-neutral-400 truncate">
                YouTube Video Player • ID: {videoId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Open directly on YouTube"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open on YouTube</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Close video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 16:9 Responsive Video Embed Container */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={videoTitle || 'YouTube BJJ Technique Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>HD Drill Playback</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Done Watching
          </button>
        </div>
      </div>
    </div>
  );
};
