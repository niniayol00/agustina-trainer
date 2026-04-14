import puppeteer from 'puppeteer';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, 'temporary screenshots');
if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });

const url = process.argv[2];
const label = process.argv[3] || 'check';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 2000));

const scrollPositions = [8100, 9000, 9900, 10800, 11700];
for (let i = 0; i < scrollPositions.length; i++) {
  await page.evaluate(y => window.scrollTo(0, y), scrollPositions[i]);
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({ path: join(DIR, `${label}-b${i+1}.png`) });
  console.log(`Saved ${label}-b${i+1} at scroll ${scrollPositions[i]}`);
}

await browser.close();
