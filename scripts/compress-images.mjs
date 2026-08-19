#!/usr/bin/env node
/**
 * scripts/compress-images.mjs
 *
 * Losslessly compress all images under public/ using sharp.
 * Skips files that already have an optimised companion (*.webp).
 *
 * Usage:
 *   node scripts/compress-images.mjs
 *   make compress-images
 *   npm run compress:images
 *
 * Requires: sharp (already in dependencies)
 */

import { readdir, stat, rename } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

const SUPPORTED = new Set([".jpg", ".jpeg", ".png"]);
const MAX_WIDTH = 2400; // px — downscale only, never upscale

let processed = 0;
let skipped = 0;
let saved = 0; // bytes

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && SUPPORTED.has(extname(entry.name).toLowerCase())) {
      yield full;
    }
  }
}

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  const { size: before } = await stat(filePath);

  const tmp = filePath + ".tmp";

  let pipeline = sharp(filePath).rotate(); // auto-rotate via EXIF

  // Downscale only if wider than MAX_WIDTH
  const meta = await sharp(filePath).metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  if (ext === ".png") {
    await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(tmp);
  } else {
    // .jpg / .jpeg
    await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(tmp);
  }

  const { size: after } = await stat(tmp);

  if (after < before) {
    await rename(tmp, filePath);
    saved += before - after;
    processed++;
    const pct = (((before - after) / before) * 100).toFixed(1);
    console.log(`  [${pct}%] ${filePath.replace(PUBLIC_DIR + "/", "")}`);
  } else {
    // sharp output was larger — keep original
    const { unlink } = await import("node:fs/promises");
    await unlink(tmp);
    skipped++;
  }
}

console.log("\n  Compressing images in public/...\n");

for await (const file of walk(PUBLIC_DIR)) {
  try {
    await compress(file);
  } catch (e) {
    console.warn(`  [!] Skipped ${file}: ${e.message}`);
    skipped++;
  }
}

const savedKb = (saved / 1024).toFixed(1);
console.log(`\n  Done. ${processed} compressed, ${skipped} skipped. Saved ${savedKb} KB.\n`);
