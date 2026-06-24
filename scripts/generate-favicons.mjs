import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputImage = path.join(__dirname, '../public/logo.jpg');
const publicDir = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    if (!fs.existsSync(inputImage)) {
      console.error(`Error: Input logo file not found at ${inputImage}`);
      process.exit(1);
    }

    console.log(`Generating favicons from ${inputImage}...`);

    // 1. Generate PNGs for favicon & app icons
    const targets = [
      { name: 'favicon-16x16.png', size: 16 },
      { name: 'favicon-32x32.png', size: 32 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'android-chrome-192x192.png', size: 192 },
      { name: 'android-chrome-512x512.png', size: 512 },
    ];

    for (const target of targets) {
      const outputPath = path.join(publicDir, target.name);
      await sharp(inputImage)
        .resize(target.size, target.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${target.name}`);
    }

    // 2. Generate a standard favicon.ico
    // Since sharp cannot natively export multi-resolution .ico files,
    // we can export a 32x32 png and rename it to favicon.ico.
    // This is widely supported by all modern browsers.
    const icoPath = path.join(publicDir, 'favicon.ico');
    await sharp(inputImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFormat('png')
      .toFile(icoPath);
    console.log('✓ Generated favicon.ico (as PNG format)');

    // 3. Generate a dedicated Open Graph / Twitter share image (OG Image)
    // WhatsApp/Facebook recommend 1200x630 (1.91:1 aspect ratio) or a square 1:1 format.
    // Let's create an optimized 1200x630 banner with the logo centered.
    const ogImagePath = path.join(publicDir, 'og-image.jpg');
    
    // We resize the logo to be fit within a 630x630 square with white background
    const logoResized = await sharp(inputImage)
      .resize({
        width: 500,
        height: 500,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer();

    // Composite the logo onto a 1200x630 canvas
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    })
    .composite([{ input: logoResized, gravity: 'center' }])
    .jpeg({ quality: 90 })
    .toFile(ogImagePath);
    console.log('✓ Generated og-image.jpg (1200x630 centered logo for social previews)');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateFavicons();
