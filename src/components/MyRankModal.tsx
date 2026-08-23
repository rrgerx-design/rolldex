import React, { useState } from 'react';
import { BjjRankProfile, AgeDivision, BeltDefinition, BjjThemeId } from '../types';
import { ADULT_BELTS, KIDS_BELTS, ALL_BELTS } from '../data/ranks';
import { BJJ_THEMES } from '../data/themes';
import { BeltGraphic } from './BeltGraphic';
import {
  Award,
  X,
  Check,
  Calendar,
  User,
  Shield,
  Sparkles,
  ChevronRight,
  Info,
  Flame,
  Star,
  Palette
} from 'lucide-react';

interface MyRankModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: BjjRankProfile;
  onSaveProfile: (profile: BjjRankProfile) => void;
  currentTheme: BjjThemeId;
  onSelectTheme: (theme: BjjThemeId) => void;
}

const BELT_TO_THEME_MAP: Record<string, BjjThemeId> = {
  'adult-white': 'white-gi',
  'adult-blue': 'blue-belt',
  'adult-purple': 'purple-belt',
  'adult-brown': 'brown-belt',
  'adult-black': 'black-belt',
  'coral-red-black': 'coral-red-black',
  'coral-red-white': 'coral-red-white',
  'red-belt': 'red-belt',
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

export const MyRankModal: React.FC<MyRankModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  currentTheme,
  onSelectTheme
}) => {
  const [activeDivision, setActiveDivision] = useState<AgeDivision>(
    currentProfile.division || 'adult'
  );
  const [selectedRankId, setSelectedRankId] = useState<string>(
    currentProfile.rankId || 'adult-white'
  );
  const [stripes, setStripes] = useState<number>(currentProfile.stripes || 0);
  const [promotedDate, setPromotedDate] = useState<string>(
    currentProfile.promotedDate || new Date().toISOString().slice(0, 10)
  );
  const [professorOrAcademy, setProfessorOrAcademy] = useState<string>(
    currentProfile.professorOrAcademy || ''
  );
  const [notes, setNotes] = useState<string>(currentProfile.notes || '');

  if (!isOpen) return null;

  const currentBeltList = activeDivision === 'adult' ? ADULT_BELTS : KIDS_BELTS;
  const currentBelt =
    ALL_BELTS.find((b) => b.id === selectedRankId) ||
    currentBeltList[0] ||
    ADULT_BELTS[0];

  const handleSelectBelt = (belt: BeltDefinition) => {
    setSelectedRankId(belt.id);
    if (stripes > belt.maxStripes) {
      setStripes(belt.maxStripes);
    }
    // Auto-sync theme to selected belt if map exists
    const matchingTheme = BELT_TO_THEME_MAP[belt.id];
    if (matchingTheme && onSelectTheme) {
      onSelectTheme(matchingTheme);
    }
  };

  const handleDivisionChange = (div: AgeDivision) => {
    setActiveDivision(div);
    const targetList = div === 'adult' ? ADULT_BELTS : KIDS_BELTS;
    if (!targetList.some((b) => b.id === selectedRankId)) {
      setSelectedRankId(targetList[0].id);
      setStripes(0);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BjjRankProfile = {
      division: activeDivision,
      rankId: currentBelt.id,
      rankName: currentBelt.name,
      stripes: Math.min(stripes, currentBelt.maxStripes),
      promotedDate,
      professorOrAcademy: professorOrAcademy.trim(),
      notes: notes.trim()
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-neutral-900 text-white px-5 py-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg uppercase tracking-wide">
                My BJJ Rank & Graduation
              </h2>
              <p className="text-[11px] text-neutral-400">
                Official IBJJF Adult & Youth Belt Graduation System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Live Belt Graphic Preview Card */}
          <div className="bg-neutral-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                Active Rank Preview
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-neutral-200">
                {activeDivision === 'adult' ? '🥋 Adult Division (16+)' : '🧒 Youth Division (Under 18)'}
              </span>
            </div>

            {/* Belt render */}
            <div className="py-2">
              <BeltGraphic belt={currentBelt} stripes={stripes} size="lg" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800 text-xs">
              <div>
                <span className="font-display font-bold text-sm text-white">{currentBelt.name}</span>
                <p className="text-[11px] text-neutral-400">{currentBelt.description}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {stripes === 0
                    ? '0 Stripes'
                    : currentBelt.id.includes('black')
                    ? `${stripes}º Degree Professor`
                    : `${stripes} ${stripes === 1 ? 'Stripe' : 'Stripes'}`}
                </span>
              </div>
            </div>
          </div>

          {/* Division Selector (Adult vs Youth) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Select Age Division:
            </label>
            <div className="grid grid-cols-2 gap-2 bg-neutral-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleDivisionChange('adult')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeDivision === 'adult'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                🥋 Adult Belts (White to Black)
              </button>
              <button
                type="button"
                onClick={() => handleDivisionChange('kids')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeDivision === 'kids'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                🧒 Kids & Youth (Grey, Yellow, Orange, Green)
              </button>
            </div>
          </div>

          {/* Belt Selection Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Choose Belt Rank:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {currentBeltList.map((belt) => {
                const isSelected = selectedRankId === belt.id;
                return (
                  <button
                    key={belt.id}
                    type="button"
                    onClick={() => handleSelectBelt(belt)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm ring-2 ring-amber-400/50'
                        : 'border-neutral-200 bg-neutral-50/70 hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{belt.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </div>
                    <BeltGraphic belt={belt} stripes={0} size="sm" />
                    <span
                      className={`text-[10px] ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {belt.minAge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stripe / Degree Selector */}
          {currentBelt.maxStripes > 0 && (
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  {currentBelt.id.includes('black')
                    ? 'Black Belt Degrees (0 to 6º Degree):'
                    : 'Stripes on Rank Bar (0 to 4 Stripes):'}
                </label>
                <span className="text-xs font-bold text-amber-600">
                  {stripes === 0
                    ? 'No Stripes'
                    : currentBelt.id.includes('black')
                    ? `${stripes}º Degree`
                    : `${stripes} Stripe${stripes > 1 ? 's' : ''}`}
                </span>
              </div>

              {/* Stripe selector buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {Array.from({ length: currentBelt.maxStripes + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStripes(idx)}
                    className={`flex-1 min-w-[50px] py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                      stripes === idx
                        ? 'bg-neutral-900 text-amber-300 ring-2 ring-neutral-900 shadow-xs'
                        : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    {idx === 0 ? '0' : currentBelt.id.includes('black') ? `${idx}º` : `${idx} |`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Promotion Details & Professor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="input-promotion-date"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1"
              >
                Date Awarded / Promoted:
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  id="input-promotion-date"
                  type="date"
                  value={promotedDate}
                  onChange={(e) => setPromotedDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="input-professor-academy"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1"
              >
                Professor / Academy / Lineage:
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  id="input-professor-academy"
                  type="text"
                  placeholder="e.g. Your Professor or Academy name"
                  value={professorOrAcademy}
                  onChange={(e) => setProfessorOrAcademy(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="input-rank-notes"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1"
              >
                Rank Goals & Training Focus:
              </label>
              <textarea
                id="input-rank-notes"
                rows={2}
                placeholder="e.g. Focusing on passing pressure, half guard bottom retention, and 100 sparring rounds..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              />
            </div>
          </div>

          {/* App Visual Theme & Mat Palette Selector */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  BJJ Mat & Belt Color Theme
                </span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                {BJJ_THEMES[currentTheme]?.name || 'Theme'}
              </span>
            </div>

            <p className="text-[11px] text-neutral-500">
              Personalize your background and accent colors to match your belt or favorite gear.
            </p>

            {/* Theme swatches */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
              {(Object.keys(BJJ_THEMES) as BjjThemeId[]).map((themeKey) => {
                const theme = BJJ_THEMES[themeKey];
                const isSelected = currentTheme === themeKey;

                // Inverse mapping for modal preview
                const THEME_TO_RANK: Partial<Record<BjjThemeId, string>> = {
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

                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => {
                      onSelectTheme(themeKey);
                      const mappedRankId = THEME_TO_RANK[themeKey];
                      if (mappedRankId) {
                        const targetBelt = ALL_BELTS.find((b) => b.id === mappedRankId);
                        if (targetBelt) {
                          setActiveDivision(targetBelt.division);
                          setSelectedRankId(targetBelt.id);
                          if (stripes > targetBelt.maxStripes) {
                            setStripes(targetBelt.maxStripes);
                          }
                        }
                      }
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs ring-2 ring-amber-400/50 font-bold'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100 font-medium'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0 shadow-2xs"
                      style={{ backgroundColor: theme.beltColor }}
                    />
                    <span className="truncate text-[11px]">{theme.name.split('(')[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="bg-neutral-50 px-5 py-3.5 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4 text-amber-400" />
            <span>Save My Rank</span>
          </button>
        </div>
      </div>
    </div>
  );
};
