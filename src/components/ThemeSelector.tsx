import React, { useState, useRef, useEffect } from 'react';
import { BjjThemeId } from '../types';
import { BJJ_THEMES } from '../data/themes';
import { Palette, Check, ChevronDown } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: BjjThemeId;
  onSelectTheme: (theme: BjjThemeId) => void;
}

interface ThemeGroup {
  label: string;
  ids: BjjThemeId[];
}

const THEME_GROUPS: ThemeGroup[] = [
  {
    label: 'Adult Belts',
    ids: ['white-gi', 'blue-belt', 'purple-belt', 'brown-belt', 'black-belt']
  },
  {
    label: 'Master & Grandmaster Belts',
    ids: ['coral-red-black', 'coral-red-white', 'red-belt']
  },
  {
    label: 'Youth & Kids Belts',
    ids: ['grey-belt', 'yellow-belt', 'orange-belt', 'green-belt']
  },
  {
    label: 'No-Gi / Grappling',
    ids: ['nogi-cyber', 'charcoal-stealth']
  }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selected = BJJ_THEMES[currentTheme] || BJJ_THEMES['white-gi'];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Trigger Button */}
      <button
        type="button"
        id="btn-theme-selector"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold rounded-md border border-white/25 bg-neutral-900/90 hover:bg-neutral-800 text-white backdrop-blur-md transition-all shadow-2xs cursor-pointer active:scale-95"
        title="Change BJJ Belt & Rashguard Theme"
      >
        <span
          className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0 shadow-xs"
          style={{ backgroundColor: selected.beltColor }}
        />
        <Palette className="w-3 h-3 text-amber-400 shrink-0 hidden sm:inline" />
        <span className="hidden sm:inline font-medium text-[11px]">{selected.name}</span>
        <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-neutral-900 border border-white/20 shadow-2xl z-50 p-2 space-y-1.5 animate-in fade-in-50 duration-150">
          <div className="px-2.5 py-1.5 border-b border-white/10 mb-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white uppercase tracking-wider font-display">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>All BJJ Belt & Mat Themes</span>
            </div>
            <p className="text-[10px] text-neutral-400">Match your actual belt rank or gear palette</p>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {THEME_GROUPS.map((group) => (
              <div key={group.label} className="space-y-0.5">
                <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                  {group.label}
                </div>
                {group.ids.map((themeKey) => {
                  const theme = BJJ_THEMES[themeKey];
                  if (!theme) return null;
                  const isSelected = currentTheme === themeKey;

                  return (
                    <button
                      key={themeKey}
                      onClick={() => {
                        onSelectTheme(themeKey);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        isSelected
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'text-neutral-200 hover:bg-neutral-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-black/40 shrink-0 shadow-xs"
                          style={{ backgroundColor: theme.beltColor }}
                        />
                        <div className="truncate">
                          <p className="leading-tight text-xs truncate">{theme.name}</p>
                          <p
                            className={`text-[9px] ${
                              isSelected ? 'text-neutral-900 font-semibold' : 'text-neutral-400'
                            }`}
                          >
                            {theme.rankName}
                          </p>
                        </div>
                      </div>

                      {isSelected && <Check className="w-3.5 h-3.5 text-neutral-950 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
