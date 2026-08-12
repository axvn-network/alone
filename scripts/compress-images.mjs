#!/usr/bin/env node
/**
 * scripts/compress-images.mjs — Lossless-ish image compression for public/
 *
 * Strategy:
 *   JPEG → quality 82, progressive, mozjpeg
 *   PNG  → quality [65,85] palette (lossy-png), or lossless fallback if bigger
 *   WEBP → skip (not needed; Next.js serves webp via <Image>)
 *
 * Usage: node scripts/compress-images.mjs
 * Requires: sharp (already in dependencies)
 */

import sharp from "sharp";
import { readdirSync, statSync, renameSync, unlinkSync } from "fs";
import { join, extname, basename } from "path";

const PUBLIC_DIR = new URL("../public", import.meta.url).pathname;

const JPEG_QUALITY = 82;      // good balance visual / size
const PNG_QUALITY  = [65, 85]; // min/max for pngquant-style lossy

const files = readdirSync(PUBLIC_DIR).filter(f => {
  const ext = extname(f).toLowerCase();
  return [".jpg", ".jpeg", ".png"].includes(ext);
});

let totalBefore = 0;
let totalAfter  = 0;

async function compressFile(filename) {
  const src  = join(PUBLIC_DIR, filename);
  const tmp  = src + ".tmp";
  const ext  = extname(filename).toLowerCase();
  const before = statSync(src).size;

  try {
    if (ext === ".jpg" || ext === ".jpeg") {
      await sharp(src)
        .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
        .toFile(tmp);
    } else if (ext === ".png") {
      // Try lossy palette PNG first
      await sharp(src)
        .png({ quality: PNG_QUALITY[1], compressionLevel: 9, palette: true })
        .toFile(tmp);
    }

    const after = statSync(tmp).size;

    if (after < before) {
      renameSync(tmp, src);
      const saved = ((before - after) / before * 100).toFixed(1);
      const beforeKB = (before / 1024).toFixed(0);
      const afterKB  = (after  / 1024).toFixed(0);
      console.log(`  ✓ ${filename.padEnd(40)} ${beforeKB}KB → ${afterKB}KB  (-${saved}%)`);
      totalBefore += before;
      totalAfter  += after;
    } else {
      // Compressed is bigger — keep original
      unlinkSync(tmp);
      console.log(`  ─ ${filename.padEnd(40)} ${(before/1024).toFixed(0)}KB  (already optimal)`);
      totalBefore += before;
      totalAfter  += before;
    }
  } catch (err) {
    try { unlinkSync(tmp); } catch {}
    console.error(`  ✗ ${filename}: ${err.message}`);
    totalBefore += before;
    totalAfter  += before;
  }
}

console.log(`\nCompressing ${files.length} images in public/...\n`);

for (const f of files) {
  await compressFile(f);
}

const savedMB   = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(2);
const savedPct  = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1);
const beforeMB  = (totalBefore / 1024 / 1024).toFixed(2);
const afterMB   = (totalAfter  / 1024 / 1024).toFixed(2);

console.log(`\n${"─".repeat(60)}`);
console.log(`  Total: ${beforeMB}MB → ${afterMB}MB  (saved ${savedMB}MB / ${savedPct}%)`);
console.log(`${"─".repeat(60)}\n`);
