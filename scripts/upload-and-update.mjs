import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// 1. Load environment variables from .env.local manually and robustly
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
        // Remove enclosing quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
    console.log("Environment variables loaded from .env.local successfully.");
  } else {
    console.warn("Warning: .env.local not found!");
  }
}

loadEnv();

// 2. Validate environment variables
const { MONGODB_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not set.");
  process.exit(1);
}

// 3. Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

console.log("Cloudinary configured for cloud:", CLOUDINARY_CLOUD_NAME);

// 4. Helper function to recursively find all files in a folder
function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      // Only include images
      const ext = path.extname(fullPath).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'].includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

// 5. Clean product name function
const colorsToRemove = [
  'Emerald Green', 'Royal Blue', 'Gold Accent', 'Mustard Yellow',
  'Olive Green', 'Crimson Red', 'Mint Green', 'Maroon',
  'Red', 'Blue', 'Green', 'Yellow', 'Gold', 'Olive', 'Mint', 'Emerald', 'Royal', 'Crimson', 'Mustard'
];

function cleanProductName(name) {
  let cleaned = name;

  // Remove serial numbers or numbering prefixes at the start (e.g. "001 ", "12 - ", "03 ")
  cleaned = cleaned.replace(/^\d+\s*(?:-\s*)?/, '');

  // Remove serial numbers or numbering suffixes at the end (e.g. " - 1", " - 01", "-1")
  cleaned = cleaned.replace(/\s*-\s*\d+$/, '');
  cleaned = cleaned.replace(/\s+\d+$/, ''); // also handle trailing space + number

  // Remove color names case-insensitively
  for (const color of colorsToRemove) {
    // Matches the color word with boundary, optional trailing space/hyphen
    const regex = new RegExp(`\\b${color}\\b\\s*(?:-\\s*)?`, 'gi');
    cleaned = cleaned.replace(regex, '');
  }

  // Clean up extra spaces, leading/trailing hyphens, etc.
  cleaned = cleaned.replace(/\s+/g, ' '); // collapse spaces
  cleaned = cleaned.replace(/^[\s-]+|[\s-]+$/g, ''); // strip leading/trailing spaces/hyphens

  return cleaned;
}

async function run() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB database.");

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Get all products
    const products = await productsCollection.find({}).toArray();
    console.log(`Found ${products.length} products in database.`);

    // Scan public/images folder
    const imagesDir = path.resolve(process.cwd(), 'public', 'images');
    console.log(`Scanning local images directory: ${imagesDir}`);
    const localFiles = getFiles(imagesDir);
    console.log(`Found ${localFiles.length} local images.`);

    // 6. Upload all local images to Cloudinary
    console.log("\n--- Starting Cloudinary Uploads ---");
    const pathMapping = {}; // mapping from local web path to Cloudinary secure URL

    for (let i = 0; i < localFiles.length; i++) {
      const filePath = localFiles[i];
      // Compute local web path (e.g. /images/product-001.jpeg)
      const relativePath = path.relative(path.resolve(process.cwd(), 'public'), filePath);
      const webPath = '/' + relativePath.replace(/\\/g, '/');

      // Generate a clean public ID based on relative path (removing extension)
      const parsedPath = path.parse(relativePath);
      const publicIdPath = path.join(parsedPath.dir, parsedPath.name).replace(/\\/g, '/');

      console.log(`[${i + 1}/${localFiles.length}] Uploading ${webPath}...`);

      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'annaya-shopping',
          public_id: publicIdPath,
          overwrite: true,
          invalidate: true
        });

        pathMapping[webPath] = uploadResult.secure_url;
        console.log(`    Successfully uploaded: ${webPath} -> ${uploadResult.secure_url}`);
      } catch (uploadError) {
        console.error(`    Failed to upload ${webPath}:`, uploadError.message);
      }
    }

    console.log("\n--- Cloudinary Uploads Complete ---");
    console.log(`Total mapped URLs: ${Object.keys(pathMapping).length}`);

    // 7. Update products in database
    console.log("\n--- Starting Product Record Updates ---");
    let updatedCount = 0;

    for (const product of products) {
      const originalName = product.name;
      const cleanedName = cleanProductName(originalName);

      // Clean/map the images array
      let imagesUpdated = false;
      const newImages = (product.images || []).map(imgUrl => {
        // If image URL is a local path and we have a Cloudinary mapping for it, update it
        if (imgUrl.startsWith('/images/') && pathMapping[imgUrl]) {
          imagesUpdated = true;
          return pathMapping[imgUrl];
        }
        return imgUrl;
      });

      const nameUpdated = (originalName !== cleanedName);

      if (nameUpdated || imagesUpdated) {
        console.log(`Updating product ID: ${product._id}`);
        if (nameUpdated) {
          console.log(`  Name: "${originalName}" -> "${cleanedName}"`);
        }
        if (imagesUpdated) {
          console.log(`  Images: ${JSON.stringify(product.images)} -> ${JSON.stringify(newImages)}`);
        }

        await productsCollection.updateOne(
          { _id: product._id },
          {
            $set: {
              name: cleanedName,
              images: newImages
            }
          }
        );
        updatedCount++;
      }
    }

    console.log(`\n--- Product Updates Complete ---`);
    console.log(`Updated ${updatedCount} out of ${products.length} products.`);

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

run();
