# PROJECT_RULES.md

## Project Rules

This document defines strict architecture, SEO, performance, and
accessibility standards for the project. The AI agent must follow these
rules when modifying or generating any code.

If conflicts appear between existing code and this document, this
document takes priority.

------------------------------------------------------------------------

## Project Goal

Transform the existing static website into a production-grade site
optimized for:

-   SEO
-   Core Web Vitals
-   Accessibility
-   Maintainability

Target Lighthouse scores:

Performance ≥ 95\
SEO = 100\
Accessibility ≥ 95\
Best Practices = 100

Core Web Vitals targets:

LCP \< 2.5s\
CLS \< 0.1\
INP \< 200ms

------------------------------------------------------------------------

## Existing Files

index.html\
manifest.json\
package.json\
serve.mjs\
screenshot.mjs\
screenshot-ref.mjs\
brand_assets/

Additional files may be created if needed.

------------------------------------------------------------------------

## Final Project Structure

/site\
index.html\
styles.css\
main.js

/images\
optimized images

/brand_assets\
original images

/icons\
icon-192.png\
icon-512.png

/tools\
optimize-images.mjs

manifest.json\
robots.txt\
sitemap.xml\
package.json\
serve.mjs

------------------------------------------------------------------------

## HTML Rules

Use semantic HTML:

header\
nav\
main\
section\
footer

Only ONE H1 allowed.

Use heading hierarchy:

H1 → H2 → H3

Avoid inline CSS.

Buttons must include:

type="button"

External links must include:

rel="noopener noreferrer"

------------------------------------------------------------------------

## SEO Rules

Head must include:

title\
meta description\
canonical\
OpenGraph tags\
Twitter cards

Structured data required:

ProfessionalService schema\
FAQPage schema

------------------------------------------------------------------------

## Hero Image Rule

Hero images must not use CSS background images. Use a responsive picture
element with AVIF and WEBP formats.

------------------------------------------------------------------------

## Image Performance Rules

All images must include:

loading="lazy"\
decoding="async"\
width\
height

Images must be automatically generated from the brand_assets folder.

------------------------------------------------------------------------

## Image Optimization Pipeline

Images must be processed using Node + Sharp.

Input: brand_assets/

Output: images/

Formats: WEBP\
AVIF

Max width: 1920px

------------------------------------------------------------------------

## Accessibility Rules

Menu must include:

aria-controls\
aria-expanded

Lightbox must include:

role="dialog"\
aria-modal="true"

Keyboard navigation required. ESC must close overlays. Focus must return
to the previous element.

------------------------------------------------------------------------

## Server Rules

serve.mjs must implement caching headers:

Cache-Control: public, max-age=31536000

------------------------------------------------------------------------

## Manifest Rules

manifest.json must include:

name\
short_name\
description\
start_url\
display\
orientation\
background_color\
theme_color

Icons must exist in /icons.

------------------------------------------------------------------------

## Robots Rules

robots.txt must allow indexing and reference sitemap.

------------------------------------------------------------------------

## AI Agent Instructions

Before modifying code:

1.  Read this document.
2.  Audit the entire project.
3.  Fix issues.
4.  Maintain architecture defined here.
