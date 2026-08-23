import React, { useState } from 'react';
import { MatPhotoItem, BjjLogEntry } from '../types';
import {
  Camera,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Calendar,
  Eye,
  Plus,
  Sparkles,
  Layers,
  ExternalLink
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';

interface MatPhotosSectionProps {
  standalonePhotos: MatPhotoItem[];
  logs: BjjLogEntry[];
  onOpenFullGallery: () => void;
  onSaveStandalonePhotos: (photos: MatPhotoItem[]) => void;
  onPreviewPhoto: (url: string) => void;
}

export const MatPhotosSection: React.FC<MatPhotosSectionProps> = ({
  standalonePhotos = [],
  logs = [],
  onOpenFullGallery,
  onSaveStandalonePhotos,
  onPreviewPhoto
}) => {
  const [isSectionExpanded, setIsSectionExpanded] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  // Combine and sort recent photos
  const allPhotos = React.useMemo(() => {
    const combined: MatPhotoItem[] = [...standalonePhotos];

    logs.forEach((log) => {
      if (log.photos && log.photos.length > 0) {
        log.photos.forEach((photoUrl, idx) => {
          const exists = combined.some((p) => p.url === photoUrl);
          if (!exists) {
            combined.push({
              id: `log-${log.id}-${idx}`,
              url: photoUrl,
              date: log.date || new Date().toISOString().split('T')[0],
              caption: `Class #${log.classNumber || ''} • ${log.gear}`,
              classLogId: log.id,
              createdAt: log.createdAt || Date.now()
            });
          }
        });
      }
    });

    return combined.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || a.createdAt;
      const dateB = new Date(b.date).getTime() || b.createdAt;
      return dateB - dateA;
    });
  }, [standalonePhotos, logs]);

  const handleCapturePhoto = (dataUrl: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newPhoto: MatPhotoItem = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      url: dataUrl,
      date: today,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      caption: 'Mat & Whiteboard Snapshot',
      createdAt: Date.now()
    };
    onSaveStandalonePhotos([newPhoto, ...standalonePhotos]);
    setIsCameraOpen(false);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all">
      {/* Expandable Section Header */}
      <div
        id="btn-toggle-mat-photos-section"
        onClick={() => setIsSectionExpanded(!isSectionExpanded)}
        className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50/80 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-sm shadow-2xs">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-900">
                Mat Photos & Whiteboard Notes
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-full border border-neutral-200">
                {allPhotos.length} {allPhotos.length === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium hidden sm:block">
              Auto-dated technique whiteboards, drill notes & mat snapshots
            </p>
          </div>
        </div>

        {/* Action / Toggle buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenFullGallery();
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
          >
            <span>Full Gallery</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            type="button"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 transition-colors"
            title={isSectionExpanded ? 'Collapse mat photos' : 'Expand mat photos'}
          >
            {isSectionExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isSectionExpanded && (
        <div className="p-3.5 sm:p-4 border-t border-neutral-100 bg-neutral-50/50 space-y-3">
          {/* Quick Capture Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Recent Auto-Dated Snapshots
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-quick-mat-camera"
                onClick={() => setIsCameraOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Snap New Photo</span>
              </button>
            </div>
          </div>

          {/* Photos Horizontal / Grid Strip */}
          {allPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {allPhotos.slice(0, 6).map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => onPreviewPhoto(photo.url)}
                  className="group relative aspect-4/3 rounded-xl overflow-hidden border border-neutral-200 hover:border-neutral-900 bg-neutral-100 cursor-pointer shadow-2xs hover:shadow-xs transition-all"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Mat snapshot'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-1 left-1 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-amber-400" />
                    <span>{formatDateDisplay(photo.date)}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye className="w-4 h-4 drop-shadow" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-white border border-dashed border-neutral-200 rounded-xl">
              <p className="text-xs font-semibold text-neutral-700">
                No mat photos or whiteboard notes captured yet.
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Take a quick snapshot from your device to automatically date-stamp and organize gym whiteboards.
              </p>
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Snap Whiteboard</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={handleCapturePhoto}
      />
    </section>
  );
};
