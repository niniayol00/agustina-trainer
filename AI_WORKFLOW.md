# AI_WORKFLOW.md

## Purpose

This workflow reduces breakage during large refactors and ensures
consistent, reproducible edits by an AI coding agent.

The agent must follow this workflow strictly.

------------------------------------------------------------------------

## Operating Mode

-   Do not guess file contents.
-   Read the current repository files before editing.
-   Prefer small, consistent changes with validation steps.
-   Never delete features without replacing them with an equivalent.
-   Keep the site functional after every step.

------------------------------------------------------------------------

## Input Sources

The agent must treat the following as the source of truth:

1.  PROJECT_RULES.md (highest priority)
2.  SEO_STRATEGY.md (content structure and on-page strategy)
3.  TASK_REFACTOR.md (work to perform)
4.  Existing repository files (current implementation)

------------------------------------------------------------------------

## Step-by-Step Workflow

### Step 1 --- Inventory

-   List all files found in the repository.
-   Identify which required files are missing.
-   Identify where CSS and JS currently live (inline vs external).
-   Identify all image references and their current paths.

### Step 2 --- Establish Baseline

-   Run the local server (serve.mjs).
-   Take a baseline screenshot using screenshot.mjs.
-   Record baseline issues (broken layout, missing assets, console
    errors).

### Step 3 --- Refactor Plan (Implementation Order)

The agent must apply changes in this order:

1)  Image pipeline (tools/optimize-images.mjs + /images output)
2)  Update index.html image references (hero + OG)
3)  Create styles.css and move styles out of inline/duplicated systems
4)  Create main.js and move scripts out of inline blocks
5)  Accessibility pass (menu, lightbox, keyboard support)
6)  SEO pass (head tags + schema + anchors + alt text)
7)  Add robots.txt + sitemap.xml
8)  Update manifest.json + icons folder paths
9)  Update serve.mjs cache headers
10) Update package.json scripts

### Step 4 --- Safety Rules for Edits

-   Add null-guards before touching any DOM node in JS.
-   Any feature that depends on an element must check existence.
-   Any dynamic UI must be keyboard-operable.
-   Any overlay must implement: ESC close, focus trap, restore focus.
-   No inline style updates in JS except for trivial state; prefer CSS
    classes.

### Step 5 --- Content Rules

-   Do not add fake claims, fake reviews, fake certifications.
-   Do not add an address if not provided.
-   Keep Spanish copy primary.
-   Use SEO_STRATEGY.md to expand headings and add FAQ content without
    changing meaning.

### Step 6 --- Asset Rules

-   Do not overwrite originals in brand_assets.
-   Generate new optimized assets in /images only.
-   Ensure hero and og images are consistent:
    -   hero: /images/hero-agustina.webp + .avif
    -   og: /images/og-hero.webp (1200x630)
-   Every `<img>`{=html} must have width/height and lazy/async
    attributes (except hero which is high priority).

### Step 7 --- Verification

After implementing changes, the agent must:

-   Run server locally
-   Open page and confirm no console errors
-   Run screenshot.mjs and compare visually with baseline
-   Confirm:
    -   One H1 only
    -   Head tags present
    -   Schema JSON-LD present
    -   Robots and sitemap exist
    -   Menu and lightbox keyboard support works
    -   Slider does not crash if fewer images exist
    -   No missing asset 404s

### Step 8 --- Output Requirements

The agent must output:

-   Full contents of all changed/new files
-   A short "RUN COMMANDS" block
-   A "DONE CHECKLIST" confirming every major requirement is satisfied

------------------------------------------------------------------------

## Minimal Run Commands

npm install npm run optimize-images npm run dev

------------------------------------------------------------------------

## Disallowed Behaviors

-   Do not remove entire sections unless explicitly told.
-   Do not introduce frameworks (React/Next) unless explicitly
    requested.
-   Do not hardcode colors in JS.
-   Do not leave duplicated CSS systems.
-   Do not use background-image for hero.

------------------------------------------------------------------------

## Acceptance Checklist (Agent Must Pass)

-   [ ] PROJECT_RULES.md satisfied
-   [ ] TASK_REFACTOR.md satisfied
-   [ ] SEO_STRATEGY.md applied
-   [ ] Images optimized via sharp and referenced from /images
-   [ ] Hero uses `<picture>`{=html} and is preloaded
-   [ ] og:image points to optimized 1200x630 asset
-   [ ] All images have width/height, loading, decoding
-   [ ] Menu and lightbox are accessible (ESC, focus trap, restore
    focus)
-   [ ] Slider is robust (Math.max clamp)
-   [ ] robots.txt and sitemap.xml exist
-   [ ] serve.mjs sends Cache-Control for assets
-   [ ] package.json scripts work
