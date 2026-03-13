import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'dist', 'icons');

// Ensure icons directory exists
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Create a simple bookmark icon with gradient
const createIcon = async (size) => {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4a90d9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#357abd;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
      <path d="M${size * 0.3} ${size * 0.15} L${size * 0.5} ${size * 0.4} L${size * 0.7} ${size * 0.15}" 
            stroke="white" stroke-width="${size * 0.08}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="${size * 0.25}" y="${size * 0.45}" width="${size * 0.5}" height="${size * 0.4}" 
            rx="${size * 0.05}" fill="white" opacity="0.9"/>
      <line x1="${size * 0.35}" y1="${size * 0.6}" x2="${size * 0.65}" y2="${size * 0.6}" 
            stroke="#4a90d9" stroke-width="${size * 0.06}" stroke-linecap="round"/>
      <line x1="${size * 0.35}" y1="${size * 0.72}" x2="${size * 0.55}" y2="${size * 0.72}" 
            stroke="#4a90d9" stroke-width="${size * 0.06}" stroke-linecap="round"/>
    </svg>
  `;
  
  return sharp(Buffer.from(svg)).png().toBuffer();
};

const sizes = [16, 48, 128];

async function generateIcons() {
  console.log('Generating icons...');
  
  for (const size of sizes) {
    const buffer = await createIcon(size);
    await sharp(buffer).toFile(join(iconsDir, `icon${size}.png`));
    console.log(`Created icon${size}.png`);
  }
  
  // Also create the main icon.png
  const mainIcon = await createIcon(128);
  await sharp(mainIcon).toFile(join(iconsDir, 'icon.png'));
  console.log('Created icon.png');
  
  console.log('All icons generated!');
}

generateIcons().catch(console.error);
