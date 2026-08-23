import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Trash2, Eye, Plus, X } from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  onPreviewPhoto: (url: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos = [],
  onChange,
  onPreviewPhoto
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAndAddFile = (file: File) => {
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
          onChange([...photos, compressed]);
        } else {
          onChange([...photos, rawUrl]);
        }
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoCaptured = (dataUrl: string) => {
    onChange([...photos, dataUrl]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      processAndAddFile(file);
    });

    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      {/* Hidden file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Compact Controls Row */}
      <div className="flex items-center flex-wrap gap-2">
        <button
          type="button"
          id="btn-add-photo-file"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold border border-neutral-300 transition-colors cursor-pointer active:scale-95"
        >
          <ImageIcon className="w-3.5 h-3.5 text-neutral-600" />
          <span>Add Photo</span>
        </button>

        <button
          type="button"
          id="btn-take-photo-camera"
          onClick={() => setIsCameraOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold border border-neutral-300 transition-colors cursor-pointer active:scale-95"
        >
          <Camera className="w-3.5 h-3.5 text-neutral-600" />
          <span>Camera</span>
        </button>

        {photos.length === 0 && (
          <span className="text-[11px] text-neutral-400">
            (Optional whiteboards / technique snapshots)
          </span>
        )}
      </div>

      {/* Compact Thumbnail Strip (only renders if photos exist) */}
      {photos.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 pt-1">
          {photos.map((photoUrl, idx) => (
            <div
              key={idx}
              className="group relative w-14 h-14 rounded-lg overflow-hidden border border-neutral-300 bg-neutral-100 shrink-0 shadow-2xs"
            >
              <img
                src={photoUrl}
                alt={`Attachment ${idx + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onPreviewPhoto(photoUrl)}
              />

              {/* Hover overlay with zoom & delete */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => onPreviewPhoto(photoUrl)}
                  className="p-1 rounded bg-white text-neutral-900 hover:bg-amber-300 transition-colors"
                  title="Enlarge"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Always visible tiny remove button on mobile / touch */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhoto(idx);
                }}
                className="absolute top-0.5 right-0.5 sm:hidden w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}

          {/* Quick Add More Plus Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-lg border border-dashed border-neutral-300 hover:border-neutral-900 text-neutral-400 hover:text-neutral-900 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer"
            title="Add another photo"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[9px] font-bold">Add</span>
          </button>
        </div>
      )}

      {/* Built-in Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={handlePhotoCaptured}
      />
    </div>
  );
};
