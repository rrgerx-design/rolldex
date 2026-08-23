export type GearType = 'Gi' | 'No-Gi' | 'Open Mat';

export type AgeDivision = 'adult' | 'kids';

export type BeltRank =
  | 'White Belt'
  | 'Blue Belt'
  | 'Purple Belt'
  | 'Brown Belt'
  | 'Black Belt'
  | string;

export interface BeltDefinition {
  id: string;
  name: string;
  division: AgeDivision;
  primaryColor: string;
  secondaryColor?: string; // for center stripe (e.g. grey-white, yellow-black)
  barType: 'black' | 'red' | 'white'; // standard black bar, professor red bar, or white bar
  barBorder?: string; // e.g. white border for black belt degrees
  maxStripes: number; // 4 for color belts, 6 for black belt, etc.
  description: string;
  minAge?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  email: string;
  createdAt: number;
}

export interface BjjRankProfile {
  division: AgeDivision;
  rankId: string;
  rankName: string;
  stripes: number; // 0-4 for color belts, 0-6 for black belt degrees
  promotedDate?: string;
  professorOrAcademy?: string;
  notes?: string;
}


export type BjjThemeId =
  | 'white-gi'
  | 'grey-belt'
  | 'yellow-belt'
  | 'orange-belt'
  | 'green-belt'
  | 'blue-belt'
  | 'purple-belt'
  | 'brown-belt'
  | 'black-belt'
  | 'coral-red-black'
  | 'coral-red-white'
  | 'red-belt'
  | 'nogi-cyber'
  | 'charcoal-stealth';

export interface BjjTheme {
  id: BjjThemeId;
  name: string;
  beltColor: string;
  rankName: string;
  bgClass: string;
  cardBg: string;
  headerBg: string;
  borderClass: string;
  accentText: string;
  accentBadge: string;
  primaryButton: string;
}

export interface TaggedTeammate {
  id?: string;
  name: string;
  beltRank?: string; // e.g. "White Belt", "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt"
  sparred?: boolean; // sparred during rounds
  drilledWith?: boolean; // drilled techniques together
  notes?: string;
}

export interface VideoLinkItem {
  id: string;
  url: string;
  title?: string;
  videoId?: string;
  category?: 'Drill Visual' | 'Sparring Video' | 'Technique Breakdown' | 'Competition Match' | 'General';
  drillNumber?: number; // 1 to 5 if associated with specific drill line
}

export interface DrillItem {
  number: number; // 1, 2, 3, 4, 5
  move: string;
  category?: string; // e.g. Guard Pass, Takedown, Sweep, Submission, Escape, Transition
  keyDetails?: string; // cues, grip details, reps
  youtubeUrl?: string; // optional direct youtube link for this drill
}

export interface BjjLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  classNumber: number | string;
  gear: GearType;
  coach: string;
  drills: [string, string, string, string, string]; // exactly 5 lines for drills/moves
  drillDetails?: DrillItem[];
  submissionsGot: string; // submissions you landed
  submissionsDefended?: string; // submissions defended/tapped to
  sparringNotes?: string; // rounds/partners/intensity
  personalNotes: string; // extra lines for notes
  photos?: string[]; // attached photos/whiteboard notes/gym snapshots
  taggedTeammates?: TaggedTeammate[]; // Tagged classmates & sparring partners
  taggedPartners?: string[]; // Quick string array fallback
  youtubeVideos?: VideoLinkItem[]; // YouTube drill visuals, tutorials & sparring footage
  createdAt: number;
}

export interface LogFilterState {
  searchQuery: string;
  gearFilter: 'All' | 'Gi' | 'No-Gi' | 'Open Mat';
  coachFilter: string;
  dateSort: 'desc' | 'asc';
}

export interface PlanMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  category?: 'Technique' | 'Conditioning' | 'Competition' | 'Attendance' | 'Mindset';
}

export interface FutureBjjPlan {
  targetBelt: string; // e.g. "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt", "2nd Stripe"
  targetDate: string; // YYYY-MM-DD
  targetClassCount: number; // e.g. 100 classes
  focusAreas: string; // e.g. "Guard retention, takedowns, half-guard passing"
  milestones: PlanMilestone[];
  customGoalNotes: string;
  coachFeedback?: string;
  updatedAt: number;
}

export interface NotificationReminderSettings {
  enabled: boolean;
  preferredTime: string; // e.g. "19:00"
  lastSentTimestamp?: number; // millisecond timestamp
  permissionGranted: boolean;
}

export interface AcademyRecord {
  id: string;
  name: string;
  isCurrent: boolean;
  headInstructor?: string;
  location?: string;
  startYear?: string;
  endYear?: string;
  rankAchieved?: string; // e.g. "White Belt (2 Stripes)", "Blue Belt"
  notes?: string;
}

export interface LineageChain {
  id: string;
  title: string; // e.g. "Primary Gi Lineage", "No-Gi / 10th Planet Lineage"
  isPrimary: boolean;
  professors: string[]; // e.g. ["Mitsuyo Maeda", "Carlos Gracie Sr.", "Helio Gracie", "Romero Cavalcanti", "Fabio Gurgel", "Marcelo Garcia", "Professor Mike"]
  notes?: string;
}

export interface LineageAndAcademiesData {
  academies: AcademyRecord[];
  lineages: LineageChain[];
  updatedAt: number;
}

export interface MatPhotoItem {
  id: string;
  url: string;
  date: string; // YYYY-MM-DD
  time?: string; // e.g. "10:37 PM"
  caption?: string; // e.g. "Whiteboard: Half-guard passing series"
  classLogId?: string; // optional linked class log ID
  createdAt: number;
}

export type MedalPlacement = 'gold' | 'silver' | 'bronze' | 'none';

export interface CompetitionEntry {
  id: string;
  promotionName?: string; // e.g. IBJJF, Grappling Industries, NAGA, AJP, Fuji, ADCC Trials
  tournamentName?: string; // e.g. Austin Open, Pan Championship, World Masters
  city?: string; // e.g. Austin, TX or Las Vegas, NV
  year?: string | number; // e.g. 2026
  division?: string; // e.g. Adult Blue Belt / Middleweight / Gi
  medal?: MedalPlacement; // gold, silver, bronze, none
  customPlacement?: string; // e.g. "4th Place", "Absolute Runner-Up", "Quarterfinals"
  photoUrl?: string; // Podium / action photo
  notes?: string; // Matches summary, lessons learned
  createdAt: number;
}


