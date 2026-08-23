export interface TaggedTeammate {
  id?: string;
  name: string;
  beltRank?: string; // e.g. "White Belt", "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt"
  sparred?: boolean; // participated in sparring rounds
  drilledWith?: boolean; // drilled techniques together
  notes?: string;
}

export const PARTNERS_STORAGE_KEY = 'bytechoke_training_partners_roster_v1';

export const DEFAULT_TRAINING_PARTNERS: TaggedTeammate[] = [];

export function getSavedPartnersRoster(): TaggedTeammate[] {
  try {
    const saved = localStorage.getItem(PARTNERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load partners roster', e);
  }
  return DEFAULT_TRAINING_PARTNERS;
}

export function savePartnersRoster(roster: TaggedTeammate[]): void {
  try {
    localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(roster));
  } catch (e) {
    console.error('Failed to save partners roster', e);
  }
}

export function getBeltBadgeColor(rank?: string): { bg: string; text: string; border: string } {
  const r = (rank || '').toLowerCase();
  if (r.includes('black')) {
    return { bg: 'bg-neutral-900', text: 'text-amber-300', border: 'border-neutral-800' };
  }
  if (r.includes('brown')) {
    return { bg: 'bg-amber-950', text: 'text-amber-200', border: 'border-amber-900' };
  }
  if (r.includes('purple')) {
    return { bg: 'bg-purple-900', text: 'text-purple-200', border: 'border-purple-700' };
  }
  if (r.includes('blue')) {
    return { bg: 'bg-blue-900', text: 'text-blue-200', border: 'border-blue-700' };
  }
  return { bg: 'bg-neutral-200', text: 'text-neutral-900', border: 'border-neutral-300' };
}
