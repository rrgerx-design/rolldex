import { LineageAndAcademiesData, LineageChain } from '../types';

export const LINEAGE_PRESETS: { name: string; chain: LineageChain }[] = [
  {
    name: 'Helio Gracie Lineage (Classic)',
    chain: {
      id: 'preset-helio',
      title: 'Helio Gracie Mainstream Lineage',
      isPrimary: true,
      professors: [
        'Mitsuyo Maeda (Count Koma)',
        'Carlos Gracie Sr.',
        'Helio Gracie',
        'Rickson Gracie',
        'Your Professor',
        'You'
      ],
      notes: 'Rooted in traditional Gracie Jiu-Jitsu fundamentals & self-defense.'
    }
  },
  {
    name: 'Alliance Jiu-Jitsu Lineage',
    chain: {
      id: 'preset-alliance',
      title: 'Alliance Jiu-Jitsu Lineage',
      isPrimary: true,
      professors: [
        'Mitsuyo Maeda',
        'Carlos Gracie Sr.',
        'Helio Gracie',
        'Rolls Gracie',
        'Romero "Jacare" Cavalcanti',
        'Fabio Gurgel',
        'Marcelo Garcia',
        'Your Professor',
        'You'
      ],
      notes: 'Renowned competition guard passing & dynamic modern attacking systems.'
    }
  },
  {
    name: 'Carlson Gracie Lineage',
    chain: {
      id: 'preset-carlson',
      title: 'Carlson Gracie Team Lineage',
      isPrimary: false,
      professors: [
        'Mitsuyo Maeda',
        'Carlos Gracie Sr.',
        'Carlson Gracie Sr.',
        'Murilo Bustamante / Ricardo Liborio',
        'Your Professor',
        'You'
      ],
      notes: 'Famous heavy top pressure, guard passing & tough combat-proven BJJ.'
    }
  },
  {
    name: '10th Planet / No-Gi System',
    chain: {
      id: 'preset-10th-planet',
      title: '10th Planet No-Gi Lineage',
      isPrimary: false,
      professors: [
        'Mitsuyo Maeda',
        'Carlos Gracie Sr.',
        'Helio Gracie',
        'Carlos Gracie Jr. / Jean Jacques Machado',
        'Eddie Bravo (10th Planet)',
        'Your Coach',
        'You'
      ],
      notes: 'Rubber guard, lockdown, truck, twister & leg lock attack systems.'
    }
  },
  {
    name: 'Oswaldo Fadda Lineage (Non-Gracie Roots)',
    chain: {
      id: 'preset-fadda',
      title: 'Oswaldo Fadda Lineage',
      isPrimary: false,
      professors: [
        'Mitsuyo Maeda',
        'Luis França',
        'Oswaldo Fadda',
        'Deo / Monir / Wendell',
        'Nova União / GFTeam Roots',
        'Your Professor',
        'You'
      ],
      notes: 'Famous for early mastery of foot locks and effective community-based Jiu-Jitsu.'
    }
  }
];

export const DEFAULT_LINEAGE_AND_ACADEMIES: LineageAndAcademiesData = {
  academies: [
    {
      id: 'acad-1',
      name: 'My BJJ Academy',
      isCurrent: true,
      headInstructor: 'Professor / Head Coach',
      location: 'Local Academy',
      startYear: '2024',
      rankAchieved: 'Current Academy',
      notes: 'Primary training home for daily Gi & No-Gi fundamentals, positional drilling, and open mat rounds.'
    }
  ],
  lineages: [
    {
      id: 'lin-1',
      title: 'Academy Lineage (Gi & No-Gi)',
      isPrimary: true,
      professors: [
        'Mitsuyo Maeda',
        'Carlos Gracie Sr.',
        'Helio Gracie',
        'Your Professor',
        'You'
      ],
      notes: 'Direct BJJ lineage passed down through instructors.'
    }
  ],
  updatedAt: Date.now()
};
