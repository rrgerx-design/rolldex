import React, { useState } from 'react';
import {
  Target,
  Calendar,
  Award,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  X,
  Sparkles,
  TrendingUp,
  Flame,
  MessageSquare,
  Compass,
  Layers,
  Clock,
  BookCheck,
  ChevronRight
} from 'lucide-react';
import { FutureBjjPlan, PlanMilestone, BjjRankProfile, BjjLogEntry } from '../types';
import { ALL_BELTS } from '../data/ranks';

interface FuturePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: FutureBjjPlan;
  onSavePlan: (updatedPlan: FutureBjjPlan) => void;
  logs: BjjLogEntry[];
  rankProfile: BjjRankProfile;
}

export const FuturePlanModal: React.FC<FuturePlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  onSavePlan,
  logs,
  rankProfile
}) => {
  const [targetBelt, setTargetBelt] = useState(plan.targetBelt || 'Blue Belt (Faixa Azul)');
  const [targetDate, setTargetDate] = useState(plan.targetDate || '2026-12-31');
  const [targetClassCount, setTargetClassCount] = useState<number>(plan.targetClassCount || 150);
  const [focusAreas, setFocusAreas] = useState(plan.focusAreas || '');
  const [milestones, setMilestones] = useState<PlanMilestone[]>(plan.milestones || []);
  const [customGoalNotes, setCustomGoalNotes] = useState(plan.customGoalNotes || '');
  const [coachFeedback, setCoachFeedback] = useState(plan.coachFeedback || '');
  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [newMilestoneCategory, setNewMilestoneCategory] = useState<
    'Technique' | 'Conditioning' | 'Competition' | 'Attendance' | 'Mindset'
  >('Technique');

  if (!isOpen) return null;

  // Calculate statistics & countdown
  const totalClassesLogged = logs.length;
  const classProgressPercent = Math.min(
    100,
    Math.round((totalClassesLogged / Math.max(1, targetClassCount)) * 100)
  );

  const completedMilestonesCount = milestones.filter((m) => m.completed).length;
  const milestonesPercent =
    milestones.length > 0
      ? Math.round((completedMilestonesCount / milestones.length) * 100)
      : 0;

  // Days remaining calculation
  const getDaysRemaining = () => {
    if (!targetDate) return null;
    const target = new Date(targetDate).getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const diff = target - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = getDaysRemaining();

  const handleToggleMilestone = (id: string) => {
    const updated = milestones.map((m) => {
      if (m.id === id) {
        const nextCompleted = !m.completed;
        return {
          ...m,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return m;
    });
    setMilestones(updated);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;

    const newM: PlanMilestone = {
      id: `m-${Date.now()}`,
      title: newMilestoneText.trim(),
      completed: false,
      category: newMilestoneCategory
    };

    setMilestones([...milestones, newM]);
    setNewMilestoneText('');
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'blue-belt') {
      setTargetBelt('Blue Belt (Faixa Azul)');
      setTargetClassCount(150);
      setFocusAreas('Guard Retention, Escaping Side Control & Mount, Basic Takedowns, Fundamental Sweeps');
      setMilestones([
        { id: `m-${Date.now()}-1`, title: 'Consistent Side Control Hip-Escape to Guard', completed: true, category: 'Technique' },
        { id: `m-${Date.now()}-2`, title: 'Execute 2 reliable Guard Passes (Knee-Cut & Torreando)', completed: false, category: 'Technique' },
        { id: `m-${Date.now()}-3`, title: 'Log 150 total classes and attend regularly', completed: false, category: 'Attendance' },
        { id: `m-${Date.now()}-4`, title: 'Basic submission defense (Armbar, Triangle, Guillotine)', completed: false, category: 'Technique' },
        { id: `m-${Date.now()}-5`, title: 'Survive 5-min rounds without gassing out', completed: false, category: 'Conditioning' }
      ]);
    } else if (presetName === 'purple-belt') {
      setTargetBelt('Purple Belt (Faixa Roxa)');
      setTargetClassCount(350);
      setFocusAreas('Developing a cohesive guard system (DLR/Single Leg X), Berimbolo/Inversion flows, Guard passing combinations');
      setMilestones([
        { id: `m-${Date.now()}-1`, title: 'Master 1 complete guard passing chain', completed: false, category: 'Technique' },
        { id: `m-${Date.now()}-2`, title: 'Develop signature submission sequence from back mount', completed: false, category: 'Technique' },
        { id: `m-${Date.now()}-3`, title: 'Help teach & mentor white belts during warmups', completed: false, category: 'Mindset' },
        { id: `m-${Date.now()}-4`, title: 'Compete in at least 1 regional tournament division', completed: false, category: 'Competition' }
      ]);
    } else if (presetName === 'stripe-promo') {
      setTargetBelt(`Next Stripe (${rankProfile.stripes + 1}★ on ${rankProfile.rankName})`);
      setTargetClassCount(Math.max(totalClassesLogged + 30, 50));
      setFocusAreas('Refining current positions and fixing weak spots noted by coach');
      setMilestones([
        { id: `m-${Date.now()}-1`, title: 'Train 3x weekly for 2 continuous months', completed: false, category: 'Attendance' },
        { id: `m-${Date.now()}-2`, title: 'Work on positional sparring from bad spots', completed: false, category: 'Technique' },
        { id: `m-${Date.now()}-3`, title: 'Review drill notes before every class session', completed: false, category: 'Mindset' }
      ]);
    }
  };

  const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleResetDaysToZero = () => {
    setTargetDate(getTodayString());
  };

  const handleSave = () => {
    const updated: FutureBjjPlan = {
      targetBelt: targetBelt.trim() || 'Next Belt Goal',
      targetDate: targetDate || getTodayString(),
      targetClassCount: Number(targetClassCount) || 100,
      focusAreas: focusAreas.trim(),
      milestones,
      customGoalNotes: customGoalNotes.trim(),
      coachFeedback: coachFeedback.trim(),
      updatedAt: Date.now()
    };
    onSavePlan(updated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="modal-future-plan"
        className="bg-white border-2 border-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-7 overflow-hidden max-h-[90vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-amber-300 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                <span>Future BJJ Promotion Roadmap</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                  Target Plan
                </span>
              </h3>
              <p className="text-xs text-neutral-500">
                Set promotion targets (e.g. Blue Belt by December 2026), milestones & technical goals.
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

        {/* Scrollable Content */}
        <div className="space-y-5 overflow-y-auto pr-1 py-4 flex-1">
          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
            <span className="text-[10px] font-bold uppercase text-neutral-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Presets:</span>
            </span>
            <button
              type="button"
              onClick={() => handleApplyPreset('blue-belt')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-100/80 hover:bg-blue-200 text-blue-950 border border-blue-300 transition-colors cursor-pointer"
            >
              🥋 White to Blue Belt
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('purple-belt')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-purple-100/80 hover:bg-purple-200 text-purple-950 border border-purple-300 transition-colors cursor-pointer"
            >
              🥋 Blue to Purple Belt
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('stripe-promo')}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-100/80 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-colors cursor-pointer"
            >
              ⭐ Next Stripe Goal
            </button>
          </div>

          {/* Target Belt & Target Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Rank / Belt */}
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <label
                htmlFor="input-target-belt"
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5"
              >
                <Award className="w-4 h-4 text-neutral-900" />
                <span>Target Promotion / Belt</span>
              </label>
              <input
                id="input-target-belt"
                type="text"
                value={targetBelt}
                onChange={(e) => setTargetBelt(e.target.value)}
                placeholder="e.g. Blue Belt (Faixa Azul), Purple Belt..."
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {/* Target Date */}
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="input-target-date"
                  className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider"
                >
                  <Calendar className="w-4 h-4 text-neutral-900" />
                  <span>Target Completion Date</span>
                </label>
                <button
                  type="button"
                  onClick={handleResetDaysToZero}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
                  title="Set target date to today (0 days left)"
                >
                  ⏱️ Reset to 0 Days Left
                </button>
              </div>
              <input
                id="input-target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          </div>

          {/* Real-time Progress & Countdown Status Card */}
          <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-5 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-sm">🎯 Target:</span>
                <span className="font-display font-bold text-base text-white">{targetBelt}</span>
              </div>
              <div className="flex items-center gap-2">
                {daysRemaining !== null && (
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      daysRemaining > 0
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : daysRemaining === 0
                        ? 'bg-amber-400 text-neutral-950 font-extrabold'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {daysRemaining > 0
                      ? `⏳ ${daysRemaining} Days Left`
                      : daysRemaining === 0
                      ? '⏱️ 0 Days Left (Target Today)'
                      : '🎉 Target Date Reached!'}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Classes Logged vs Target Classes */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-neutral-400">Class Attendance Goal:</span>
                  <span className="text-white font-bold font-mono">
                    {totalClassesLogged} / {targetClassCount} Classes ({classProgressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${classProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Milestones Completed */}
              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className="text-neutral-400">Technical Milestones:</span>
                  <span className="text-white font-bold font-mono">
                    {completedMilestonesCount} / {milestones.length} Completed ({milestonesPercent}%)
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${milestonesPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Target Class Count Setting */}
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
                Target Mat Attendance Count
              </span>
              <span className="text-xs text-neutral-500">
                Number of logged sessions needed for this belt evaluation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="1000"
                value={targetClassCount}
                onChange={(e) => setTargetClassCount(Number(e.target.value))}
                className="w-24 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-sm font-bold text-neutral-900 text-center"
              />
              <span className="text-xs font-semibold text-neutral-600">Classes</span>
            </div>
          </div>

          {/* Key Focus Areas */}
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <label
              htmlFor="input-focus-areas"
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5"
            >
              <Compass className="w-4 h-4 text-neutral-900" />
              <span>Key Technical Focus Areas</span>
            </label>
            <input
              id="input-focus-areas"
              type="text"
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value)}
              placeholder="e.g. Guard Retention, Half-Guard Sweeps, Side Control Escapes, Kimura Traps"
              className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

            {/* Interactive Milestone Checklist */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <BookCheck className="w-4 h-4 text-neutral-900" />
                    <h4 className="font-display font-bold text-sm text-neutral-900 uppercase">
                      Technical Milestones Checklist ({completedMilestonesCount}/{milestones.length})
                    </h4>
                  </div>
                  {milestones.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setMilestones([])}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded border border-rose-200 transition-colors cursor-pointer"
                    >
                      Reset to 0/0
                    </button>
                  )}
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  {milestones.length > 0 ? 'Tap to check off completed moves' : 'Add custom milestones below'}
                </span>
              </div>

              {/* List of Milestones */}
              {milestones.length > 0 ? (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        m.completed
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                          : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {m.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-neutral-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            m.completed ? 'line-through text-neutral-500 font-normal' : 'font-semibold'
                          }`}
                        >
                          {m.title}
                        </span>
                        {m.category && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 shrink-0">
                            {m.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {m.completedAt && (
                          <span className="text-[10px] text-emerald-700 font-mono hidden sm:inline">
                            ✓ {m.completedAt}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMilestone(m.id);
                          }}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete milestone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-dashed border-neutral-300 rounded-lg p-3.5 text-center">
                  <p className="text-xs text-neutral-500 font-medium">
                    No milestones set yet (0/0). Type a goal below and click <strong className="text-neutral-900">+ Add</strong> to create your first milestone!
                  </p>
                </div>
              )}

            {/* Add Milestone Form */}
            <form onSubmit={handleAddMilestone} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add new promotion milestone (e.g. Master Knee-Cut pass)..."
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <select
                value={newMilestoneCategory}
                onChange={(e) => setNewMilestoneCategory(e.target.value as any)}
                className="bg-white border border-neutral-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-700"
              >
                <option value="Technique">Technique</option>
                <option value="Attendance">Attendance</option>
                <option value="Conditioning">Conditioning</option>
                <option value="Competition">Competition</option>
                <option value="Mindset">Mindset</option>
              </select>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Coach Feedback & Advice Notes */}
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <label
              htmlFor="input-coach-feedback"
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5"
            >
              <MessageSquare className="w-4 h-4 text-neutral-900" />
              <span>Coach / Professor Lineage Feedback</span>
            </label>
            <textarea
              id="input-coach-feedback"
              rows={2}
              value={coachFeedback}
              onChange={(e) => setCoachFeedback(e.target.value)}
              placeholder="e.g. Professor noted: 'Work on tightening your half-guard underhooks and remember to stay patient in bad spots.'"
              className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-y"
            />
          </div>

          {/* Personal Goals & Mindset */}
          <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
            <label
              htmlFor="input-custom-goal-notes"
              className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5"
            >
              <span>Personal Notes & Training Philosophy</span>
            </label>
            <textarea
              id="input-custom-goal-notes"
              rows={2}
              value={customGoalNotes}
              onChange={(e) => setCustomGoalNotes(e.target.value)}
              placeholder="e.g. Train for longevity, tap early, avoid injuries, have fun with the journey!"
              className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-y"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            id="btn-save-future-plan"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Save Promotion Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
