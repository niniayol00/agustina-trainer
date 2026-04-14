/**
 * screenshot.mjs — requires Node.js with puppeteer installed
 * Usage: node screenshot.mjs http://localhost:3000 [label]
 *
 * NOTE: In this environment, use screenshot.py (Python/Playwright) instead.
 */
import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, 'temporary screenshots');
if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

// Find next available index
let n = 1;
while (existsSync(join(DIR, `screenshot-${n}${label}.png`))) n++;
const outPath = join(DIR, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outPath}`);
