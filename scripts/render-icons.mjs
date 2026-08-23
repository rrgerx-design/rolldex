import sharp from 'sharp';
import fs from 'fs';

const svgLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="96" fill="#141414" />
  <circle cx="256" cy="256" r="210" fill="#1a1a1a" stroke="#2c2c2c" stroke-width="12"/>
  <circle cx="256" cy="256" r="185" fill="none" stroke="#383838" stroke-width="6" stroke-dasharray="14 10"/>
  <path d="M70 256 L442 256" stroke="#ffffff" stroke-width="60" stroke-linecap="round" />
  <rect x="270" y="226" width="136" height="60" rx="8" fill="#000000" />
  <rect x="306" y="231" width="14" height="50" rx="3" fill="#ffffff" />
  <rect x="334" y="231" width="14" height="50" rx="3" fill="#ffffff" />
  <rect x="362" y="231" width="14" height="50" rx="3" fill="#ffffff" />
  <rect x="190" y="211" width="90" height="90" rx="20" fill="#ffffff" stroke="#000000" stroke-width="10" />
  <path d="M215 296 L185 410" stroke="#ffffff" stroke-width="36" stroke-linecap="round" />
  <path d="M255 296 L285 410" stroke="#ffffff" stroke-width="36" stroke-linecap="round" />
  <path d="M277 380 L285 410" stroke="#000000" stroke-width="36" stroke-linecap="round" />
  <circle cx="256" cy="115" r="16" fill="#f59e0b" />
</svg>
`;

async function render() {
  const buf = Buffer.from(svgLogo);

  await sharp(buf)
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');

  await sharp(buf)
    .resize(512, 512)
    .png()
    .toFile('public/icon-512.png');

  await sharp(buf)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');

  console.log('Done rendering PNGs!');
}

render().catch(console.error);
