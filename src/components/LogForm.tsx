import React, { useState, useEffect } from 'react';
import {
  BjjLogEntry,
  GearType,
  DrillItem,
  TaggedTeammate,
  VideoLinkItem
} from '../types';
import {
  COMMON_BJJ_TECHNIQUES,
  DRILL_CATEGORIES,
  POPULAR_COACHES
} from '../data/initialLogs';
import { PhotoUploader } from './PhotoUploader';
import { ImageLightboxModal } from './ImageLightboxModal';
import { PartnerTagger } from './PartnerTagger';
import { YouTubeLinkUploader } from './YouTubeLinkUploader';
import { YouTubeVideoModal } from './YouTubeVideoModal';
import {
  Calendar,
  Hash,
  User,
  CheckCircle2,
  X,
  Sparkles,
  Plus,
  Trash2,
  Flame,
  ShieldAlert,
  Edit3,
  BookmarkPlus,
  HelpCircle,
  Copy,
  Camera,
  History,
  Bookmark,
  Check,
  Users,
  Youtube
} from 'lucide-react';

const SAVED_COACHES_STORAGE_KEY = 'bytechoke_saved_coaches_v1';

interface LogFormProps {
  initialData?: BjjLogEntry | null;
  onSave: (log: BjjLogEntry) => void;
  onCancel: () => void;
  lastLog?: BjjLogEntry | null;
  allLogs?: BjjLogEntry[];
}

export const LogForm: React.FC<LogFormProps> = ({
  initialData,
  onSave,
  onCancel,
  lastLog,
  allLogs = []
}) => {
  // Get formatted today date (YYYY-MM-DD)
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Next suggested class number
  const getNextClassNumber = (): number | string => {
    if (initialData) return initialData.classNumber;
    if (lastLog && typeof lastLog.classNumber === 'number') {
      return lastLog.classNumber + 1;
    }
    if (lastLog && typeof lastLog.classNumber === 'string') {
      const parsed = parseInt(lastLog.classNumber, 10);
      if (!isNaN(parsed)) return parsed + 1;
    }
    return 1;
  };

  // Form states matching exact prompt requirements:
  // 1. Date & Class Number (across each other)
  const [date, setDate] = useState<string>(initialData?.date || getTodayStr());
  const [classNumber, setClassNumber] = useState<string | number>(
    initialData?.classNumber ?? getNextClassNumber()
  );

  // 2. Gi or No-Gi & Coach of the day (across each other)
  const [gear, setGear] = useState<GearType>(initialData?.gear || 'Gi');
  const [coach, setCoach] = useState<string>(
    initialData?.coach || (lastLog?.coach || '')
  );

  // Coach Log Memory state (persisted + extracted from past logs)
  const [savedCoaches, setSavedCoaches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_COACHES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved coach memory', e);
    }
    return POPULAR_COACHES;
  });

  // Dynamically compute all remembered coaches (from logs history + saved list)
  const rememberedCoaches = Array.from(
    new Set([
      ...savedCoaches,
      ...(allLogs
        .map((l) => l.coach?.trim())
        .filter((c): c is string => Boolean(c && c !== 'General Class'))),
      ...(lastLog?.coach?.trim() ? [lastLog.coach.trim()] : [])
    ])
  ).filter((c) => c.length > 0);

  // Helper to save a new coach to permanent memory
  const handleRememberCoach = (coachNameToSave: string) => {
    const trimmed = coachNameToSave.trim();
    if (!trimmed || savedCoaches.includes(trimmed)) return;
    const updated = [trimmed, ...savedCoaches];
    setSavedCoaches(updated);
    try {
      localStorage.setItem(SAVED_COACHES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save coach memory', e);
    }
  };

  const handleForgetCoach = (coachNameToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedCoaches.filter((c) => c !== coachNameToRemove);
    setSavedCoaches(updated);
    try {
      localStorage.setItem(SAVED_COACHES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove coach memory', e);
    }
  };

  // 3. Exactly 5 lines for five possible drills/moves
  const [drill1, setDrill1] = useState<string>(initialData?.drills[0] || '');
  const [drill2, setDrill2] = useState<string>(initialData?.drills[1] || '');
  const [drill3, setDrill3] = useState<string>(initialData?.drills[2] || '');
  const [drill4, setDrill4] = useState<string>(initialData?.drills[3] || '');
  const [drill5, setDrill5] = useState<string>(initialData?.drills[4] || '');

  // Detailed cues for each drill line (optional breakdown)
  const [cue1, setCue1] = useState<string>(initialData?.drillDetails?.[0]?.keyDetails || '');
  const [cue2, setCue2] = useState<string>(initialData?.drillDetails?.[1]?.keyDetails || '');
  const [cue3, setCue3] = useState<string>(initialData?.drillDetails?.[2]?.keyDetails || '');
  const [cue4, setCue4] = useState<string>(initialData?.drillDetails?.[3]?.keyDetails || '');
  const [cue5, setCue5] = useState<string>(initialData?.drillDetails?.[4]?.keyDetails || '');

  // 4. Extra lines for personal notes such as extras or submissions you got
  const [submissionsGot, setSubmissionsGot] = useState<string>(
    initialData?.submissionsGot || ''
  );
  const [submissionsDefended, setSubmissionsDefended] = useState<string>(
    initialData?.submissionsDefended || ''
  );
  const [sparringNotes, setSparringNotes] = useState<string>(
    initialData?.sparringNotes || ''
  );
  const [personalNotes, setPersonalNotes] = useState<string>(
    initialData?.personalNotes || ''
  );

  // 5. Photos / Whiteboard snaps / Camera pictures
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || []);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);

  // 6. Tagged Teammates / Classmates / Sparring Partners
  const [taggedTeammates, setTaggedTeammates] = useState<TaggedTeammate[]>(() => {
    if (initialData?.taggedTeammates && Array.isArray(initialData.taggedTeammates)) {
      return initialData.taggedTeammates;
    }
    if (initialData?.taggedPartners && Array.isArray(initialData.taggedPartners)) {
      return initialData.taggedPartners.map((p) => ({
        name: p,
        sparred: true,
        drilledWith: true
      }));
    }
    return [];
  });

  // 7. YouTube Video Links & Drill Visuals
  const [youtubeVideos, setYoutubeVideos] = useState<VideoLinkItem[]>(
    initialData?.youtubeVideos || []
  );
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title?: string } | null>(null);

  const [activeSuggestionLine, setActiveSuggestionLine] = useState<number | null>(null);

  // Quick helper to fill suggestions
  const handleApplyTechnique = (lineNum: number, moveName: string) => {
    if (lineNum === 1) setDrill1(moveName);
    if (lineNum === 2) setDrill2(moveName);
    if (lineNum === 3) setDrill3(moveName);
    if (lineNum === 4) setDrill4(moveName);
    if (lineNum === 5) setDrill5(moveName);
    setActiveSuggestionLine(null);
  };

  const handleCopyFromLastLog = () => {
    if (!lastLog) return;
    setGear(lastLog.gear);
    setCoach(lastLog.coach);
    setDrill1(lastLog.drills[0] || '');
    setDrill2(lastLog.drills[1] || '');
    setDrill3(lastLog.drills[2] || '');
    setDrill4(lastLog.drills[3] || '');
    setDrill5(lastLog.drills[4] || '');
    if (lastLog.taggedTeammates) {
      setTaggedTeammates(lastLog.taggedTeammates);
    }
  };

  const handleAddSubmissionToGot = (subName: string) => {
    if (!submissionsGot) {
      setSubmissionsGot(`1x ${subName}`);
    } else {
      setSubmissionsGot(`${submissionsGot}, 1x ${subName}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCoach = coach.trim() || 'General Class';
    if (finalCoach && finalCoach !== 'General Class') {
      handleRememberCoach(finalCoach);
    }

    const drillsArray: [string, string, string, string, string] = [
      drill1.trim(),
      drill2.trim(),
      drill3.trim(),
      drill4.trim(),
      drill5.trim()
    ];

    const drillDetails: DrillItem[] = [
      { number: 1, move: drill1.trim(), keyDetails: cue1.trim() },
      { number: 2, move: drill2.trim(), keyDetails: cue2.trim() },
      { number: 3, move: drill3.trim(), keyDetails: cue3.trim() },
      { number: 4, move: drill4.trim(), keyDetails: cue4.trim() },
      { number: 5, move: drill5.trim(), keyDetails: cue5.trim() }
    ];

    const newLog: BjjLogEntry = {
      id: initialData?.id || `bjj-log-${Date.now()}`,
      date: date || getTodayStr(),
      classNumber: classNumber || 1,
      gear,
      coach: finalCoach,
      drills: drillsArray,
      drillDetails,
      submissionsGot: submissionsGot.trim(),
      submissionsDefended: submissionsDefended.trim(),
      sparringNotes: sparringNotes.trim(),
      personalNotes: personalNotes.trim(),
      photos,
      taggedTeammates,
      taggedPartners: taggedTeammates.map((t) => t.name),
      youtubeVideos,
      createdAt: initialData?.createdAt || Date.now()
    };

    onSave(newLog);
  };

  return (
    <form
      id="bjj-log-form"
      onSubmit={handleSubmit}
      className="bg-white border-2 border-neutral-900 rounded-2xl shadow-lg p-5 sm:p-7 transition-all"
    >
      {/* Header bar of form */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-neutral-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-amber-400 flex items-center justify-center font-bold font-display">
            {initialData ? 'EDIT' : 'NEW'}
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-neutral-900">
              {initialData ? `Edit Class #${initialData.classNumber} Log` : 'Log BJJ Training Session'}
            </h2>
            <p className="text-xs text-neutral-500">
              Fill in your class details, drills executed, and submission notes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!initialData && lastLog && (
            <button
              type="button"
              id="btn-copy-last-log"
              onClick={handleCopyFromLastLog}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
              title="Prefill coach, gear, and techniques from previous class"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Previous Class</span>
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Close Form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: Line for DATE across another line for CLASS NUMBER            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-5">
        {/* Date Line */}
        <div className="bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200">
          <label
            htmlFor="input-log-date"
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-900" />
            <span>Date</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            id="input-log-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all shadow-2xs"
          />
        </div>

        {/* Class Number Line */}
        <div className="bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200">
          <label
            htmlFor="input-class-number"
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
          >
            <Hash className="w-3.5 h-3.5 text-neutral-900" />
            <span>Class Number</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-neutral-400 font-bold text-sm">
              #
            </span>
            <input
              id="input-class-number"
              type="text"
              required
              placeholder="e.g. 142"
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg pl-8 pr-3.5 py-2.5 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: Line for GI OR NO GI across another line for COACH OF THE DAY */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-7">
        {/* Gi or No-Gi Selection Line */}
        <div className="bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200 flex flex-col justify-between">
          <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
            <span>Attire (Gi / No-Gi / Open Mat)</span>
            <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Gi', 'No-Gi', 'Open Mat'] as GearType[]).map((type) => {
              const isSelected = gear === type;
              return (
                <button
                  key={type}
                  type="button"
                  id={`btn-gear-${type.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setGear(type)}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-neutral-900 text-amber-300 border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {type === 'Gi' && '🥋 Gi'}
                  {type === 'No-Gi' && '🩳 No-Gi'}
                  {type === 'Open Mat' && '⏳ Open Mat'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Coach of the Day Line with Log Memory Buttons */}
        <div className="bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-coach-name"
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 uppercase tracking-wider"
            >
              <User className="w-3.5 h-3.5 text-neutral-900" />
              <span>Coach of the Day</span>
            </label>
            <span className="text-[10px] text-neutral-400 font-medium">Instructor / Professor</span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              id="input-coach-name"
              type="text"
              placeholder="e.g. Coach, Professor, or enter name..."
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all shadow-2xs"
            />
            {coach.trim() && !rememberedCoaches.includes(coach.trim()) && (
              <button
                type="button"
                onClick={() => handleRememberCoach(coach)}
                className="shrink-0 px-2.5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                title="Save coach into quick-select memory"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remember</span>
              </button>
            )}
          </div>

          {/* Coach Log Memory Buttons */}
          {rememberedCoaches.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-neutral-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                  <History className="w-3 h-3 text-amber-600" />
                  <span>Your Coaches (Tap to select):</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {rememberedCoaches.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-0.5">
                {rememberedCoaches.map((c) => {
                  const isSelected = coach.toLowerCase().trim() === c.toLowerCase().trim();
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCoach(c)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 ${
                        isSelected
                          ? 'bg-neutral-900 text-amber-300 border-neutral-900 ring-2 ring-amber-400/40'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400'
                      }`}
                      title={`Select ${c}`}
                    >
                      {isSelected ? (
                        <Check className="w-3 h-3 text-amber-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-amber-600">🥋</span>
                      )}
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: 5 LINES FOR FIVE POSSIBLE DRILLS / MOVES                        */}
      {/* ========================================================================= */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
              5
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-900">
              5 Drills & Techniques of the Day
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-medium hidden sm:inline">
            5 distinct lines for your techniques & drills
          </span>
        </div>

        {/* Drill lines container */}
        <div className="space-y-3.5">
          {/* DRILL LINE 1 */}
          <div className="bg-neutral-50/90 rounded-xl p-3 border border-neutral-200 transition-all hover:border-neutral-400">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="input-drill-1"
                className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center text-[11px] font-display">
                  1
                </span>
                <span>Drill / Move 1</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setActiveSuggestionLine(activeSuggestionLine === 1 ? null : 1)
                }
                className="text-[11px] text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Move suggestions</span>
              </button>
            </div>
            <input
              id="input-drill-1"
              type="text"
              placeholder="e.g. De La Riva Guard to Overhead Balloon Sweep"
              value={drill1}
              onChange={(e) => setDrill1(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-2xs mb-1.5"
            />
            <input
              type="text"
              placeholder="Key cues or grips (e.g. Push far knee, pull sleeves to hips)"
              value={cue1}
              onChange={(e) => setCue1(e.target.value)}
              className="w-full bg-neutral-100/70 border border-neutral-200 rounded-md px-2.5 py-1 text-xs text-neutral-600 focus:bg-white focus:outline-none focus:border-neutral-400"
            />
            {activeSuggestionLine === 1 && (
              <div className="mt-2 p-2 bg-white rounded-lg border border-amber-200 shadow-xs">
                <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">
                  Quick Select Technique:
                </p>
                <div className="flex flex-wrap gap-1">
                  {COMMON_BJJ_TECHNIQUES.slice(0, 8).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleApplyTechnique(1, tech)}
                      className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 hover:bg-amber-100 text-neutral-800 hover:text-amber-950 font-medium transition-colors cursor-pointer"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DRILL LINE 2 */}
          <div className="bg-neutral-50/90 rounded-xl p-3 border border-neutral-200 transition-all hover:border-neutral-400">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="input-drill-2"
                className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center text-[11px] font-display">
                  2
                </span>
                <span>Drill / Move 2</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setActiveSuggestionLine(activeSuggestionLine === 2 ? null : 2)
                }
                className="text-[11px] text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Move suggestions</span>
              </button>
            </div>
            <input
              id="input-drill-2"
              type="text"
              placeholder="e.g. Knee-Cut Pass with Collar & Sleeve grip"
              value={drill2}
              onChange={(e) => setDrill2(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-2xs mb-1.5"
            />
            <input
              type="text"
              placeholder="Key cues or grips (e.g. Pin foot to mat, slide knee 45 degrees)"
              value={cue2}
              onChange={(e) => setCue2(e.target.value)}
              className="w-full bg-neutral-100/70 border border-neutral-200 rounded-md px-2.5 py-1 text-xs text-neutral-600 focus:bg-white focus:outline-none focus:border-neutral-400"
            />
            {activeSuggestionLine === 2 && (
              <div className="mt-2 p-2 bg-white rounded-lg border border-amber-200 shadow-xs">
                <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">
                  Quick Select Technique:
                </p>
                <div className="flex flex-wrap gap-1">
                  {COMMON_BJJ_TECHNIQUES.slice(4, 12).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleApplyTechnique(2, tech)}
                      className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 hover:bg-amber-100 text-neutral-800 hover:text-amber-950 font-medium transition-colors cursor-pointer"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DRILL LINE 3 */}
          <div className="bg-neutral-50/90 rounded-xl p-3 border border-neutral-200 transition-all hover:border-neutral-400">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="input-drill-3"
                className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center text-[11px] font-display">
                  3
                </span>
                <span>Drill / Move 3</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setActiveSuggestionLine(activeSuggestionLine === 3 ? null : 3)
                }
                className="text-[11px] text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Move suggestions</span>
              </button>
            </div>
            <input
              id="input-drill-3"
              type="text"
              placeholder="e.g. Back Take from Seatbelt Control"
              value={drill3}
              onChange={(e) => setDrill3(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-2xs mb-1.5"
            />
            <input
              type="text"
              placeholder="Key cues or grips (e.g. Chest to back, choke hand high under chin)"
              value={cue3}
              onChange={(e) => setCue3(e.target.value)}
              className="w-full bg-neutral-100/70 border border-neutral-200 rounded-md px-2.5 py-1 text-xs text-neutral-600 focus:bg-white focus:outline-none focus:border-neutral-400"
            />
            {activeSuggestionLine === 3 && (
              <div className="mt-2 p-2 bg-white rounded-lg border border-amber-200 shadow-xs">
                <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">
                  Quick Select Technique:
                </p>
                <div className="flex flex-wrap gap-1">
                  {COMMON_BJJ_TECHNIQUES.slice(8, 16).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleApplyTechnique(3, tech)}
                      className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 hover:bg-amber-100 text-neutral-800 hover:text-amber-950 font-medium transition-colors cursor-pointer"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DRILL LINE 4 */}
          <div className="bg-neutral-50/90 rounded-xl p-3 border border-neutral-200 transition-all hover:border-neutral-400">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="input-drill-4"
                className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center text-[11px] font-display">
                  4
                </span>
                <span>Drill / Move 4</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setActiveSuggestionLine(activeSuggestionLine === 4 ? null : 4)
                }
                className="text-[11px] text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Move suggestions</span>
              </button>
            </div>
            <input
              id="input-drill-4"
              type="text"
              placeholder="e.g. Bow & Arrow Choke from Back"
              value={drill4}
              onChange={(e) => setDrill4(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-2xs mb-1.5"
            />
            <input
              type="text"
              placeholder="Key cues or grips (e.g. Deep collar feed, pant leg hook, arch spine)"
              value={cue4}
              onChange={(e) => setCue4(e.target.value)}
              className="w-full bg-neutral-100/70 border border-neutral-200 rounded-md px-2.5 py-1 text-xs text-neutral-600 focus:bg-white focus:outline-none focus:border-neutral-400"
            />
            {activeSuggestionLine === 4 && (
              <div className="mt-2 p-2 bg-white rounded-lg border border-amber-200 shadow-xs">
                <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">
                  Quick Select Technique:
                </p>
                <div className="flex flex-wrap gap-1">
                  {COMMON_BJJ_TECHNIQUES.slice(14, 22).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleApplyTechnique(4, tech)}
                      className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 hover:bg-amber-100 text-neutral-800 hover:text-amber-950 font-medium transition-colors cursor-pointer"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DRILL LINE 5 */}
          <div className="bg-neutral-50/90 rounded-xl p-3 border border-neutral-200 transition-all hover:border-neutral-400">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="input-drill-5"
                className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-amber-300 flex items-center justify-center text-[11px] font-display">
                  5
                </span>
                <span>Drill / Move 5</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setActiveSuggestionLine(activeSuggestionLine === 5 ? null : 5)
                }
                className="text-[11px] text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Move suggestions</span>
              </button>
            </div>
            <input
              id="input-drill-5"
              type="text"
              placeholder="e.g. Single Leg Takedown or Defense Drill"
              value={drill5}
              onChange={(e) => setDrill5(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-2xs mb-1.5"
            />
            <input
              type="text"
              placeholder="Key cues or grips (e.g. Head inside on ribs, turn the corner)"
              value={cue5}
              onChange={(e) => setCue5(e.target.value)}
              className="w-full bg-neutral-100/70 border border-neutral-200 rounded-md px-2.5 py-1 text-xs text-neutral-600 focus:bg-white focus:outline-none focus:border-neutral-400"
            />
            {activeSuggestionLine === 5 && (
              <div className="mt-2 p-2 bg-white rounded-lg border border-amber-200 shadow-xs">
                <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">
                  Quick Select Technique:
                </p>
                <div className="flex flex-wrap gap-1">
                  {COMMON_BJJ_TECHNIQUES.slice(18).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => handleApplyTechnique(5, tech)}
                      className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 hover:bg-amber-100 text-neutral-800 hover:text-amber-950 font-medium transition-colors cursor-pointer"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: EXTRA LINES FOR PERSONAL NOTES & SUBMISSIONS                    */}
      {/* ========================================================================= */}
      <div className="space-y-4 mb-7">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
          <Edit3 className="w-4 h-4 text-neutral-900" />
          <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-900">
            Personal Notes & Submissions
          </h3>
        </div>

        {/* Submissions You Got / Landed */}
        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-submissions-got"
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider"
            >
              <Flame className="w-3.5 h-3.5 text-emerald-700" />
              <span>Submissions You Got (Landed)</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-medium">Finishes during live rolls</span>
          </div>
          <input
            id="input-submissions-got"
            type="text"
            placeholder="e.g. 1x Triangle choke from closed guard, 1x Armbar from mount..."
            value={submissionsGot}
            onChange={(e) => setSubmissionsGot(e.target.value)}
            className="w-full bg-white border border-emerald-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
          />

          {/* Quick Submissions Memory Buttons */}
          <div className="flex flex-wrap items-center gap-1 mt-2">
            <span className="text-[10px] text-emerald-800 font-bold uppercase mr-1">
              + Quick Add Sub:
            </span>
            {[
              'Triangle Choke',
              'Armbar',
              'Kimura',
              'Rear Naked Choke',
              'Guillotine',
              'Ezekiel',
              'Bow & Arrow',
              'Straight Ankle Lock',
              'Heel Hook',
              'Americana'
            ].map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => handleAddSubmissionToGot(sub)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100/80 hover:bg-emerald-200 text-emerald-950 font-semibold border border-emerald-300/60 transition-colors cursor-pointer"
              >
                + {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions Conceded / Defense Focus */}
        <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-200">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="input-submissions-defended"
              className="flex items-center gap-1.5 text-xs font-bold text-rose-950 uppercase tracking-wider"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
              <span>Submissions Caught In / Defense Notes</span>
            </label>
            <span className="text-[11px] text-rose-700 font-medium">Areas to tighten up</span>
          </div>
          <input
            id="input-submissions-defended"
            type="text"
            placeholder="e.g. Caught in Kimura from half guard; need to keep hands glued to chest"
            value={submissionsDefended}
            onChange={(e) => setSubmissionsDefended(e.target.value)}
            className="w-full bg-white border border-rose-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-rose-700 shadow-2xs"
          />
        </div>

        {/* Live Sparring & Rolling Rounds */}
        <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
          <label
            htmlFor="input-sparring-notes"
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5"
          >
            <span>Sparring & Roll Rounds</span>
          </label>
          <input
            id="input-sparring-notes"
            type="text"
            placeholder="e.g. 5x 5-min rounds with Marcus, Sam, Leo. Controlled pacing, focused on guard retention."
            value={sparringNotes}
            onChange={(e) => setSparringNotes(e.target.value)}
            className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-2xs"
          />
        </div>

        {/* Tag Training & Sparring Partners */}
        <PartnerTagger
          taggedTeammates={taggedTeammates}
          onChange={(newTeammates) => setTaggedTeammates(newTeammates)}
        />

        {/* YouTube Video Links / Visuals for Drills & Sparring */}
        <YouTubeLinkUploader
          videos={youtubeVideos}
          onChange={(newVideos) => setYoutubeVideos(newVideos)}
          onPreviewVideo={(url, title) => setPreviewVideo({ url, title })}
        />

        {/* Extra Lines for Personal Notes & Takeaways */}
        <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
          <label
            htmlFor="input-personal-notes"
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5"
          >
            <span>Extra Personal Notes & Key Takeaways</span>
          </label>
          <textarea
            id="input-personal-notes"
            rows={3}
            placeholder="e.g. Coach emphasized hip elevation before the sweep. Need to drill this 50 times on open mat this Saturday..."
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-2xs resize-y"
          />
        </div>

        {/* Compact Optional Photo Attachment Row */}
        <div className="pt-2 border-t border-neutral-200">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
            Attach Mat Photos / Whiteboards <span className="text-neutral-400 font-normal text-[11px]">(Optional)</span>
          </label>
          <PhotoUploader
            photos={photos}
            onChange={(newPhotos) => setPhotos(newPhotos)}
            onPreviewPhoto={(url) => setPreviewPhotoUrl(url)}
          />
        </div>
      </div>

      {/* Form Submission Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          id="btn-cancel-log"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          id="btn-save-log"
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{initialData ? 'Update Class Log' : 'Save Class Log'}</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        imageUrl={previewPhotoUrl}
        onClose={() => setPreviewPhotoUrl(null)}
      />

      {/* YouTube Video Player Modal */}
      {previewVideo && (
        <YouTubeVideoModal
          videoUrl={previewVideo.url}
          videoTitle={previewVideo.title}
          onClose={() => setPreviewVideo(null)}
        />
      )}
    </form>
  );
};

