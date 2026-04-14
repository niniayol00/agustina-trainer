/**
 * tools/optimize-images.mjs
 * Reads brand_assets/ → generates WEBP + AVIF in images/
 * Also produces hero-agustina.webp/.avif and og-hero.webp (1200×630)
 *
 * Run: npm run optimize-images
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC  = join(__dirname, '..', 'brand_assets');
const DEST = join(__dirname, '..', 'images');
const MAX_WIDTH = 1920;

if (!existsSync(DEST)) mkdirSync(DEST, { recursive: true });

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

/** Map source filename → output basename in /images */
const HERO_SRC = '3c31ecc1-6b39-4fa7-b15e-19a565c2cced.png';

async function processImage(srcPath, name, opts = {}) {
  const { width = MAX_WIDTH, quality = 82 } = opts;
  const base = join(DEST, name);

  await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(`${base}.webp`);
  console.log(`  ✓ ${name}.webp`);

  await sharp(srcPath)
    .resize({ width, withoutEnlargement: true })
    .avif({ quality: quality - 5 })
    .toFile(`${base}.avif`);
  console.log(`  ✓ ${name}.avif`);
}

async function run() {
  const files = readdirSync(SRC).filter(f => SUPPORTED.has(extname(f).toLowerCase()));

  console.log(`\nOptimizing ${files.length} images from brand_assets/ → images/\n`);

  for (const file of files) {
    const srcPath = join(SRC, file);
    const ext     = extname(file).toLowerCase();
    const name    = basename(file, ext).replace(/[^a-z0-9_-]/gi, '-').toLowerCase();

    // Hero special handling
    if (file === HERO_SRC) {
      console.log(`[hero] ${file}`);
      await processImage(srcPath, 'hero-agustina');

      // OG image: 1200×630 crop
      await sharp(srcPath)
        .resize({ width: 1200, height: 630, fit: 'cover', position: 'top' })
        .webp({ quality: 85 })
        .toFile(join(DEST, 'og-hero.webp'));
      console.log(`  ✓ og-hero.webp`);
      continue;
    }

    console.log(`[img]  ${file}`);
    await processImage(srcPath, name);
  }

  console.log('\nDone.\n');
}

run().catch(err => { console.error(err); process.exit(1); });
