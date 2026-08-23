import bjjDojoHeritageBg from '../assets/images/header_bjj_bg_1787242467519.jpg';

export interface HeaderBackgroundPreset {
  id: string;
  name: string;
  category: 'BJJ Academy & Mats' | 'BJJ Gis & Kimonos';
  description: string;
  imageUrl: string;
}

// BJJ Gi Kimono Lapels & Black Belt on Woven Tatami Mats
export const BJJ_GI_KIMONO_TATAMI_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 240" width="100%" height="100%">
  <defs>
    <!-- Heavy Duty Pearl Weave Cotton Pattern -->
    <pattern id="pearlWeaveFabric" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="%23f8fafc" />
      <rect x="0" y="0" width="7" height="7" rx="1" fill="%23e2e8f0" />
      <rect x="8" y="8" width="7" height="7" rx="1" fill="%23e2e8f0" />
      <line x1="0" y1="8" x2="16" y2="8" stroke="%23cbd5e1" stroke-width="0.5"/>
      <line x1="8" y1="0" x2="8" y2="16" stroke="%23cbd5e1" stroke-width="0.5"/>
    </pattern>

    <!-- Tatami Mat Ground -->
    <pattern id="matStrawTile" width="30" height="15" patternUnits="userSpaceOnUse">
      <rect width="30" height="15" fill="%231e293b" />
      <line x1="0" y1="7.5" x2="30" y2="7.5" stroke="%23334155" stroke-width="1"/>
      <line x1="15" y1="0" x2="15" y2="7.5" stroke="%23334155" stroke-width="1"/>
      <line x1="0" y1="7.5" x2="0" y2="15" stroke="%23334155" stroke-width="1"/>
      <line x1="30" y1="7.5" x2="30" y2="15" stroke="%23334155" stroke-width="1"/>
    </pattern>

    <radialGradient id="giMatLighting" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="%23f59e0b" stop-opacity="0.25" />
      <stop offset="50%" stop-color="%231e293b" stop-opacity="0.2" />
      <stop offset="100%" stop-color="%23090d16" stop-opacity="0.95" />
    </radialGradient>
  </defs>

  <!-- Mat Ground -->
  <rect width="1600" height="240" fill="%230f172a" />
  <rect width="1600" height="240" fill="url(%23matStrawTile)" opacity="0.8" />

  <!-- Left: White Pearl Weave BJJ Gi Jacket with Embroidered Patch -->
  <g transform="translate(340, 115) scale(1)">
    <path d="M-130,-75 L-60,-85 L0,-30 L60,-85 L130,-75 L110,65 L-110,65 Z" fill="url(%23pearlWeaveFabric)" stroke="%2394a3b8" stroke-width="2" />
    <path d="M-60,-85 L20,65" stroke="%230284c7" stroke-width="10" stroke-linecap="round" opacity="0.85" />
    <path d="M60,-85 L-20,65" stroke="%230284c7" stroke-width="10" stroke-linecap="round" opacity="0.85" />
    <!-- BJJ Academy Chest Embroidery Patch -->
    <rect x="-95" y="-30" width="34" height="42" rx="3" fill="%23dc2626" stroke="%23f59e0b" stroke-width="1.5" />
    <polygon points="-78,-24 -64,-3 -92,-3" fill="%23ffffff" />
    <text x="-78" y="7" font-family="system-ui, sans-serif" font-size="7" font-weight="900" fill="%23ffffff" text-anchor="middle">BJJ</text>
    <!-- Tied Black Belt with Red Professor Sleeve across Gi waist -->
    <rect x="-115" y="32" width="230" height="16" rx="3" fill="%23090d16" stroke="%23334155" stroke-width="1" />
    <rect x="35" y="32" width="45" height="16" fill="%23dc2626" stroke="%23991b1b" stroke-width="0.5" />
    <line x1="48" y1="32" x2="48" y2="48" stroke="%23ffffff" stroke-width="2" />
    <line x1="56" y1="32" x2="56" y2="48" stroke="%23ffffff" stroke-width="2" />
    <line x1="64" y1="32" x2="64" y2="48" stroke="%23ffffff" stroke-width="2" />
    <line x1="72" y1="32" x2="72" y2="48" stroke="%23ffffff" stroke-width="2" />
    <!-- Belt Hanging Tails -->
    <path d="M-15,48 L-22,95 L-6,95 L0,48 Z" fill="%23090d16" />
    <path d="M0,48 L6,95 L22,95 L15,48 Z" fill="%23090d16" />
    <rect x="7" y="74" width="14" height="16" fill="%23dc2626" />
    <text x="0" y="112" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="%2338bdf8" text-anchor="middle" letter-spacing="2">450 GSM PEARL WEAVE GI</text>
  </g>

  <!-- Center: Jiu-Jitsu Heritage Calligraphy & Philosophy -->
  <g transform="translate(800, 110)" opacity="0.3">
    <text font-family="'Times New Roman', serif" font-weight="900" font-size="110" fill="%23ffffff" text-anchor="middle" letter-spacing="35">柔術衣</text>
  </g>
  <g transform="translate(800, 155)" opacity="0.6">
    <text font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="%23fbbf24" text-anchor="middle" letter-spacing="6">
      ★ THE GI IS THE CHESSBOARD • ARTE SUAVE ★
    </text>
  </g>

  <!-- Right: Royal Blue BJJ Competition Gi Jacket -->
  <g transform="translate(1260, 115) scale(1)">
    <path d="M-130,-75 L-60,-85 L0,-30 L60,-85 L130,-75 L110,65 L-110,65 Z" fill="%231d4ed8" stroke="%231e3a8a" stroke-width="2" />
    <path d="M-60,-85 L20,65" stroke="%23f59e0b" stroke-width="9" stroke-linecap="round" opacity="0.9" />
    <path d="M60,-85 L-20,65" stroke="%23f59e0b" stroke-width="9" stroke-linecap="round" opacity="0.9" />
    <!-- Chest Patch -->
    <rect x="-95" y="-30" width="34" height="42" rx="3" fill="%23ffffff" stroke="%230f172a" stroke-width="1" />
    <polygon points="-78,-24 -64,-3 -92,-3" fill="%231d4ed8" />
    <text x="-78" y="7" font-family="system-ui, sans-serif" font-size="7" font-weight="900" fill="%231d4ed8" text-anchor="middle">IBJJF</text>
    <!-- Tied Rank Belt -->
    <rect x="-115" y="32" width="230" height="16" rx="3" fill="%23090d16" stroke="%23334155" stroke-width="1" />
    <rect x="35" y="32" width="45" height="16" fill="%23dc2626" stroke="%23991b1b" stroke-width="0.5" />
    <line x1="48" y1="32" x2="48" y2="48" stroke="%23ffffff" stroke-width="2" />
    <line x1="56" y1="32" x2="56" y2="48" stroke="%23ffffff" stroke-width="2" />
    <line x1="64" y1="32" x2="64" y2="48" stroke="%23ffffff" stroke-width="2" />
    <line x1="72" y1="32" x2="72" y2="48" stroke="%23ffffff" stroke-width="2" />
    <path d="M-15,48 L-22,95 L-6,95 L0,48 Z" fill="%23090d16" />
    <path d="M0,48 L6,95 L22,95 L15,48 Z" fill="%23090d16" />
    <rect x="7" y="74" width="14" height="16" fill="%23dc2626" />
    <text x="0" y="112" font-family="system-ui, sans-serif" font-size="10" font-weight="900" fill="%23fbbf24" text-anchor="middle" letter-spacing="2">ROYAL BLUE COMPETITION GI</text>
  </g>

  <rect width="1600" height="240" fill="url(%23giMatLighting)" />
</svg>`;

export const HEADER_PRESETS: HeaderBackgroundPreset[] = [
  {
    id: 'bjj-flags-belts-dojo',
    name: 'BJJ Heritage • Brazil & USA Flags with Belts',
    category: 'BJJ Academy & Mats',
    description: 'Cinematic Brazilian Jiu-Jitsu academy with Brazilian and American flags, weathered training mats, and black & white rank belts.',
    imageUrl: bjjDojoHeritageBg
  },
  {
    id: 'bjj-gi-tatami-kimono',
    name: 'BJJ Kimono & Rank Belts on Tatami',
    category: 'BJJ Gis & Kimonos',
    description: 'White and Royal Blue Pearl Weave BJJ Kimonos with tied Black Belt rank sleeves laid out on traditional woven dojo tatami.',
    imageUrl: BJJ_GI_KIMONO_TATAMI_SVG
  }
];

export interface HeaderBackgroundConfig {
  type: 'preset' | 'custom' | 'none';
  presetId?: string;
  customUrl?: string;
  blurAmount?: number;
}

export const DEFAULT_HEADER_CONFIG: HeaderBackgroundConfig = {
  type: 'preset',
  presetId: 'bjj-flags-belts-dojo',
  customUrl: '',
  blurAmount: 0
};

