import React, { useState, useEffect } from 'react';
import { BjjLogEntry, VideoLinkItem } from '../types';
import { ImageLightboxModal } from './ImageLightboxModal';
import { YouTubeVideoModal } from './YouTubeVideoModal';
import { getBeltBadgeColor } from '../utils/partners';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../utils/youtube';
import {
  Calendar,
  User,
  Edit2,
  Trash2,
  Flame,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Printer,
  Copy,
  CheckCircle2,
  FileText,
  Camera,
  Eye,
  Layers,
  Users,
  Youtube,
  Play,
  Swords,
  Handshake,
  ExternalLink
} from 'lucide-react';

interface LogCardProps {
  log: BjjLogEntry;
  onEdit: (log: BjjLogEntry) => void;
  onDelete: (id: string) => void;
  onDuplicate: (log: BjjLogEntry) => void;
  onPrintPreview: (log: BjjLogEntry) => void;
  onFilterByPartner?: (partnerName: string) => void;
  forceExpanded?: boolean | null;
}

export const LogCard: React.FC<LogCardProps> = ({
  log,
  onEdit,
  onDelete,
  onDuplicate,
  onPrintPreview,
  onFilterByPartner,
  forceExpanded = null
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title?: string } | null>(null);

  // Sync with parent expand/collapse-all command if triggered
  useEffect(() => {
    if (forceExpanded !== null && forceExpanded !== undefined) {
      setIsExpanded(forceExpanded);
    }
  }, [forceExpanded]);

  // Format date nicely: e.g. "Tuesday, Aug 18, 2026"
  const formatDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Count non-empty drills
  const validDrills = log.drills.filter((d) => d && d.trim().length > 0);
  const filledDrillsCount = validDrills.length;
  const firstDrill = validDrills[0] || 'No drills logged';

  // Tagged partners list
  const teammates = log.taggedTeammates || (log.taggedPartners ? log.taggedPartners.map((p) => ({ name: p, sparred: true, drilledWith: true })) : []);
  const videos = log.youtubeVideos || [];

  return (
    <article
      id={`log-card-${log.id}`}
      className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden"
    >
      {/* Top Header Strip - Clickable to toggle expand */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 sm:p-4 border-b border-neutral-100 bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors cursor-pointer select-none"
      >
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Class Number & Date */}
          <div className="flex items-center gap-3">
            <div className="bg-neutral-900 text-white rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 flex flex-col items-center justify-center min-w-[52px] sm:min-w-[58px] shadow-2xs">
              <span className="text-[9px] uppercase font-bold text-amber-300 tracking-wider">
                Class
              </span>
              <span className="font-display font-bold text-base sm:text-lg leading-none">
                #{log.classNumber}
              </span>
            </div>

            <div>
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  {formatDate(log.date)}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                    log.gear === 'Gi'
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : log.gear === 'No-Gi'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      : 'bg-purple-100 text-purple-900 border border-purple-200'
                  }`}
                >
                  {log.gear === 'Gi' && '🥋 Gi'}
                  {log.gear === 'No-Gi' && '🩳 No-Gi'}
                  {log.gear === 'Open Mat' && '⏳ Open Mat'}
                </span>
                {teammates.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    <Users className="w-3 h-3 text-amber-700" />
                    <span>{teammates.length} {teammates.length === 1 ? 'Partner' : 'Partners'}</span>
                  </span>
                )}
                {videos.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-900 border border-red-200">
                    <Youtube className="w-3 h-3 text-red-600" />
                    <span>{videos.length} {videos.length === 1 ? 'Video' : 'Videos'}</span>
                  </span>
                )}
                {log.photos && log.photos.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                    <Camera className="w-3 h-3 text-neutral-600" />
                    <span>{log.photos.length}</span>
                  </span>
                )}
              </div>
              {log.coach && log.coach.trim().length > 0 && (
                <p className="text-xs text-neutral-500 font-medium flex items-center gap-1 mt-0.5">
                  <User className="w-3 h-3 text-neutral-400" />
                  Coach: <span className="font-semibold text-neutral-700">{log.coach}</span>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onPrintPreview(log)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
              title="Print / View Clean Drill Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDuplicate(log)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
              title="Duplicate / Reuse as Template"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(log)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
              title="Edit Log"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(log.id)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete Log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer ml-0.5"
              title={isExpanded ? 'Collapse card' : 'Expand full details'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-neutral-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-700" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsed Compact Summary Teaser */}
        {!isExpanded && (
          <div className="mt-2 pt-2 border-t border-neutral-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-700 truncate max-w-xl">
              <span className="font-bold text-neutral-900">Drills ({filledDrillsCount}/5):</span>
              <span className="truncate text-neutral-600 font-medium">
                {firstDrill} {filledDrillsCount > 1 && `(+${filledDrillsCount - 1} more)`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400 shrink-0">
              {teammates.length > 0 && (
                <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                  👥 {teammates.map((t) => t.name).slice(0, 2).join(', ')}{teammates.length > 2 ? ` +${teammates.length - 2}` : ''}
                </span>
              )}
              {log.submissionsGot && (
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                  🎯 {log.submissionsGot.split(',')[0]}
                </span>
              )}
              <span className="text-neutral-500 font-semibold hover:underline">
                Expand Details ↓
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Body - When Expanded */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4 animate-in fade-in-50 duration-150">
          {/* Section: TAGGED TRAINING PARTNERS & TEAMMATES */}
          {teammates.length > 0 && (
            <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/80">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  <span>Tagged Training & Sparring Partners ({teammates.length})</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {teammates.map((partner, idx) => {
                  const badgeColors = getBeltBadgeColor(partner.beltRank);
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-amber-300/80 rounded-xl px-2.5 py-1.5 flex items-center gap-2 shadow-2xs"
                    >
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${badgeColors.bg} ${badgeColors.text} ${badgeColors.border} border`}
                      >
                        {partner.beltRank || 'Belt'}
                      </span>
                      <span className="text-xs font-bold text-neutral-900">
                        {partner.name}
                      </span>

                      {partner.sparred && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-0.5">
                          <Swords className="w-2.5 h-2.5" />
                          <span>Sparred</span>
                        </span>
                      )}
                      {partner.drilledWith && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-0.5">
                          <Handshake className="w-2.5 h-2.5" />
                          <span>Drilled</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: 5 DRILLS OF THE DAY */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Drills & Techniques of the Day ({filledDrillsCount}/5)
              </span>
            </div>

            <ol className="space-y-2">
              {log.drills.map((drillText, idx) => {
                const detail = log.drillDetails?.[idx];
                const hasDrill = drillText && drillText.trim().length > 0;
                // Find matching video for this drill
                const matchingVideo = videos.find((v) => v.drillNumber === idx + 1);

                return (
                  <li
                    key={idx}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs transition-colors ${
                      hasDrill
                        ? 'bg-neutral-50/80 border border-neutral-200/80'
                        : 'bg-neutral-50/30 border border-dashed border-neutral-200 text-neutral-400'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-display font-bold shrink-0 text-[11px] mt-0.5 ${
                        hasDrill
                          ? 'bg-neutral-900 text-amber-300'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <p
                          className={`font-semibold ${
                            hasDrill ? 'text-neutral-900' : 'text-neutral-400 italic'
                          }`}
                        >
                          {hasDrill ? drillText : `Line ${idx + 1} (No drill logged)`}
                        </p>

                        {matchingVideo && (
                          <button
                            type="button"
                            onClick={() => setSelectedVideo({ url: matchingVideo.url, title: matchingVideo.title })}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded cursor-pointer transition-colors"
                          >
                            <Youtube className="w-3 h-3 text-red-600" />
                            <span>Watch Drill Visual</span>
                          </button>
                        )}
                      </div>
                      {detail?.keyDetails && (
                        <p className="text-[11px] text-neutral-500 font-normal mt-0.5">
                          💡 {detail.keyDetails}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Section: YOUTUBE DRILL & SPARRING VIDEOS */}
          {videos.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>YouTube Drill Visuals & Sparring Footage ({videos.length})</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videos.map((vid) => {
                  const videoId = vid.videoId || extractYouTubeVideoId(vid.url) || '';
                  const thumb = videoId ? getYouTubeThumbnailUrl(videoId) : '';

                  return (
                    <div
                      key={vid.id}
                      className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 text-white shadow-sm flex flex-col justify-between group"
                    >
                      <div
                        className="relative aspect-16/9 bg-black overflow-hidden cursor-pointer"
                        onClick={() => setSelectedVideo({ url: vid.url, title: vid.title })}
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={vid.title || 'Video'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-95"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600">
                            <Youtube className="w-12 h-12 text-neutral-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                          <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-white" />
                          </div>
                        </div>

                        {vid.drillNumber && (
                          <div className="absolute top-2 left-2 bg-neutral-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            Drill #{vid.drillNumber} Visual
                          </div>
                        )}

                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Youtube className="w-2.5 h-2.5 text-red-500" />
                          <span>YouTube</span>
                        </div>
                      </div>

                      <div className="p-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {vid.title || 'Technique Breakdown'}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {vid.category || 'Visual Reference'}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedVideo({ url: vid.url, title: vid.title })}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                        >
                          <Play className="w-3 h-3 text-red-400" />
                          <span>Play</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: ATTACHED MAT PHOTOS */}
          {log.photos && log.photos.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Attached Mat Photos & Whiteboard Notes ({log.photos.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {log.photos.map((photo, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative aspect-4/3 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-2xs hover:shadow-sm cursor-pointer"
                  >
                    <img
                      src={photo}
                      alt={`Mat Photo ${pIdx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-amber-400" />
                      <span>{log.date}</span>
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-5 h-5 drop-shadow" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: SUBMISSIONS & EXTRAS */}
          {(log.submissionsGot || log.submissionsDefended || log.sparringNotes || log.personalNotes) && (
            <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Submissions Got */}
              {log.submissionsGot && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-xs">
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                    <Flame className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Submissions Landed</span>
                  </div>
                  <p className="text-emerald-950 font-medium">{log.submissionsGot}</p>
                </div>
              )}

              {/* Submissions Defended */}
              {log.submissionsDefended && (
                <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5 text-xs">
                  <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-900 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Defense / Caught In</span>
                  </div>
                  <p className="text-rose-950 font-medium">{log.submissionsDefended}</p>
                </div>
              )}

              {/* Sparring Notes */}
              {log.sparringNotes && (
                <div className="bg-neutral-50 border border-neutral-200/70 rounded-xl p-2.5 text-xs sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                    Live Sparring & Rounds
                  </span>
                  <p className="text-neutral-800 font-medium">{log.sparringNotes}</p>
                </div>
              )}

              {/* Personal Notes */}
              {log.personalNotes && (
                <div className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-2.5 text-xs sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                    Personal Notes & Extra Insights
                  </span>
                  <p className="text-neutral-800 whitespace-pre-wrap leading-relaxed">
                    {log.personalNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lightbox Photo Viewer */}
      <ImageLightboxModal
        imageUrl={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* YouTube Video Player Modal */}
      {selectedVideo && (
        <YouTubeVideoModal
          videoUrl={selectedVideo.url}
          videoTitle={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </article>
  );
};
