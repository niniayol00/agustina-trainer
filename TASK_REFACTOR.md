# TASK_REFACTOR.md

## Task

Perform a complete audit and refactor of the project while strictly
following PROJECT_RULES.md.

Output only final files ready for production.

------------------------------------------------------------------------

## Errors That Must Be Fixed

1.  Hero image implemented using CSS background.
2.  og:image inconsistent with hero image.
3.  Images not optimized for the web.
4.  Images missing width and height attributes causing CLS.
5.  Inline CSS usage.
6.  Buttons missing type attribute.
7.  JavaScript lacking DOM safety checks.
8.  Slider pagination calculation bug.

Replace:

pages = total - VISIBLE + 1

With:

pages = Math.max(1, total - VISIBLE + 1)

9.  Menu and lightbox accessibility incomplete.
10. Missing robots.txt.
11. Missing sitemap.xml.
12. manifest.json incomplete.
13. serve.mjs missing caching headers.
14. Missing automatic image optimization pipeline.

------------------------------------------------------------------------

## SEO Head Configuration

```{=html}
<title>
```
Entrenadora Personal en Mar del Plata \| Agustina Casentini
```{=html}
</title>
```
```{=html}
<meta name="description" content="Entrenamiento personalizado en Mar del Plata. Planes online y presenciales de Full Body, Funcional y Stretching con seguimiento profesional.">
```
`<link rel="canonical" href="https://agustinacasentini.com/">`{=html}

```{=html}
<meta property="og:title" content="Entrenadora Personal en Mar del Plata | Agustina Casentini">
```
```{=html}
<meta property="og:description" content="Entrenamiento personalizado online y presencial en Mar del Plata">
```
```{=html}
<meta property="og:type" content="website">
```
```{=html}
<meta property="og:url" content="https://agustinacasentini.com/">
```
```{=html}
<meta property="og:image" content="/images/og-hero.webp">
```
```{=html}
<meta name="twitter:card" content="summary_large_image">
```

------------------------------------------------------------------------

## Structured Data

Insert JSON-LD:

ProfessionalService schema\
FAQPage schema

------------------------------------------------------------------------

## Hero Implementation

Replace hero image with responsive picture element using AVIF and WEBP.

Add preload.

------------------------------------------------------------------------

## Image Optimization Pipeline

Create: tools/optimize-images.mjs

The script must:

read images from brand_assets\
generate WEBP\
generate AVIF\
resize to max width 1920px

------------------------------------------------------------------------

## Package.json Update

Replace package.json with a version including:

dev script\
optimize-images script\
build script

Dependencies:

puppeteer\
sharp

------------------------------------------------------------------------

## Manifest.json Update

Update manifest.json with full PWA configuration.

------------------------------------------------------------------------

## Server Update

serve.mjs must include caching headers.

------------------------------------------------------------------------

## Files That Must Be Generated

robots.txt\
sitemap.xml\
styles.css\
main.js

------------------------------------------------------------------------

## Commands

npm install\
npm run optimize-images\
npm run dev

------------------------------------------------------------------------

## Final Result

The project must match the architecture defined in PROJECT_RULES.md.
