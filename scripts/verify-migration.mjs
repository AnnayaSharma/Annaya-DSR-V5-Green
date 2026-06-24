import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// 1. Load environment variables
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex > 0) {
        const key = trimmed.substring(0, equalsIndex).trim();
        let val = trimmed.substring(equalsIndex + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
  }
}

loadEnv();

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not set.");
  process.exit(1);
}

async function verify() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();

    console.log(`Checking ${products.length} products...\n`);

    let invalidNames = 0;
    let localImages = 0;
    const results = [];

    const colors = [
      'Emerald Green', 'Royal Blue', 'Gold Accent', 'Mustard Yellow',
      'Olive Green', 'Crimson Red', 'Mint Green', 'Maroon',
      'Red', 'Blue', 'Green', 'Yellow', 'Gold', 'Olive', 'Mint', 'Emerald', 'Royal', 'Crimson', 'Mustard'
    ];

    for (const p of products) {
      // Check if name contains color or serial suffixes
      const name = p.name;
      const hasNumberSuffix = /\d+$/.test(name);
      const hasNumberPrefix = /^\d+/.test(name);
      let hasColor = false;
      
      for (const color of colors) {
        const regex = new RegExp(`\\b${color}\\b`, 'i');
        if (regex.test(name)) {
          hasColor = true;
          break;
        }
      }

      const isLocalImage = (p.images || []).some(img => img.startsWith('/images/'));

      if (hasNumberSuffix || hasNumberPrefix || hasColor) {
        invalidNames++;
        console.warn(`[WARNING] Product has potentially uncleaned name: "${name}" (ID: ${p._id})`);
      }

      if (isLocalImage) {
        localImages++;
        console.warn(`[WARNING] Product has local image paths: ${JSON.stringify(p.images)} (ID: ${p._id})`);
      }

      results.push({
        id: p._id.toString().substring(0, 8) + '...',
        name: name,
        images: (p.images && p.images[0]) ? p.images[0].substring(0, 50) + '...' : 'None'
      });
    }

    console.log("\nSample verification data:");
    console.table(results.slice(0, 10));

    console.log(`\nVerification Summary:`);
    console.log(`- Total products checked: ${products.length}`);
    console.log(`- Products with uncleaned names: ${invalidNames}`);
    console.log(`- Products with local images: ${localImages}`);

    if (invalidNames === 0 && localImages === 0) {
      console.log("\n[SUCCESS] All product names are clean, and all images are loaded from Cloudinary!");
    } else {
      console.log("\n[FAILURE] Some issues were detected. Check the warnings above.");
    }

  } catch (err) {
    console.error("Verification script failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

verify();
