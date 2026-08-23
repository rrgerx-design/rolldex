import { BeltDefinition } from '../types';

export const ADULT_BELTS: BeltDefinition[] = [
  {
    id: 'adult-white',
    name: 'White Belt',
    division: 'adult',
    primaryColor: '#F8FAFC',
    barType: 'black',
    maxStripes: 4,
    description: 'Beginner rank • Foundations of defense, posture, and escapes',
    minAge: 'All ages'
  },
  {
    id: 'adult-blue',
    name: 'Blue Belt',
    division: 'adult',
    primaryColor: '#1D4ED8',
    barType: 'black',
    maxStripes: 4,
    description: 'Fundamental technical competency, passing, and basic guard game',
    minAge: '16+ years'
  },
  {
    id: 'adult-purple',
    name: 'Purple Belt',
    division: 'adult',
    primaryColor: '#7E22CE',
    barType: 'black',
    maxStripes: 4,
    description: 'Advanced combinations, fluidity, guard retention, and personalized game',
    minAge: '16+ years'
  },
  {
    id: 'adult-brown',
    name: 'Brown Belt',
    division: 'adult',
    primaryColor: '#78350F',
    barType: 'black',
    maxStripes: 4,
    description: 'Elite refinement, heavy pressure, submission chains, and transitions',
    minAge: '18+ years'
  },
  {
    id: 'adult-black',
    name: 'Black Belt (Faixa Preta)',
    division: 'adult',
    primaryColor: '#171717',
    barType: 'red',
    barBorder: '#FFFFFF',
    maxStripes: 6, // 1st to 6th Degree Professor
    description: 'Mastery of art, teaching mastery, 1st through 6th Degree Professor',
    minAge: '19+ years'
  },
  {
    id: 'adult-coral-red-black',
    name: 'Coral Belt (7th Degree Red & Black)',
    division: 'adult',
    primaryColor: '#DC2626',
    secondaryColor: '#171717',
    barType: 'white',
    maxStripes: 0,
    description: 'Master (Faixa Vermelha e Preta) • 7th Degree Master (30+ yrs at black belt)',
    minAge: '50+ years'
  },
  {
    id: 'adult-coral-red-white',
    name: 'Coral Belt (8th Degree Red & White)',
    division: 'adult',
    primaryColor: '#DC2626',
    secondaryColor: '#FFFFFF',
    barType: 'white',
    maxStripes: 0,
    description: 'Senior Master (Faixa Vermelha e Branca) • 8th Degree Master',
    minAge: '57+ years'
  },
  {
    id: 'adult-red',
    name: 'Red Belt (9th / 10th Degree Grandmaster)',
    division: 'adult',
    primaryColor: '#B91C1C',
    barType: 'white',
    maxStripes: 0,
    description: 'Grandmaster (Grande Mestre • Faixa Vermelha)',
    minAge: '67+ years'
  }
];

export const KIDS_BELTS: BeltDefinition[] = [
  // White
  {
    id: 'kids-white',
    name: 'Youth White Belt',
    division: 'kids',
    primaryColor: '#F8FAFC',
    barType: 'black',
    maxStripes: 4,
    description: 'Youth foundation • Discipline, body awareness, and safe falling',
    minAge: 'Ages 4-15'
  },
  // Grey Group (Ages 4-15)
  {
    id: 'kids-grey-white',
    name: 'Grey / White Belt',
    division: 'kids',
    primaryColor: '#94A3B8',
    secondaryColor: '#F8FAFC',
    barType: 'black',
    maxStripes: 4,
    description: 'Grey belt with white center line • Early youth milestones',
    minAge: 'Ages 4-15'
  },
  {
    id: 'kids-grey',
    name: 'Solid Grey Belt',
    division: 'kids',
    primaryColor: '#64748B',
    barType: 'black',
    maxStripes: 4,
    description: 'Solid grey belt • Core youth guard & mount control',
    minAge: 'Ages 4-15'
  },
  {
    id: 'kids-grey-black',
    name: 'Grey / Black Belt',
    division: 'kids',
    primaryColor: '#64748B',
    secondaryColor: '#0F172A',
    barType: 'black',
    maxStripes: 4,
    description: 'Grey belt with black center line • Advanced grey milestone',
    minAge: 'Ages 4-15'
  },
  // Yellow Group (Ages 7-15)
  {
    id: 'kids-yellow-white',
    name: 'Yellow / White Belt',
    division: 'kids',
    primaryColor: '#EAB308',
    secondaryColor: '#F8FAFC',
    barType: 'black',
    maxStripes: 4,
    description: 'Yellow belt with white center line',
    minAge: 'Ages 7-15'
  },
  {
    id: 'kids-yellow',
    name: 'Solid Yellow Belt',
    division: 'kids',
    primaryColor: '#CA8A04',
    barType: 'black',
    maxStripes: 4,
    description: 'Solid yellow belt • Active sweeps, guard passing, and control',
    minAge: 'Ages 7-15'
  },
  {
    id: 'kids-yellow-black',
    name: 'Yellow / Black Belt',
    division: 'kids',
    primaryColor: '#CA8A04',
    secondaryColor: '#0F172A',
    barType: 'black',
    maxStripes: 4,
    description: 'Yellow belt with black center line',
    minAge: 'Ages 7-15'
  },
  // Orange Group (Ages 10-15)
  {
    id: 'kids-orange-white',
    name: 'Orange / White Belt',
    division: 'kids',
    primaryColor: '#F97316',
    secondaryColor: '#F8FAFC',
    barType: 'black',
    maxStripes: 4,
    description: 'Orange belt with white center line',
    minAge: 'Ages 10-15'
  },
  {
    id: 'kids-orange',
    name: 'Solid Orange Belt',
    division: 'kids',
    primaryColor: '#EA580C',
    barType: 'black',
    maxStripes: 4,
    description: 'Solid orange belt • Dynamic sparring and submission proficiency',
    minAge: 'Ages 10-15'
  },
  {
    id: 'kids-orange-black',
    name: 'Orange / Black Belt',
    division: 'kids',
    primaryColor: '#EA580C',
    secondaryColor: '#0F172A',
    barType: 'black',
    maxStripes: 4,
    description: 'Orange belt with black center line',
    minAge: 'Ages 10-15'
  },
  // Green Group (Ages 13-15)
  {
    id: 'kids-green-white',
    name: 'Green / White Belt',
    division: 'kids',
    primaryColor: '#16A34A',
    secondaryColor: '#F8FAFC',
    barType: 'black',
    maxStripes: 4,
    description: 'Green belt with white center line • Senior youth rank',
    minAge: 'Ages 13-15'
  },
  {
    id: 'kids-green',
    name: 'Solid Green Belt',
    division: 'kids',
    primaryColor: '#15803D',
    barType: 'black',
    maxStripes: 4,
    description: 'Solid green belt • High-level technical execution and pacing',
    minAge: 'Ages 13-15'
  },
  {
    id: 'kids-green-black',
    name: 'Green / Black Belt',
    division: 'kids',
    primaryColor: '#15803D',
    secondaryColor: '#0F172A',
    barType: 'black',
    maxStripes: 4,
    description: 'Green belt with black center line • Highest youth graduation rank',
    minAge: 'Ages 13-15'
  }
];

export const ALL_BELTS = [...ADULT_BELTS, ...KIDS_BELTS];

export const DEFAULT_RANK_PROFILE = {
  division: 'adult' as const,
  rankId: 'adult-white',
  rankName: 'White Belt',
  stripes: 0,
  promotedDate: new Date().toISOString().slice(0, 10),
  professorOrAcademy: '',
  notes: 'Every black belt was once a white belt who refused to quit.'
};

export const CREATOR_ATTRIBUTION = {
  authorEmail: '',
  authorTag: 'RollDex Team',
  appName: 'RollDex',
  license: '100% Free Open-Access BJJ Training License',
  rightsStatement: 'Original Software Architecture & Concept for Brazilian Jiu-Jitsu practitioners. Free for public martial arts practitioner use.'
};
