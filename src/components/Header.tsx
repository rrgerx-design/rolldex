import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PlusCircle,
  Download,
  Award,
  Bell,
  Target,
  Building2,
  User,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { RollDexLogo } from './RollDexLogo';
import { BjjThemeId, BjjRankProfile, UserProfile } from '../types';
import { ALL_BELTS } from '../data/ranks';
import { 
  HeaderBackgroundConfig, 
  DEFAULT_HEADER_CONFIG, 
  HEADER_PRESETS 
} from '../data/headerPresets';
import { HeaderBackgroundModal } from './HeaderBackgroundModal';

interface HeaderProps {
  onNewLogClick: () => void;
  onExportClick: () => void;
  onImportClick: () => void;
  onMyRankClick: () => void;
  onAboutClick: () => void;
  onFuturePlanClick: () => void;
  onDailyReminderClick: () => void;
  onLineageClick: () => void;
  onProfileClick: () => void;
  onMatPhotosClick: () => void;
  userProfile: UserProfile | null;
  currentAcademyName?: string;
  reminderEnabled?: boolean;
  totalLogs: number;
  totalPhotos?: number;
  currentTheme: BjjThemeId;
  onSelectTheme: (theme: BjjThemeId) => void;
  rankProfile: BjjRankProfile;
}

const HEADER_BG_STORAGE_KEY = 'rolldex_header_bg_v2';

export const Header: React.FC<HeaderProps> = ({
  onNewLogClick,
  onExportClick,
  onImportClick,
  onMyRankClick,
  onAboutClick,
  onFuturePlanClick,
  onDailyReminderClick,
  onLineageClick,
  onProfileClick,
  onMatPhotosClick,
  userProfile,
  currentAcademyName,
  reminderEnabled = true,
  totalLogs,
  totalPhotos = 0,
  currentTheme,
  onSelectTheme,
  rankProfile
}) => {
  const currentBelt =
    ALL_BELTS.find((b) => b.id === rankProfile.rankId) || ALL_BELTS[0];

  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [bgConfig, setBgConfig] = useState<HeaderBackgroundConfig>(() => {
    try {
      const saved = localStorage.getItem(HEADER_BG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      }
    } catch (e) {
      console.error('Failed to load header background config', e);
    }
    return DEFAULT_HEADER_CONFIG;
  });

  const handleSaveBgConfig = (newConfig: HeaderBackgroundConfig) => {
    setBgConfig(newConfig);
    try {
      localStorage.setItem(HEADER_BG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to save header background config', e);
    }
  };

  // Resolve background image
  const getHeaderImage = () => {
    if (bgConfig.type === 'none') return null;
    if (bgConfig.type === 'custom' && bgConfig.customUrl) return bgConfig.customUrl;
    const preset = HEADER_PRESETS.find((p) => p.id === bgConfig.presetId) || HEADER_PRESETS[0];
    return preset?.imageUrl || HEADER_PRESETS[0].imageUrl;
  };

  const headerImageUrl = getHeaderImage();

  return (
    <>
      <header className="sticky top-0 z-30 relative border-b border-amber-950/40 shadow-xl transition-all duration-300 bg-neutral-950 text-white">
        {/* Panoramic Background Photo / Authentic BJJ Dojo Canvas with Brazil & US Flags and Belts */}
        {headerImageUrl && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            <img
              src={headerImageUrl}
              alt="Brazilian Jiu-Jitsu Heritage Dojo Banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {/* Subtle Gradient Vignette to ensure buttons & text pop while keeping BJJ dojo, flags & belts visibly clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
          </div>
        )}

        {/* Top Control Bar: RollDex Logo on the FAR LEFT in direct line with the Change Header Photo button on the FAR RIGHT */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-1.5 pb-1 relative z-20 flex items-center justify-between gap-2">
          {/* RollDex Logo Button on FAR TOP LEFT */}
          <button
            id="btn-header-rolldex-logo"
            onClick={onAboutClick}
            className="hover:opacity-95 hover:scale-[1.01] transition-all cursor-pointer text-left bg-neutral-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 shadow-xs flex items-center gap-2"
            title="RollDex: BJJ Training Log & Journal (About & System Info)"
          >
            <RollDexLogo size="sm" />
            <span className="font-extrabold tracking-wider uppercase text-amber-400 text-[9px] sm:text-[10px] drop-shadow-xs hidden md:inline-block border-l border-white/20 pl-2">
              🥋 BJJ TRAINING LOG
            </span>
          </button>

          {/* Compressed FAR TOP RIGHT CORNER BUTTON TO CHANGE HEADER PHOTO */}
          <button
            id="btn-change-header-photo"
            onClick={() => setIsBgModalOpen(true)}
            className="ml-auto px-2 py-0.5 rounded-full bg-black/80 hover:bg-black text-amber-300 hover:text-amber-100 text-[10px] font-medium flex items-center gap-1 shadow-2xs backdrop-blur-xs border border-amber-400/40 transition-all hover:scale-102 active:scale-95 cursor-pointer shrink-0"
            title="Change Header Background Photo"
          >
            <Camera className="w-2.5 h-2.5 text-amber-400 shrink-0" />
            <span>Photo</span>
          </button>
        </div>

        {/* Main Header Action & Navigation Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-0.5 pb-2 relative z-10 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Navigation, Profile, Lineage, Mat Photos, Future Plan & Tools positioned on the bottom-left under RollDex logo */}
          <div className="flex items-center flex-wrap gap-1.5 justify-start">
            {/* Practitioner Profile Button */}
            <button
              id="btn-practitioner-profile-header"
              onClick={onProfileClick}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-md border border-white/25 bg-neutral-900/90 hover:bg-neutral-800 text-white backdrop-blur-md transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Practitioner Profile: Name, DOB, Email"
            >
              <User className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-none">
                {userProfile && (userProfile.firstName || userProfile.lastName)
                  ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
                  : 'Profile'}
              </span>
            </button>

            {/* LINEAGE & ACADEMIES BUTTON */}
            <button
              id="btn-lineage-academies-header"
              onClick={onLineageClick}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-md border border-white/25 bg-neutral-900/90 hover:bg-neutral-800 text-white backdrop-blur-md transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Lineage & Academies: Manage current academy, past gym history, and master lineage tree"
            >
              <Building2 className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Lineage & Academies</span>
              {currentAcademyName && (
                <span className="hidden xl:inline text-[9px] bg-neutral-800 text-amber-300 px-1 py-0.2 rounded font-mono truncate max-w-[110px] border border-white/10">
                  {currentAcademyName}
                </span>
              )}
            </button>

            {/* MAT PHOTOS BUTTON */}
            <button
              id="btn-mat-photos-header"
              onClick={onMatPhotosClick}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-md border border-white/25 bg-neutral-900/90 hover:bg-neutral-800 text-white backdrop-blur-md transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Mat Photos & Whiteboards: View, snap and auto-date gym whiteboard photos"
            >
              <Camera className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Mat Photos</span>
              {totalPhotos > 0 && (
                <span className="text-[9px] font-bold px-1 py-0.1 bg-amber-400 text-neutral-950 rounded-full">
                  {totalPhotos}
                </span>
              )}
            </button>

            {/* Future Plan Button */}
            <button
              id="btn-future-plan-header"
              onClick={onFuturePlanClick}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] font-semibold rounded-md border border-white/25 bg-neutral-900/90 hover:bg-neutral-800 text-white backdrop-blur-md transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Future Promotion Goals & Milestones Roadmap"
            >
              <Target className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Future Plan</span>
            </button>

            {/* Daily 24h Reminder Bell Button */}
            <button
              id="btn-daily-reminder-header"
              onClick={onDailyReminderClick}
              className={`relative inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md border backdrop-blur-md transition-all shadow-2xs cursor-pointer active:scale-95 ${
                reminderEnabled
                  ? 'border-amber-400/40 bg-amber-950/70 text-amber-300 hover:bg-amber-900/70'
                  : 'border-white/20 bg-neutral-900/80 text-neutral-400 hover:bg-neutral-800'
              }`}
              title="Configure 24-Hour Daily Reminder Notifications"
            >
              <Bell className="w-3 h-3 text-amber-400 shrink-0" />
              {reminderEnabled && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-neutral-950 animate-pulse" />
              )}
              <span className="hidden lg:inline">24h Reminder</span>
            </button>

            {/* My Rank Button (Belt Color Circle Swatch + Optional Stripes) */}
            <button
              id="btn-my-rank-header"
              onClick={onMyRankClick}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold rounded-md border border-white/25 bg-neutral-900/90 hover:bg-neutral-800 text-white backdrop-blur-md transition-all shadow-2xs cursor-pointer active:scale-95 group"
              title={`My Rank: ${currentBelt.name}${rankProfile.stripes > 0 ? ` (${rankProfile.stripes} Stripes)` : ''} • Click to configure rank & themes`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs shrink-0 relative overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: currentBelt.primaryColor }}
              >
                {currentBelt.secondaryColor && (
                  <span
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1"
                    style={{ backgroundColor: currentBelt.secondaryColor }}
                  />
                )}
              </span>
              {rankProfile.stripes > 0 && (
                <span className="text-[10px] font-bold text-amber-400 font-mono tracking-tighter">
                  {rankProfile.stripes}★
                </span>
              )}
            </button>

            {/* Export Backup Button */}
            <button
              id="btn-export-logs"
              onClick={onExportClick}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md text-neutral-300 bg-neutral-900/90 hover:bg-neutral-800 border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
              title="Export / Backup Logs"
            >
              <Download className="w-3 h-3" />
              <span className="hidden 2xl:inline">Backup</span>
            </button>
          </div>

          {/* Right: Primary CTA Log Class button on bottom right */}
          <div className="flex items-center ml-auto shrink-0">
            <button
              id="btn-new-log"
              onClick={onNewLogClick}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold rounded-md text-neutral-950 bg-amber-400 hover:bg-amber-300 shadow-sm transition-all cursor-pointer active:scale-95 border border-amber-300"
            >
              <PlusCircle className="w-3.5 h-3.5 text-neutral-950" />
              <span>Log Class</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal to customize header background */}
      <HeaderBackgroundModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        config={bgConfig}
        onSaveConfig={handleSaveBgConfig}
      />
    </>
  );
};
