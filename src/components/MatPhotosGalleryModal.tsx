import React, { useState, useRef, useMemo } from 'react';
import { MatPhotoItem, BjjLogEntry } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  X,
  Camera,
  Image as ImageIcon,
  Calendar,
  Clock,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Sparkles,
  Tag
} from 'lucide-react';

interface MatPhotosGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  standalonePhotos: MatPhotoItem[];
  onSaveStandalonePhotos: (photos: MatPhotoItem[]) => void;
  logs: BjjLogEntry[];
  onPreviewPhoto: (url: string) => void;
}

export const MatPhotosGalleryModal: React.FC<MatPhotosGalleryModalProps> = ({
  isOpen,
  onClose,
  standalonePhotos = [],
  onSaveStandalonePhotos,
  logs = [],
  onPreviewPhoto
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterDate, setSelectedFilterDate] = useState<string>('all');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [customCaptureDate, setCustomCaptureDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine standalone photos and class-log photos with automatic date stamping
  const allPhotos = useMemo(() => {
    const combined: MatPhotoItem[] = [...standalonePhotos];

    // Also pull photos from class logs that might not be in standalone list
    logs.forEach((log) => {
      if (log.photos && log.photos.length > 0) {
        log.photos.forEach((photoUrl, idx) => {
          // Avoid duplicate if already tracked
          const exists = combined.some((p) => p.url === photoUrl);
          if (!exists) {
            combined.push({
              id: `log-${log.id}-${idx}`,
              url: photoUrl,
              date: log.date || new Date().toISOString().split('T')[0],
              caption: `Class #${log.classNumber || ''} • ${log.gear} • Coach ${log.coach || 'N/A'}`.trim(),
              classLogId: log.id,
              createdAt: log.createdAt || Date.now()
            });
          }
        });
      }
    });

    // Sort newest date first
    return combined.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || a.createdAt;
      const dateB = new Date(b.date).getTime() || b.createdAt;
      return dateB - dateA;
    });
  }, [standalonePhotos, logs]);

  // Unique dates for filter tabs
  const uniqueDates = useMemo(() => {
    const dates = new Set<string>();
    allPhotos.forEach((p) => {
      if (p.date) dates.add(p.date);
    });
    return Array.from(dates).sort().reverse();
  }, [allPhotos]);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return allPhotos.filter((item) => {
      const matchesDate =
        selectedFilterDate === 'all' || item.date === selectedFilterDate;
      const matchesQuery =
        !searchQuery.trim() ||
        (item.caption &&
          item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.date && item.date.includes(searchQuery));
      return matchesDate && matchesQuery;
    });
  }, [allPhotos, selectedFilterDate, searchQuery]);

  if (!isOpen) return null;

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const addPhotoWithAutomaticDate = (url: string) => {
    const dateToUse = customCaptureDate || new Date().toISOString().split('T')[0];
    const newPhoto: MatPhotoItem = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      url,
      date: dateToUse,
      time: getFormattedTime(),
      caption: newPhotoCaption.trim() || undefined,
      createdAt: Date.now()
    };

    onSaveStandalonePhotos([newPhoto, ...standalonePhotos]);
    setNewPhotoCaption('');
  };

  const processAndUploadFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result as string;
      if (!rawUrl) return;

      // Compress client-side
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            const scale = maxDim / width;
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          } else {
            const scale = maxDim / height;
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          addPhotoWithAutomaticDate(compressed);
        } else {
          addPhotoWithAutomaticDate(rawUrl);
        }
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      processAndUploadFile(file);
    });

    e.target.value = '';
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = standalonePhotos.filter((p) => p.id !== photoId);
    onSaveStandalonePhotos(updated);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'No Date';
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="modal-mat-photos-gallery"
        className="bg-white border-2 border-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-xs border border-amber-500">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-neutral-900 uppercase tracking-tight">
                  Mat Photos & Whiteboard Gallery
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-full border border-neutral-200">
                  {allPhotos.length} {allPhotos.length === 1 ? 'Photo' : 'Photos'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Snap or upload gym whiteboards, drills, and training memories — saved automatically with dates.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          {/* Quick Capture & Upload Bar */}
          <div className="p-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Snap New Mat Photo (Auto-Dated)</span>
              </span>

              {/* Automatic Date Selector / Confirmation */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-700 bg-white px-2.5 py-1 rounded-lg border border-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="text-[11px] font-bold text-neutral-500">Auto Date:</span>
                <input
                  type="date"
                  value={customCaptureDate}
                  onChange={(e) => setCustomCaptureDate(e.target.value)}
                  className="text-xs font-bold text-neutral-900 bg-transparent focus:outline-none cursor-pointer"
                  title="Date stamped on photos"
                />
              </div>
            </div>

            {/* Optional Caption Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Optional caption / technique note (e.g. Berimbolo sweep whiteboard notes)"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl pl-8 pr-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-gallery-camera"
                  onClick={() => setIsCameraOpen(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Take Photo</span>
                </button>

                <button
                  type="button"
                  id="btn-gallery-upload"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 border border-amber-500 text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <ImageIcon className="w-4 h-4 text-neutral-950" />
                  <span>Upload Files</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Search & Filter Controls */}
          {allPhotos.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Search photos by date or caption..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>

              {/* Date Filter Pills */}
              {uniqueDates.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-md">
                  <button
                    onClick={() => setSelectedFilterDate('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      selectedFilterDate === 'all'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    All Dates ({allPhotos.length})
                  </button>
                  {uniqueDates.slice(0, 5).map((dateStr) => (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedFilterDate(dateStr)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                        selectedFilterDate === dateStr
                          ? 'bg-amber-400 text-neutral-950 font-bold border border-amber-500'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {formatDateDisplay(dateStr)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Photos Grid */}
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group bg-neutral-50 rounded-2xl border-2 border-neutral-200 hover:border-neutral-900 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Photo Canvas / Preview */}
                  <div className="relative aspect-4/3 bg-neutral-900 overflow-hidden cursor-pointer">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Mat photo'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onClick={() => onPreviewPhoto(photo.url)}
                    />

                    {/* Automatic Date Badge in Top Corner */}
                    <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-white/10 shadow-xs">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{formatDateDisplay(photo.date)}</span>
                      {photo.time && (
                        <span className="text-neutral-400 font-normal">
                          • {photo.time}
                        </span>
                      )}
                    </div>

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onPreviewPhoto(photo.url)}
                        className="p-2 rounded-xl bg-white text-neutral-900 hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
                        title="View Fullscreen Lightbox"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {!photo.classLogId && (
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Photo Card Footer with Caption & Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {photo.caption ? (
                        <p className="text-xs font-semibold text-neutral-900 line-clamp-2">
                          {photo.caption}
                        </p>
                      ) : (
                        <p className="text-xs italic text-neutral-400">
                          Mat Snapshot
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200/80 mt-2 text-[10px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>Saved {formatDateDisplay(photo.date)}</span>
                      </span>
                      {photo.classLogId ? (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                          Class Log
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-neutral-200 text-neutral-700 rounded font-medium">
                          Quick Snap
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-3">
                <Camera className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-display font-bold text-base text-neutral-900 uppercase tracking-tight">
                No Mat Photos Saved Yet
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                Take snapshots of gym whiteboards, partner drills, or technique notes. Every photo is automatically saved with its capture date!
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Take First Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-900 text-xs font-bold hover:bg-neutral-50 transition-all cursor-pointer shadow-xs"
                >
                  <ImageIcon className="w-4 h-4 text-neutral-700" />
                  <span>Upload Files</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-neutral-500">
            🔒 All images are compressed and stored locally on your device with automatic timestamps.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close Gallery
          </button>
        </div>
      </div>

      {/* Built-in Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={(url) => {
          addPhotoWithAutomaticDate(url);
          setIsCameraOpen(false);
        }}
      />
    </div>
  );
};
