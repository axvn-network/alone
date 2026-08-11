const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });
const cloudinary = require("cloudinary").v2;

// Verify credentials
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Error: Cloudinary credentials are not set in .env.local");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const filesToUpload = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
  "Azzam-El-Khatib.jpeg",
  "Hero-Background.png",
  "Logo for sticky header.png",
  "Rency-Regular.woff2",
  "Serhii-Pohrebniak.jpeg",
  "_redirects",
  "african-man-black-suit.jpg",
  "black-men-cafe-have-business.jpg",
  "business.jpg",
  "businessman-reading.jpg",
  "discussing-business.jpg",
  "employees.jpg",
  "gold-coins.jpg",
  "home-image.jpg",
  "invest-demo.png",
  "invest-demo1.png",
  "large-logo.png",
  "large-logo1.png",
  "phone-logo - Copy.png",
  "phone-logo.png",
  "plants-coins.jpg",
  "portrait-smiling.jpg",
  "small-logo.png",
  "strategy-ideas.jpg",
  "website image.png"
];

const publicDir = path.join(__dirname, "../public");

async function uploadFiles() {
  console.log(`Starting upload to Cloudinary (Cloud: ${process.env.CLOUDINARY_CLOUD_NAME})...`);
  const results = {};

  for (const filename of filesToUpload) {
    const filePath = path.join(publicDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}, skipping.`);
      continue;
    }

    try {
      console.log(`Uploading ${filename}...`);
      const res = await cloudinary.uploader.upload(filePath, {
        use_filename: true,
        unique_filename: false,
        resource_type: "auto",
        folder: "fortress/public" // Storing under a fortress/public folder
      });
      console.log(`✓ Uploaded ${filename} -> ${res.secure_url}`);
      results[filename] = res.secure_url;
    } catch (err) {
      console.error(`✗ Failed to upload ${filename}:`, err.message);
    }
  }

  // Save the mapping to a file for reference
  const mappingPath = path.join(__dirname, "cloudinary-mapping.json");
  fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));
  console.log(`Upload complete. Mapping saved to ${mappingPath}`);
}

uploadFiles();
