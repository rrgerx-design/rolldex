import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Link as LinkIcon,
  Camera,
  Trash2
} from 'lucide-react';
import { 
  HeaderBackgroundConfig, 
  HEADER_PRESETS, 
  DEFAULT_HEADER_CONFIG 
} from '../data/headerPresets';

interface HeaderBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: HeaderBackgroundConfig;
  onSaveConfig: (config: HeaderBackgroundConfig) => void;
}

export const HeaderBackgroundModal: React.FC<HeaderBackgroundModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [draftConfig, setDraftConfig] = useState<HeaderBackgroundConfig>({ ...config });
  const [customUrlInput, setCustomUrlInput] = useState(draftConfig.customUrl || '');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDraftConfig({ ...config });
      setCustomUrlInput(config.customUrl || '');
      setUploadError(null);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const getPreviewImage = (cfg: HeaderBackgroundConfig) => {
    if (cfg.type === 'none') return null;
    if (cfg.type === 'custom' && cfg.customUrl) return cfg.customUrl;
    const preset = HEADER_PRESETS.find(p => p.id === cfg.presetId) || HEADER_PRESETS[0];
    return preset?.imageUrl || HEADER_PRESETS[0].imageUrl;
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('File is too large. Please select a photo under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setDraftConfig(prev => ({
          ...prev,
          type: 'custom',
          customUrl: result
        }));
        setUploadError(null);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setDraftConfig(prev => ({
      ...prev,
      type: 'preset',
      presetId
    }));
  };

  const handleApplyUrl = () => {
    if (!customUrlInput.trim()) return;
    setDraftConfig(prev => ({
      ...prev,
      type: 'custom',
      customUrl: customUrlInput.trim()
    }));
  };

  const handleResetToDefault = () => {
    setDraftConfig({ ...DEFAULT_HEADER_CONFIG });
    setCustomUrlInput('');
    setUploadError(null);
  };

  const handleRemoveBackground = () => {
    setDraftConfig(prev => ({
      ...prev,
      type: 'none'
    }));
  };

  const handleSaveAndApply = () => {
    onSaveConfig(draftConfig);
    onClose();
  };

  const currentPreviewImg = getPreviewImage(draftConfig);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-neutral-900 text-white w-full max-w-3xl rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-800 bg-neutral-950/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white font-display">
                Header Panoramic Background
              </h2>
              <p className="text-xs text-neutral-400">
                Choose an authentic Brazilian Jiu-Jitsu mat theme or upload your own academy photo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="px-5 sm:px-6 pt-4 pb-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
            <span>Header Live Preview</span>
            {draftConfig.type === 'none' && (
              <span className="text-amber-400 font-bold">Solid Dark Background</span>
            )}
          </div>

          <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden border border-neutral-700 shadow-md flex items-center px-4 sm:px-6 justify-between bg-neutral-950">
            {currentPreviewImg ? (
              <img
                src={currentPreviewImg}
                alt="Header Preview"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-900" />
            )}

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

            {/* Mock Header Content */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                <span className="font-display font-black text-amber-400 text-lg">ROLL</span>
                <span className="font-display font-black text-white text-lg">DEX</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-amber-500 text-neutral-950 text-xs font-black rounded-lg shadow-sm">
                  + Log Session
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-800 px-5 sm:px-6 gap-2 pt-2 bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'presets' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>BJJ Dojo Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'upload' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`px-3 py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'url' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Photo Web URL</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* TAB 1: BJJ PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-semibold">
                  Brazilian Jiu-Jitsu Kimono &amp; Tatami Mat Header:
                </span>
                <button
                  onClick={handleRemoveBackground}
                  className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                    draftConfig.type === 'none'
                      ? 'bg-amber-500 text-neutral-950 border-amber-500'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-neutral-700'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>No Photo (Solid Color)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {HEADER_PRESETS.map((preset) => {
                  const isSelected = draftConfig.type === 'preset' && draftConfig.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`relative group rounded-xl overflow-hidden text-left border-2 transition-all p-0 flex flex-col cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg scale-[1.005]'
                          : 'border-neutral-700 hover:border-neutral-500 shadow-xs'
                      }`}
                    >
                      <div className="relative h-32 w-full overflow-hidden bg-neutral-950">
                        <img
                          src={preset.imageUrl}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-amber-500 text-neutral-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>SELECTED</span>
                          </div>
                        )}

                        <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-black/75 text-amber-300 backdrop-blur-xs border border-amber-400/20">
                          {preset.category}
                        </span>

                        <div className="absolute bottom-2 left-3 right-3 text-white">
                          <h4 className="font-bold text-sm sm:text-base drop-shadow-xs">{preset.name}</h4>
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-800/90 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD PHOTO */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                accept="image/*"
                className="hidden"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-amber-500 bg-amber-500/10 scale-[1.01]'
                    : 'border-neutral-700 hover:border-amber-500 bg-neutral-950/50 hover:bg-neutral-950'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Click to browse or drag & drop your photo
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm">
                    Upload your academy panoramic shot, team photo, or gym mats (JPG, PNG, WebP).
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 text-neutral-950 rounded-lg hover:bg-amber-400 transition-colors shadow-xs cursor-pointer"
                >
                  Select File
                </button>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-950/80 text-red-300 border border-red-800 rounded-lg text-xs font-medium">
                  {uploadError}
                </div>
              )}

              {draftConfig.type === 'custom' && draftConfig.customUrl && (
                <div className="p-3 bg-neutral-800 border border-amber-500/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-9 rounded-md overflow-hidden bg-neutral-950 shrink-0 border border-amber-400/40">
                      <img src={draftConfig.customUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Custom Academy Photo Loaded</span>
                      <span className="text-[10px] text-neutral-400">Ready to apply to your header</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDraftConfig(prev => ({
                        ...prev,
                        type: 'preset',
                        presetId: 'bjj-gi-tatami-kimono',
                        customUrl: ''
                      }));
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold px-2 py-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PHOTO URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                Direct Image Link (Web URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/my-bjj-academy-panorama.jpg"
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-950 border border-neutral-700 text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!customUrlInput.trim()}
                  className="px-4 py-2.5 bg-amber-500 text-neutral-950 text-xs sm:text-sm font-bold rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
                >
                  Load Image
                </button>
              </div>
              <p className="text-xs text-neutral-400">
                Paste any panoramic gym image link to use it as your header backdrop.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-4 bg-neutral-950/90 border-t border-neutral-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-neutral-400 hover:text-white font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset to Default Kimono</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-5 py-2 text-xs sm:text-sm font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400 rounded-lg shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer font-display"
            >
              <Check className="w-4 h-4" />
              <span>Apply Background</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
