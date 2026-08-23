import React from 'react';
import { X, Download, Shield } from 'lucide-react';

interface ImageLightboxModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  imageUrl,
  onClose
}) => {
  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[90vh] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700 flex flex-col"
      >
        {/* Top bar */}
        <div className="p-3 bg-neutral-950/80 flex items-center justify-between text-white border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider font-display">
              ByteChoke Mat Photo View
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download="bytechoke-mat-photo.jpg"
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Download Image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image container */}
        <div className="p-2 sm:p-4 flex items-center justify-center overflow-auto bg-black/90">
          <img
            src={imageUrl}
            alt="ByteChoke Mat snapshot"
            className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};
