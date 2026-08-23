import React, { useState, useEffect } from 'react';
import {
  BjjLogEntry,
  BjjThemeId,
  BjjRankProfile,
  FutureBjjPlan,
  NotificationReminderSettings,
  LineageAndAcademiesData,
  UserProfile,
  MatPhotoItem,
  CompetitionEntry
} from './types';
import { INITIAL_BJJ_LOGS } from './data/initialLogs';
import { BJJ_THEMES } from './data/themes';
import { DEFAULT_RANK_PROFILE, CREATOR_ATTRIBUTION, ALL_BELTS } from './data/ranks';
import { DEFAULT_FUTURE_PLAN } from './data/defaultPlan';
import { DEFAULT_LINEAGE_AND_ACADEMIES } from './data/defaultLineage';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { LogForm } from './components/LogForm';
import { LogList } from './components/LogList';
import { CompetitionTracker } from './components/CompetitionTracker';
import { PrintModal } from './components/PrintModal';
import { ExportImportModal } from './components/ExportImportModal';
import { MyRankModal } from './components/MyRankModal';
import { AboutLicenseModal } from './components/AboutLicenseModal';
import { FuturePlanModal } from './components/FuturePlanModal';
import { DailyReminderModal } from './components/DailyReminderModal';
import { LineageAcademiesModal } from './components/LineageAcademiesModal';
import { SignUpModal } from './components/SignUpModal';
import { MatPhotosGalleryModal } from './components/MatPhotosGalleryModal';
import { MatPhotosSection } from './components/MatPhotosSection';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { OnboardingTermsModal } from './components/OnboardingTermsModal';
import { LegalPdfModal } from './components/LegalPdfModal';
import {
  getDefaultReminderSettings,
  saveReminderSettings,
  canSend24HourReminder,
  sendBjjReminderNotification,
  markReminderAsSent
} from './utils/notifications';
import {
  Plus,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Heart,
  Bell,
  Target,
  Building2,
  User,
  Camera,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const STORAGE_KEY = 'bjj_drill_logs_data_v1';
const THEME_STORAGE_KEY = 'bytechoke_bjj_theme';
const RANK_STORAGE_KEY = 'bytechoke_bjj_rank_profile_v1';
const FUTURE_PLAN_KEY = 'bytechoke_future_plan_v1';
const LINEAGE_ACADEMIES_KEY = 'bytechoke_lineage_academies_v1';
const USER_PROFILE_KEY = 'bytechoke_user_profile_v1';
const MAT_PHOTOS_KEY = 'bytechoke_mat_photos_v1';
const COMPETITIONS_KEY = 'bytechoke_competitions_v1';
const TERMS_ACCEPTED_KEY = 'rolldex_terms_accepted_v1';

export default function App() {
  // First-launch Clickwrap Terms & Liability gate state
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(() => {
    try {
      return localStorage.getItem(TERMS_ACCEPTED_KEY) === 'true';
    } catch (e) {
      console.error('Failed to read terms acceptance state', e);
      return false;
    }
  });

  const handleAcceptTerms = () => {
    setHasAcceptedTerms(true);
    try {
      localStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
    } catch (e) {
      console.error('Failed to save terms acceptance', e);
    }
    showToast('Welcome to RollDex! Terms & Legal Disclaimer Accepted 🥋');
  };

  const handleResetTermsGate = () => {
    try {
      localStorage.removeItem(TERMS_ACCEPTED_KEY);
    } catch (e) {}
    setHasAcceptedTerms(false);
  };

  // User Practitioner Profile state (First Name, Last Name, DOB, Email only)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.firstName && parsed.lastName) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load user profile', e);
    }
    return null;
  });

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState<boolean>(false);

  const handleSaveUserProfile = (profile: UserProfile | null) => {
    setUserProfile(profile);
    try {
      if (profile) {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
        showToast(`Saved profile: ${profile.firstName || 'Practitioner'} 🥋`);
      } else {
        localStorage.removeItem(USER_PROFILE_KEY);
        showToast('Profile cleared.');
      }
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<BjjThemeId>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as BjjThemeId;
      if (savedTheme && BJJ_THEMES[savedTheme]) {
        return savedTheme;
      }
    } catch (e) {
      console.error('Failed to load theme preference', e);
    }
    return 'white-gi';
  });

  const activeTheme = BJJ_THEMES[currentTheme] || BJJ_THEMES['white-gi'];

  // Theme to Rank mapping (vice versa)
  const THEME_TO_RANK_MAP: Partial<Record<BjjThemeId, string>> = {
    'white-gi': 'adult-white',
    'grey-belt': 'kids-grey',
    'yellow-belt': 'kids-yellow',
    'orange-belt': 'kids-orange',
    'green-belt': 'kids-green',
    'blue-belt': 'adult-blue',
    'purple-belt': 'adult-purple',
    'brown-belt': 'adult-brown',
    'black-belt': 'adult-black',
    'coral-red-black': 'adult-coral-red-black',
    'coral-red-white': 'adult-coral-red-white',
    'red-belt': 'adult-red'
  };

  // Rank to Theme mapping
  const BELT_THEME_AUTO_MAP: Record<string, BjjThemeId> = {
    'adult-white': 'white-gi',
    'adult-blue': 'blue-belt',
    'adult-purple': 'purple-belt',
    'adult-brown': 'brown-belt',
    'adult-black': 'black-belt',
    'adult-coral-red-black': 'coral-red-black',
    'adult-coral-red-white': 'coral-red-white',
    'adult-red': 'red-belt',
    'kids-white': 'white-gi',
    'kids-grey-white': 'grey-belt',
    'kids-grey': 'grey-belt',
    'kids-grey-black': 'grey-belt',
    'kids-yellow-white': 'yellow-belt',
    'kids-yellow': 'yellow-belt',
    'kids-yellow-black': 'yellow-belt',
    'kids-orange-white': 'orange-belt',
    'kids-orange': 'orange-belt',
    'kids-orange-black': 'orange-belt',
    'kids-green-white': 'green-belt',
    'kids-green': 'green-belt',
    'kids-green-black': 'green-belt'
  };

  const handleSelectTheme = (themeId: BjjThemeId, syncRank: boolean = true) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }

    // Vice versa: if theme corresponds to a belt rank and syncRank is true, automatically update user's rank
    if (syncRank && THEME_TO_RANK_MAP[themeId]) {
      const targetRankId = THEME_TO_RANK_MAP[themeId]!;
      const matchedBelt = ALL_BELTS.find((b) => b.id === targetRankId);
      if (matchedBelt && rankProfile.rankId !== targetRankId) {
        const updatedProfile: BjjRankProfile = {
          ...rankProfile,
          division: matchedBelt.division,
          rankId: matchedBelt.id,
          rankName: matchedBelt.name,
          stripes: Math.min(rankProfile.stripes, matchedBelt.maxStripes)
        };
        setRankProfile(updatedProfile);
        try {
          localStorage.setItem(RANK_STORAGE_KEY, JSON.stringify(updatedProfile));
        } catch (e) {
          console.error('Failed to auto-sync rank profile', e);
        }
      }
    }

    showToast(`Switched theme to ${BJJ_THEMES[themeId].name}`);
  };

  // Rank profile state
  const [rankProfile, setRankProfile] = useState<BjjRankProfile>(() => {
    try {
      const savedRank = localStorage.getItem(RANK_STORAGE_KEY);
      if (savedRank) {
        const parsed = JSON.parse(savedRank);
        if (parsed && parsed.rankId) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load rank profile', e);
    }
    return DEFAULT_RANK_PROFILE;
  });

  const handleSaveRankProfile = (newProfile: BjjRankProfile) => {
    setRankProfile(newProfile);
    try {
      localStorage.setItem(RANK_STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Failed to save rank profile', e);
    }

    // Auto-update theme based on the newly saved belt rank
    if (newProfile.rankId && BELT_THEME_AUTO_MAP[newProfile.rankId]) {
      handleSelectTheme(BELT_THEME_AUTO_MAP[newProfile.rankId], false);
    }

    showToast(`Updated Rank: ${newProfile.rankName} (${newProfile.stripes} ${newProfile.stripes === 1 ? 'stripe' : 'stripes'})!`);
  };

  // Lineage and Academies state
  const [lineageData, setLineageData] = useState<LineageAndAcademiesData>(() => {
    try {
      const saved = localStorage.getItem(LINEAGE_ACADEMIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.academies)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load lineage and academy data', e);
    }
    return DEFAULT_LINEAGE_AND_ACADEMIES;
  });

  const handleSaveLineageData = (updated: LineageAndAcademiesData) => {
    setLineageData(updated);
    try {
      localStorage.setItem(LINEAGE_ACADEMIES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save lineage data', e);
    }
    const currentAcad = updated.academies.find((a) => a.isCurrent);
    showToast(`Lineage & Academy records saved! ${currentAcad ? `(Current: ${currentAcad.name})` : ''}`);
  };

  // Future Plan / Promotion Roadmap state
  const [futurePlan, setFuturePlan] = useState<FutureBjjPlan>(() => {
    try {
      const savedPlan = localStorage.getItem(FUTURE_PLAN_KEY);
      if (savedPlan) {
        const parsed = JSON.parse(savedPlan);
        if (parsed && parsed.targetBelt) {
          // If stored milestones are the old sample dummy milestones (m-1, m-2, etc.), clear them out so user starts at 0/0
          const legacyDummyIds = ['m-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'ms-1', 'ms-2', 'ms-3', 'ms-4', 'ms-5', 'ms-6'];
          const cleanedMilestones = Array.isArray(parsed.milestones)
            ? parsed.milestones.filter((m: any) => !legacyDummyIds.includes(m.id))
            : [];
          const cleanPlan: FutureBjjPlan = {
            ...parsed,
            milestones: cleanedMilestones
          };
          localStorage.setItem(FUTURE_PLAN_KEY, JSON.stringify(cleanPlan));
          return cleanPlan;
        }
      }
    } catch (e) {
      console.error('Failed to load future plan', e);
    }
    return DEFAULT_FUTURE_PLAN;
  });

  const handleSaveFuturePlan = (updatedPlan: FutureBjjPlan) => {
    setFuturePlan(updatedPlan);
    try {
      localStorage.setItem(FUTURE_PLAN_KEY, JSON.stringify(updatedPlan));
    } catch (e) {
      console.error('Failed to save future plan', e);
    }
    showToast(`Saved roadmap: ${updatedPlan.targetBelt} by ${updatedPlan.targetDate} 🎯`);
  };

  // Daily Reminder Settings State
  const [reminderSettings, setReminderSettings] = useState<NotificationReminderSettings>(() => {
    return getDefaultReminderSettings();
  });

  // Load logs from localStorage or initialize with seed data (defaults to empty so user starts fresh at 0)
  const [logs, setLogs] = useState<BjjLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // If stored logs are only the legacy sample seed logs, start fresh at 0
          const isOnlyLegacySeeds = parsed.length > 0 && parsed.every((l: BjjLogEntry) =>
            l.id === 'bjj-log-106' || l.id === 'bjj-log-105' || l.id === 'bjj-log-104'
          );
          if (isOnlyLegacySeeds) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
            return [];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load logs from localStorage', e);
    }
    return INITIAL_BJJ_LOGS;
  });

  // UI modal state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingLog, setEditingLog] = useState<BjjLogEntry | null>(null);
  const [printModalLog, setPrintModalLog] = useState<BjjLogEntry | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isRankModalOpen, setIsRankModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isFuturePlanModalOpen, setIsFuturePlanModalOpen] = useState<boolean>(false);
  const [isDailyReminderModalOpen, setIsDailyReminderModalOpen] = useState<boolean>(false);
  const [isLineageModalOpen, setIsLineageModalOpen] = useState<boolean>(false);
  const [isMatPhotosModalOpen, setIsMatPhotosModalOpen] = useState<boolean>(false);
  const [isLegalPdfModalOpen, setIsLegalPdfModalOpen] = useState<boolean>(false);
  const [isLogbookExpanded, setIsLogbookExpanded] = useState<boolean>(true);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Standalone Mat Photos (Auto-dated and persisted)
  const [standalonePhotos, setStandalonePhotos] = useState<MatPhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem(MAT_PHOTOS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load mat photos', e);
    }
    return [];
  });

  const handleSaveStandalonePhotos = (photos: MatPhotoItem[]) => {
    setStandalonePhotos(photos);
    try {
      localStorage.setItem(MAT_PHOTOS_KEY, JSON.stringify(photos));
      showToast('Mat photo saved with date stamp! 📷');
    } catch (e) {
      console.error('Failed to save mat photos', e);
    }
  };

  // Competitions & Tournament records state
  const [competitions, setCompetitions] = useState<CompetitionEntry[]>(() => {
    try {
      const saved = localStorage.getItem(COMPETITIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load competitions', e);
    }
    return [];
  });

  const handleSaveCompetitions = (entries: CompetitionEntry[]) => {
    setCompetitions(entries);
    try {
      localStorage.setItem(COMPETITIONS_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save competitions', e);
    }
  };

  // Calculate total photos across logs and standalone gallery
  const totalPhotosCount = (() => {
    let count = standalonePhotos.length;
    logs.forEach((log) => {
      if (log.photos) count += log.photos.length;
    });
    return count;
  })();

  // Sync logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs to localStorage', e);
    }
  }, [logs]);

  // Check 24-hour reminder background condition on mount or window focus
  useEffect(() => {
    if (!reminderSettings.enabled) return;

    const checkAndNotify = () => {
      if (canSend24HourReminder()) {
        const didNotify = sendBjjReminderNotification(
          'ByteChoke BJJ Daily Reminder 🥋',
          'Time to log your drills, techniques, and submissions for today!'
        );
        if (didNotify) {
          showToast('🥋 Daily reminder: Don’t forget to log your BJJ class today!');
        }
      }
    };

    // Run check on startup with a brief delay
    const timer = setTimeout(checkAndNotify, 2000);
    window.addEventListener('focus', checkAndNotify);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', checkAndNotify);
    };
  }, [reminderSettings.enabled]);

  // Trigger toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // Handlers
  const handleSaveLog = (newOrUpdatedLog: BjjLogEntry) => {
    if (editingLog) {
      // Update existing
      setLogs((prev) =>
        prev.map((l) => (l.id === newOrUpdatedLog.id ? newOrUpdatedLog : l))
      );
      showToast(`Class #${newOrUpdatedLog.classNumber} updated successfully!`);
    } else {
      // Add new to top
      setLogs((prev) => [newOrUpdatedLog, ...prev]);
      showToast(`Class #${newOrUpdatedLog.classNumber} logged successfully! OSS 🥋`);
    }
    setIsFormOpen(false);
    setEditingLog(null);
  };

  const handleEditLog = (logToEdit: BjjLogEntry) => {
    setEditingLog(logToEdit);
    setIsFormOpen(true);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteLog = (id: string) => {
    const target = logs.find((l) => l.id === id);
    if (window.confirm(`Delete Class #${target?.classNumber || ''} log?`)) {
      setLogs((prev) => prev.filter((l) => l.id !== id));
      showToast('Log entry removed.');
    }
  };

  const handleDuplicateLog = (sourceLog: BjjLogEntry) => {
    const nextClassNum =
      typeof sourceLog.classNumber === 'number'
        ? sourceLog.classNumber + 1
        : parseInt(String(sourceLog.classNumber), 10) + 1 || '';

    const duplicated: BjjLogEntry = {
      ...sourceLog,
      id: `bjj-log-${Date.now()}`,
      classNumber: nextClassNum || '',
      date: new Date().toISOString().slice(0, 10),
      createdAt: Date.now()
    };

    setEditingLog(duplicated);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded techniques from Class #${sourceLog.classNumber} into new entry.`);
  };

  const handleImportLogs = (importedLogs: BjjLogEntry[]) => {
    setLogs(importedLogs);
    showToast(`Restored ${importedLogs.length} class logs!`);
  };

  const handleResetToDefault = () => {
    setLogs(INITIAL_BJJ_LOGS);
    showToast('Reset to default sample logs.');
  };

  // Latest log for copying
  const latestLog = logs.length > 0 ? logs[0] : null;
  const currentHomeGym = lineageData.academies.find((a) => a.isCurrent);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 bjj-mat-texture ${activeTheme.bgClass}`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold border border-neutral-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar Header */}
      <Header
        onNewLogClick={() => {
          setEditingLog(null);
          setIsFormOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onExportClick={() => setIsExportModalOpen(true)}
        onImportClick={() => setIsExportModalOpen(true)}
        onMyRankClick={() => setIsRankModalOpen(true)}
        onAboutClick={() => setIsAboutModalOpen(true)}
        onFuturePlanClick={() => setIsFuturePlanModalOpen(true)}
        onDailyReminderClick={() => setIsDailyReminderModalOpen(true)}
        onLineageClick={() => setIsLineageModalOpen(true)}
        onProfileClick={() => setIsSignUpModalOpen(true)}
        onMatPhotosClick={() => setIsMatPhotosModalOpen(true)}
        userProfile={userProfile}
        currentAcademyName={currentHomeGym?.name}
        reminderEnabled={reminderSettings.enabled}
        totalLogs={logs.length}
        totalPhotos={totalPhotosCount}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        rankProfile={rankProfile}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Summary Stats, Active Rank Graphic & Future Promotion Roadmap Card */}
        <StatsBar
          logs={logs}
          rankProfile={rankProfile}
          onOpenRankModal={() => setIsRankModalOpen(true)}
          futurePlan={futurePlan}
          onOpenFuturePlan={() => setIsFuturePlanModalOpen(true)}
          lineageData={lineageData}
          onOpenLineageModal={() => setIsLineageModalOpen(true)}
          userProfile={userProfile}
          onOpenProfileModal={() => setIsSignUpModalOpen(true)}
        />

        {/* Form Section (when open or toggled) */}
        {isFormOpen ? (
          <div className="transition-all animate-in fade-in-50 duration-200">
            <LogForm
              initialData={editingLog}
              onSave={handleSaveLog}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingLog(null);
              }}
              lastLog={latestLog}
              allLogs={logs}
            />
          </div>
        ) : (
          /* Quick Entry Callout Banner */
          <div
            onClick={() => {
              setEditingLog(null);
              setIsFormOpen(true);
            }}
            className="bg-white hover:bg-neutral-50/80 border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all shadow-xs group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-amber-300 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900 uppercase">
                  Record Today's BJJ Class
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  Log Date, Class #, Gi/No-Gi, Coach, 5 Drills & Techniques, Submissions & Photos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 group-hover:text-neutral-900">
              <span className="hidden sm:inline">Open Drill Form</span>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        )}

        {/* Expandable Mat Photos & Whiteboard Notes Section */}
        <MatPhotosSection
          standalonePhotos={standalonePhotos}
          logs={logs}
          onOpenFullGallery={() => setIsMatPhotosModalOpen(true)}
          onSaveStandalonePhotos={handleSaveStandalonePhotos}
          onPreviewPhoto={(url) => setPreviewPhotoUrl(url)}
        />

        {/* Expandable Mat Logbook & History Section */}
        <section className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs overflow-hidden transition-all">
          {/* Section Header with Accordion Toggle */}
          <div
            id="btn-toggle-logbook-section"
            onClick={() => setIsLogbookExpanded(!isLogbookExpanded)}
            className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50/80 transition-colors select-none"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-amber-300 flex items-center justify-center font-bold text-sm shadow-2xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-900">
                    Mat Logbook & History
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded-full border border-neutral-200">
                    {logs.length} {logs.length === 1 ? 'Session' : 'Sessions'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium hidden sm:block">
                  Class techniques, sparring submissions & training notes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <span>{isLogbookExpanded ? 'Collapse Logbook' : 'Expand Logbook'}</span>
                {isLogbookExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Content */}
          {isLogbookExpanded && (
            <div className="p-3.5 sm:p-4 border-t border-neutral-100 bg-neutral-50/40 animate-in fade-in-50 duration-150">
              <LogList
                logs={logs}
                onEdit={handleEditLog}
                onDelete={handleDeleteLog}
                onDuplicate={handleDuplicateLog}
                onPrintPreview={(log) => setPrintModalLog(log)}
                onNewLogClick={() => {
                  setEditingLog(null);
                  setIsFormOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </section>

        {/* Competitions & Tournaments Tracker Box (At bottom of page) */}
        <section className="no-print mt-6">
          <CompetitionTracker
            competitions={competitions}
            onSaveCompetitions={handleSaveCompetitions}
            showToast={showToast}
          />
        </section>
      </main>

      {/* Footer with Verified Creator Attribution & 100% Free Guarantee */}
      <footer className="no-print border-t border-neutral-200/80 bg-white/80 py-6 text-xs text-neutral-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-neutral-900 flex items-center justify-center sm:justify-start gap-1.5">
              <span>RollDex • BJJ Log & Journal</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-800 font-semibold">
                100% Free
              </span>
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Private, offline local Brazilian Jiu-Jitsu training journal and technique matrix.
            </p>
          </div>

          <div className="flex items-center flex-wrap justify-center sm:justify-end gap-2 text-[11px]">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-neutral-300 hover:bg-neutral-100 font-semibold text-neutral-700 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>License & About</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mat Photos & Whiteboard Gallery Modal (Auto-dated) */}
      <MatPhotosGalleryModal
        isOpen={isMatPhotosModalOpen}
        onClose={() => setIsMatPhotosModalOpen(false)}
        standalonePhotos={standalonePhotos}
        onSaveStandalonePhotos={handleSaveStandalonePhotos}
        logs={logs}
        onPreviewPhoto={(url) => setPreviewPhotoUrl(url)}
      />

      {/* Full-Screen Image Lightbox */}
      <ImageLightboxModal
        imageUrl={previewPhotoUrl}
        onClose={() => setPreviewPhotoUrl(null)}
      />

      {/* Sign Up / Practitioner Profile Modal */}
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveUserProfile}
        isInitialOnboarding={false}
      />

      {/* Lineage & Academies Modal */}
      <LineageAcademiesModal
        isOpen={isLineageModalOpen}
        onClose={() => setIsLineageModalOpen(false)}
        data={lineageData}
        onSaveData={handleSaveLineageData}
      />

      {/* Future Plan & Promotion Roadmap Modal */}
      <FuturePlanModal
        isOpen={isFuturePlanModalOpen}
        onClose={() => setIsFuturePlanModalOpen(false)}
        plan={futurePlan}
        onSavePlan={handleSaveFuturePlan}
        logs={logs}
        rankProfile={rankProfile}
      />

      {/* Daily 24h Notification Reminder Modal */}
      <DailyReminderModal
        isOpen={isDailyReminderModalOpen}
        onClose={() => setIsDailyReminderModalOpen(false)}
        settings={reminderSettings}
        onUpdateSettings={(newSettings) => {
          setReminderSettings(newSettings);
          saveReminderSettings(newSettings);
        }}
        onTriggerInAppReminderToast={(msg) => showToast(msg)}
      />

      {/* My Rank & Belt Graduation Modal */}
      <MyRankModal
        isOpen={isRankModalOpen}
        onClose={() => setIsRankModalOpen(false)}
        currentProfile={rankProfile}
        onSaveProfile={handleSaveRankProfile}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* About & Verified Creator Attribution Modal */}
      <AboutLicenseModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onResetTermsGate={handleResetTermsGate}
        onOpenLegalPdf={() => setIsLegalPdfModalOpen(true)}
      />

      {/* Official Printable Legal Document & PDF Export Modal */}
      <LegalPdfModal
        isOpen={isLegalPdfModalOpen}
        onClose={() => setIsLegalPdfModalOpen(false)}
        onLaunchOnboarding={handleResetTermsGate}
      />

      {/* First-Launch Clickwrap Onboarding & Legal Disclaimer Gate */}
      <OnboardingTermsModal
        isOpen={!hasAcceptedTerms}
        onAccept={handleAcceptTerms}
      />

      {/* Print View Modal */}
      <PrintModal
        log={printModalLog}
        onClose={() => setPrintModalLog(null)}
      />

      {/* Export & Import Modal */}
      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        logs={logs}
        onImportLogs={handleImportLogs}
        onResetToDefault={handleResetToDefault}
      />
    </div>
  );
}

