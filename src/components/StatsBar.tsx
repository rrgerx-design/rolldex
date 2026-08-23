import React from 'react';
import {
  BjjLogEntry,
  BjjRankProfile,
  FutureBjjPlan,
  LineageAndAcademiesData,
  UserProfile
} from '../types';
import { ALL_BELTS } from '../data/ranks';
import { BeltGraphic } from './BeltGraphic';
import {
  Award,
  Flame,
  Layers,
  Hash,
  Calendar,
  Zap,
  ChevronRight,
  Target,
  Building2,
  GitBranch,
  User
} from 'lucide-react';

interface StatsBarProps {
  logs: BjjLogEntry[];
  rankProfile: BjjRankProfile;
  onOpenRankModal: () => void;
  futurePlan?: FutureBjjPlan;
  onOpenFuturePlan?: () => void;
  lineageData?: LineageAndAcademiesData;
  onOpenLineageModal?: () => void;
  userProfile?: UserProfile | null;
  onOpenProfileModal?: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  logs,
  rankProfile,
  onOpenRankModal,
  futurePlan,
  onOpenFuturePlan,
  lineageData,
  onOpenLineageModal,
  userProfile,
  onOpenProfileModal
}) => {
  const totalClasses = logs.length;
  const giCount = logs.filter((l) => l.gear === 'Gi').length;
  const noGiCount = logs.filter((l) => l.gear === 'No-Gi').length;
  const openMatCount = logs.filter((l) => l.gear === 'Open Mat').length;

  const totalDrills = logs.reduce((acc, curr) => {
    return acc + curr.drills.filter((d) => d && d.trim().length > 0).length;
  }, 0);

  const totalSubmissions = logs.reduce((acc, curr) => {
    if (!curr.submissionsGot || !curr.submissionsGot.trim()) return acc;
    return acc + 1;
  }, 0);

  const highestClassNum = logs.reduce((max, curr) => {
    const num = typeof curr.classNumber === 'number' ? curr.classNumber : parseInt(String(curr.classNumber), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);

  const currentBelt =
    ALL_BELTS.find((b) => b.id === rankProfile.rankId) || ALL_BELTS[0];

  const currentAcademy = lineageData?.academies.find((a) => a.isCurrent);
  const primaryLineage = lineageData?.lineages.find((l) => l.isPrimary) || lineageData?.lineages[0];

  // Future plan calculations
  const targetClassCount = futurePlan?.targetClassCount || 150;
  const classProgressPercent = Math.min(
    100,
    Math.round((totalClasses / Math.max(1, targetClassCount)) * 100)
  );

  const getDaysRemaining = () => {
    if (!futurePlan?.targetDate) return null;
    const target = new Date(futurePlan.targetDate).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();
  const completedMilestones = futurePlan?.milestones.filter((m) => m.completed).length || 0;
  const totalMilestones = futurePlan?.milestones.length || 0;

  return (
    <div className="space-y-3 mb-6">
      {/* Top Banner Grid: Current Rank + Future Promotion Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Interactive Belt & Rank Card */}
        <div
          id="card-my-rank-status"
          onClick={onOpenRankModal}
          className="bg-white hover:bg-neutral-50/80 border border-neutral-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 text-amber-300 flex items-center justify-center font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Current Rank
                </span>
                {userProfile ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProfileModal?.();
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded border border-neutral-300 transition-colors"
                    title="Edit Practitioner Profile"
                  >
                    <User className="w-2.5 h-2.5 text-neutral-700" />
                    <span>{userProfile.firstName} {userProfile.lastName}</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold text-neutral-400">
                    {rankProfile.division === 'adult' ? 'Adult (16+)' : 'Youth'}
                  </span>
                )}
                {currentAcademy && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLineageModal?.();
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 transition-colors"
                    title="View & Edit Lineage & Academies"
                  >
                    <Building2 className="w-2.5 h-2.5 text-amber-900" />
                    <span className="truncate max-w-[120px]">{currentAcademy.name}</span>
                  </button>
                )}
              </div>
              <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900 leading-tight mt-0.5 flex items-center gap-1.5 truncate">
                <span>{currentBelt.name}</span>
                <span className="text-xs font-bold text-amber-600">
                  {rankProfile.stripes === 0
                    ? '(0★)'
                    : currentBelt.id.includes('black')
                    ? `(${rankProfile.stripes}º)`
                    : `(${rankProfile.stripes}★)`}
                </span>
              </h3>
              {rankProfile.professorOrAcademy ? (
                <p className="text-[11px] text-neutral-500 truncate">
                  Coach: <span className="font-medium text-neutral-700">{rankProfile.professorOrAcademy}</span>
                </p>
              ) : (
                <p className="text-[11px] text-neutral-400">Tap to set promotion date & coach</p>
              )}
            </div>
          </div>

          {/* Belt Strap Render & Action */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
            <div className="w-28 sm:w-32">
              <BeltGraphic belt={currentBelt} stripes={rankProfile.stripes} size="sm" />
            </div>
            <div className="w-7 h-7 rounded-lg bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Future Promotion Goal & Roadmap Card */}
        {futurePlan && (
          <div
            id="card-future-plan"
            onClick={onOpenFuturePlan}
            className="bg-white hover:bg-neutral-50/80 border border-neutral-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      Future Plan Goal
                    </span>
                    {daysRemaining !== null && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        {daysRemaining > 0 ? `${daysRemaining}d left` : daysRemaining === 0 ? '0d left (Due Today)' : 'Due'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-base text-neutral-900 leading-tight mt-0.5">
                    {futurePlan.targetBelt || 'Next Rank Goal'}
                  </h3>
                  <p className="text-[11px] text-neutral-500 truncate">
                    Target: <span className="font-semibold text-neutral-700">{futurePlan.targetDate}</span>
                    <span> • {completedMilestones}/{totalMilestones} Milestones</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-neutral-900 font-mono">
                  {classProgressPercent}%
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Attendance Progress bar */}
            <div>
              <div className="w-full bg-neutral-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-neutral-900 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${classProgressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-medium mt-1">
                <span>{totalClasses} logged</span>
                <span>{targetClassCount} class goal</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Classes */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Total Classes
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-display text-neutral-900">{totalClasses}</span>
              {highestClassNum > 0 && (
                <span className="text-[11px] text-neutral-500 font-medium">
                  (Latest #{highestClassNum})
                </span>
              )}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Gi vs No-Gi */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Gear Split
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                Gi: {giCount}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                No-Gi: {noGiCount}
              </span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Drills Documented */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Drills Logged
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-display text-neutral-900">{totalDrills}</span>
              <span className="text-[11px] text-neutral-500 font-medium">moves</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Sparring & Submissions */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Sub Sessions
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold font-display text-neutral-900">{totalSubmissions}</span>
              <span className="text-[11px] text-neutral-500 font-medium">logged subs</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
