import React, { useState } from 'react';
import { VideoLinkItem } from '../types';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl, isValidYouTubeUrl } from '../utils/youtube';
import { Youtube, Plus, Trash2, Play, ExternalLink, Sparkles, CheckCircle2, Video, AlertCircle } from 'lucide-react';

interface YouTubeLinkUploaderProps {
  videos: VideoLinkItem[];
  onChange: (videos: VideoLinkItem[]) => void;
  onPreviewVideo: (url: string, title?: string) => void;
}

export const YouTubeLinkUploader: React.FC<YouTubeLinkUploaderProps> = ({
  videos,
  onChange,
  onPreviewVideo
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [inputTitle, setInputTitle] = useState('');
  const [drillNumber, setDrillNumber] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<VideoLinkItem['category']>('Drill Visual');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick sample BJJ instructional videos
  const sampleTutorials: Array<{ title: string; url: string; category: VideoLinkItem['category'] }> = [
    {
      title: 'De La Riva Guard & Balloon Sweep Mechanics',
      url: 'https://www.youtube.com/watch?v=F0fG7t8H7_k',
      category: 'Drill Visual'
    },
    {
      title: 'Knee-Cut Pass Tight Head & Arm Control',
      url: 'https://www.youtube.com/watch?v=kY6Vw3i7N4g',
      category: 'Technique Breakdown'
    },
    {
      title: 'Bow and Arrow Choke High Percentage Finish',
      url: 'https://www.youtube.com/watch?v=4i8c7q1ZJ9I',
      category: 'Technique Breakdown'
    },
    {
      title: 'North-South Choke Grip Adjustments',
      url: 'https://www.youtube.com/watch?v=jW9Q4K5Z8fI',
      category: 'Drill Visual'
    }
  ];

  const handleAddVideo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) {
      setErrorMsg('Please paste a YouTube URL or link.');
      return;
    }

    const videoId = extractYouTubeVideoId(trimmedUrl);
    if (!videoId) {
      setErrorMsg('Invalid YouTube URL. Please provide a standard watch link, youtu.be, shorts, or video ID.');
      return;
    }

    const newVideo: VideoLinkItem = {
      id: `yt-vid-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      url: trimmedUrl,
      title: inputTitle.trim() || (drillNumber ? `Drill #${drillNumber} Technique Visual` : 'BJJ Technique Video'),
      videoId,
      category,
      drillNumber
    };

    onChange([...videos, newVideo]);
    setInputUrl('');
    setInputTitle('');
    setDrillNumber(undefined);
    setErrorMsg(null);
  };

  const handleAddSample = (sample: { title: string; url: string; category: VideoLinkItem['category'] }) => {
    const videoId = extractYouTubeVideoId(sample.url) || 'sample';
    const newVideo: VideoLinkItem = {
      id: `yt-vid-${Date.now()}`,
      url: sample.url,
      title: sample.title,
      videoId,
      category: sample.category
    };
    onChange([...videos, newVideo]);
  };

  const handleRemoveVideo = (id: string) => {
    onChange(videos.filter((v) => v.id !== id));
  };

  return (
    <div className="bg-neutral-50/90 rounded-xl p-3.5 border border-neutral-200 space-y-3.5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs shadow-2xs">
            <Youtube className="w-3.5 h-3.5" />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
              YouTube Video Links &amp; Visual Drill Guides
            </label>
            <span className="text-[11px] text-neutral-500 font-medium">
              Upload or link YouTube videos of your drills, tutorials, or your own recorded sparring rounds
            </span>
          </div>
        </div>

        {videos.length > 0 && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-200">
            {videos.length} {videos.length === 1 ? 'Video Link' : 'Video Links'} Attached
          </span>
        )}
      </div>

      {/* Input Form */}
      <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          {/* YouTube URL Input */}
          <div className="sm:col-span-7">
            <label className="text-[10px] font-bold uppercase text-neutral-600 block mb-1">
              YouTube Video URL / Link:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. https://www.youtube.com/watch?v=... or youtu.be/..."
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs font-medium bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
              <Youtube className="w-4 h-4 text-red-600 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Video Title / Label */}
          <div className="sm:col-span-5">
            <label className="text-[10px] font-bold uppercase text-neutral-600 block mb-1">
              Video Title / Description (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Marcelo Garcia Back Take Breakdown"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-medium bg-neutral-50 border border-neutral-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        {/* Row for Category & Drill Line Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Tag:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="text-xs bg-neutral-50 border border-neutral-200 rounded-md px-2 py-1 font-semibold text-neutral-700 focus:outline-none"
              >
                <option value="Drill Visual">📹 Drill Visual</option>
                <option value="Sparring Video">🥋 Sparring Video</option>
                <option value="Technique Breakdown">🔍 Technique Breakdown</option>
                <option value="Competition Match">🏆 Competition Match</option>
                <option value="General">📌 General</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Link to Drill:</span>
              <select
                value={drillNumber ?? ''}
                onChange={(e) => setDrillNumber(e.target.value ? Number(e.target.value) : undefined)}
                className="text-xs bg-neutral-50 border border-neutral-200 rounded-md px-2 py-1 font-semibold text-neutral-700 focus:outline-none"
              >
                <option value="">(Entire Session)</option>
                <option value="1">Drill #1</option>
                <option value="2">Drill #2</option>
                <option value="3">Drill #3</option>
                <option value="4">Drill #4</option>
                <option value="5">Drill #5</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAddVideo()}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add YouTube Link</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* List of Added Video Links */}
      {videos.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Attached Video Guides ({videos.length}):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {videos.map((vid) => {
              const videoId = vid.videoId || extractYouTubeVideoId(vid.url) || '';
              const thumb = videoId ? getYouTubeThumbnailUrl(videoId) : '';

              return (
                <div
                  key={vid.id}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs flex flex-col justify-between group hover:border-neutral-400 transition-all"
                >
                  <div className="relative aspect-16/9 bg-neutral-950 overflow-hidden cursor-pointer" onClick={() => onPreviewVideo(vid.url, vid.title)}>
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-600">
                        <Video className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      </div>
                    </div>
                    {vid.drillNumber && (
                      <div className="absolute top-2 left-2 bg-neutral-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        Drill #{vid.drillNumber}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      YouTube
                    </div>
                  </div>

                  <div className="p-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {vid.title || 'YouTube Technique'}
                      </p>
                      <span className="text-[10px] text-neutral-500 font-medium">
                        {vid.category || 'Visual Guide'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onPreviewVideo(vid.url, vid.title)}
                        className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                        title="Watch video in player"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(vid.id)}
                        className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Remove video link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Tutorial Suggestions */}
      <div className="pt-2 border-t border-neutral-200">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Quick Attach Recommended Technique Breakdown:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sampleTutorials.map((sample) => (
            <button
              key={sample.title}
              type="button"
              onClick={() => handleAddSample(sample)}
              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-white hover:bg-red-50 border border-neutral-300 hover:border-red-300 text-neutral-700 hover:text-red-950 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Youtube className="w-3 h-3 text-red-600" />
              <span>+ {sample.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
