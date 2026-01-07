import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// SVG source for PWA icon - DevTools Hub logo
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#0c1117"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="url(#bgGrad)"/>
  
  <!-- Inner glow -->
  <rect x="32" y="32" width="448" height="448" rx="72" fill="#1e293b" opacity="0.4"/>
  
  <!-- Code brackets -->
  <g fill="none" stroke="url(#accentGrad)" stroke-width="32" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="175,155 105,256 175,357"/>
    <polyline points="337,155 407,256 337,357"/>
  </g>
  
  <!-- Center slash -->
  <line x1="210" y1="360" x2="302" y2="152" stroke="#22c55e" stroke-width="28" stroke-linecap="round"/>
  
  <!-- Decorative dots -->
  <circle cx="256" cy="80" r="14" fill="#8b5cf6"/>
  <circle cx="210" cy="80" r="10" fill="#f59e0b"/>
  <circle cx="302" cy="80" r="10" fill="#ef4444"/>
  
  <!-- Bottom accent -->
  <rect x="140" y="420" width="232" height="8" rx="4" fill="url(#accentGrad)" opacity="0.7"/>
</svg>`;

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Save updated SVG
  const svgPath = path.join(iconsDir, 'icon.svg');
  fs.writeFileSync(svgPath, svgIcon);
  console.log('✅ Saved icon.svg');

  // Generate PNG icons for each size
  for (const size of sizes) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generated icon-${size}x${size}.png`);
  }

  // Generate apple-touch-icon (180x180)
  await sharp(Buffer.from(svgIcon))
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('✅ Generated apple-touch-icon.png (180x180)');

  // Generate favicon (32x32)
  await sharp(Buffer.from(svgIcon))
    .resize(32, 32)
    .png()
    .toFile(path.join(iconsDir, 'favicon-32x32.png'));
  console.log('✅ Generated favicon-32x32.png');

  // Generate favicon (16x16)
  await sharp(Buffer.from(svgIcon))
    .resize(16, 16)
    .png()
    .toFile(path.join(iconsDir, 'favicon-16x16.png'));
  console.log('✅ Generated favicon-16x16.png');

  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
