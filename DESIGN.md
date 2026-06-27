---
name: Jj Portfolio Manager
description: Private certificate and portfolio dashboard
colors:
  ink: '#09090b'
  paper: '#fafafa'
  surface: '#ffffff'
  border: '#e4e4e7'
  text-body: '#18181b'
  text-muted: '#71717a'
  text-subtle: '#a1a1aa'
  accent: '#7c3aed'
  accent-hover: '#6d28d9'
  accent-soft: '#f5f3ff'
  accent-focus: '#a78bfa'
  destructive: '#dc2626'
  ink-dark: '#f4f4f5'
  paper-dark: '#0c0c0e'
  surface-dark: '#18181b'
  border-dark: '#27272a'
  text-body-dark: '#f4f4f5'
  text-muted-dark: '#a1a1aa'
  text-subtle-dark: '#71717a'
  accent-dark: '#a78bfa'
  accent-hover-dark: '#8b5cf6'
  accent-soft-dark: 'rgba(124, 58, 237, 0.12)'
  accent-focus-dark: '#c4b5fd'
typography:
  body:
    fontFamily: Mali, ui-sans-serif, system-ui, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: Mali, ui-sans-serif, system-ui, sans-serif
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.01em
  title:
    fontFamily: Mali, ui-sans-serif, system-ui, sans-serif
    fontSize: clamp(20px, 2.5vw, 36px)
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.01em
  data:
    fontFamily: SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.1em
    textTransform: uppercase
rounded:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
spacing:
  page: clamp(12px, 2.4vw, 32px)
  gap-sm: 8px
  gap-md: 16px
  gap-lg: 24px
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    rounded: 999px
    padding: 11px 18px
  button-primary-hover:
    backgroundColor: '#27272a'
    textColor: '{colors.paper}'
  button-primary-dark:
    backgroundColor: '{colors.ink-dark}'
    textColor: '{colors.ink}'
  button-primary-dark-hover:
    backgroundColor: '#e4e4e7'
    textColor: '{colors.ink}'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text-body}'
    rounded: 999px
    padding: 11px 18px
    borderColor: '{colors.border}'
  card:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.md}'
    padding: 22px
    borderColor: '{colors.border}'
  card-dark:
    backgroundColor: '{colors.surface-dark}'
    borderColor: '{colors.border-dark}'
  input:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.sm}'
    padding: 12px 14px
    borderColor: '{colors.border}'
  sidebar:
    backgroundColor: '#18181b'
    textColor: '#ffffff'
    rounded: '{rounded.lg}'
    padding: 24px 20px
---

# Design System: Jj Portfolio Manager

A purple-accented velvet-notebook feel for a private portfolio dashboard. Single-user, Thai-language, expressive yet precise.

## 1. Overview

**Creative North Star: "The Velvet Notebook"**

A polished personal journal for achievements — tactile, warm, proudly individual. The interface combines the focused utility of a productivity tool with the personality of a curated notebook.

**Key Characteristics:**
- Single sans-serif family (Mali) throughout — warm and playful, with handwritten character
- Multi-color accent system — violet, pink, amber, emerald, cyan, rose — each encoding a semantic role (stat card types, year tabs, file type icons, deterministic tag colors)
- Flat surfaces with purposeful lift on hover — no resting shadows
- Generous rounded corners (14–20px) that feel soft but confident
- Phosphor duotone icons for consistent visual vocabulary
- Thai-language UI entirely — the language is part of the brand

**Anti-References:**
- No CSS gradients as generic decoration — gradient exceptions: brand mark (violet→pink gradient), hero card accent glow, login page background, year tab tint overlays
- No AI-generated heuristics — GSAP entrance animations (fade-up, scale, slide) are used on mount and respect `prefers-reduced-motion`
- No SaaS-cream or blue-enterprise palette
- No side-stripe borders, no glassmorphism, no numbered section markers

## 2. Colors: The Violet Gallery Palette

A cool purple anchor on a warm neutral ground. The palette is restrained — one accent color, two neutral layers — with the purple acting as the sole signal.

### Primary
- **Violet Gallery** (`#7c3aed` / `oklch(0.55 0.22 300)`): The single accent. Used for link hovers, focus rings, file-type icons, filter-chip hover borders, and the accent soft glow behind icons. Rarity is the point.
- **Violet Deep** (`#6d28d9` / `oklch(0.48 0.24 295)`): Accent hover on light backgrounds. Buttons, interactive states.
- **Violet Soft** (`#f5f3ff` / `oklch(0.92 0.04 300)`): Background tint — file icons, subtle callouts, glow rings.

### Neutral
- **Graphite** (`#09090b` / `oklch(0.13 0 0)`): Ink — primary text, button text on light, strong contrast anchor.
- **Greige Paper** (`#fafafa` / `oklch(0.97 0.002 270)`): Body background. Barely tinted cool to balance the purple warmth.
- **White Board** (`#ffffff`): Surface / card / sidebar background (light mode).
- **Silver Stroke** (`#e4e4e7` / `oklch(0.91 0.005 270)`): Borders, dividers.
- **Grey Matter** (`#71717a` / `oklch(0.55 0.01 270)`): Muted body text.
- **Pebble** (`#a1a1aa` / `oklch(0.69 0.01 270)`): Subtle text (placeholders, secondary labels).

### Dark
- **White Smoke** (`#f4f4f5`): Ink on dark.
- **Midnight Felt** (`#0c0c0e`): Body background dark.
- **Slate Board** (`#18181b`): Surface / card dark.
- **Iron Fence** (`#27272a`): Border dark.
- **Violet Sky** (`#a78bfa` / `oklch(0.72 0.18 300)`): Accent on dark.
- **Violet Sky Hover** (`#8b5cf6` / `oklch(0.65 0.20 295)`): Accent hover on dark.

### Named Rules
**The Multi-Color Accent Rule.** Six accent colors (violet, pink, amber, emerald, cyan, rose) encode semantic roles — stat card types, year tabs, file-type icon tints, deterministic tag colors. Each color family carries meaning; no color is purely decorative. Violet remains the primary interactive signal (focus rings, hover borders, button states).

## 3. Typography

**Single font:** Mali, from Google Fonts, a Thai-and-Latin handwritten sans by Cadson Demak. Playful, warm, and naturally comfortable at all sizes. We use it for everything — headings, body, buttons, labels, navigation.

**Data font:** SF Mono / Consolas / Liberation Mono (system monospace), used only for small uppercase labels, tags, filter chips, and data displays where technical precision matters.

**Character:** Mali's 6th-grade-handwriting origin gives the interface a disarming warmth. It reads like a personal note rather than a corporate dashboard. The monospace data font provides a deliberate contrast for metadata.

### Hierarchy
- **Heading** (Weight 600, `clamp(32px, 4.5vw, 64px)`, line-height 0.92, letter-spacing -0.04em): Topbar H2s. Max width 780px. `text-wrap: balance`.
- **Subheading** (Weight 600, `clamp(20px, 2.5vw, 36px)`, line-height 1.15, letter-spacing -0.01em): Hero card H3s, detail page H2s.
- **Card Title** (Weight 600, 15px, line-height 1.3): Certificate card titles, panel headings.
- **Body** (Weight 400, 15–17px, line-height 1.65): Paragraphs, descriptions. Max line length 65–75ch.
- **Label** (Weight 600, 13–14px, letter-spacing 0.01em): Form labels, button text, nav items.
- **Data** (Weight 600, 11–12px, letter-spacing 0.1em, uppercase): Eyebrow labels, tags, filter chips, stat numbers, detail labels. Always in monospace.

### Named Rules
**The One-Family Rule.** Mali carries every role — heading, body, button, label — with no display/body pairing. The only exception is the monospace data tier for small metadata labels.

## 4. Elevation

**Flat by default, lift on hover.** Surfaces at rest have no shadow — only a 1px border defines their edge. Depth is conveyed through tonal layering (surface vs. body background) and border contrast.

On hover, cards and buttons lift with a subtle drop shadow (24–40px blur at 12–24px Y offset) and a 1px Y translation. This is a state response, not a resting property.

### Shadow Vocabulary
- **Hover Lift** (`box-shadow: 0 12px 40px rgba(9, 9, 11, 0.12)`): Card hover, sidebar at rest.
- **Dark Hover Lift** (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3)`): Card hover in dark mode.

### Named Rules
**The Flat-by-Default Rule.** No surface has a shadow at rest. Shadows appear only as a response to hover or active state. The app depth is read through tonal layering and border contrast.

## 5. Components

### Buttons
- **Shape:** Full pill (999px radius).
- **Primary:** Ink (`#09090b`) background, white text. Hover moves to `#27272a` with a 2px shadow and 1px Y lift.
- **Secondary:** White surface, 1px `#e4e4e7` border. Hover pushes border to `#d4d4d8` and background to `#f4f4f5`.
- **States:** Active scale-down to 0.97. Focus-visible gets a 2px violet ring at 2px offset. All transitions are 150ms `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Consistency:** The same button shape everywhere — no mixed radii, no square buttons in one view and pill in another.

### Inputs & Fields
- **Shape:** 12px border radius (inputs), 8px (filter options).
- **Style:** 1px `#e4e4e7` border, white background. Focus shifts the border to violet (`#7c3aed`) with a 2px violet-soft (`#f5f3ff`) glow ring.
- **Padding:** 12px 14px consistently across text inputs, selects, and textareas.

### Cards / Containers
- **Shape:** 16px border radius (standard), 24px (hero cards).
- **Background:** White surface (`#ffffff`) in light, `#18181b` in dark.
- **Border:** 1px solid, using the neutral border token.
- **Padding:** 22px (standard panels), `clamp(24px, 4vw, 44px)` (hero cards).
- **States:** Hover lifts with the shadow vocabulary. No nested cards — each card is a self-contained unit.

### Sidebar
- **Shape:** 20px border radius, full-height sticky column.
- **Background:** Near-black (`#18181b`) regardless of theme — it's the sole constant surface.
- **Text:** White, with nav items at 60% white, active at full white.
- **Navigation:** Flex-column stack with 4px gap between items. Items have 11px 14px padding, 12px border radius. Hover adds a subtle lightening (`rgba(255, 255, 255, 0.07)`).

### Navigation (Sidebar)
- **Font:** Mali Weight 500, 15px.
- **Affordances:** Icon + label. Active state detected via path matching, rendered as a subtle border and background. Icons use Phosphor duotone weight consistently.

### Chips / Tags
- **Shape:** Full pill (999px).
- **Style:** 1px border, white background, monospace 12px text. Hover shifts border to violet. Active (selected) fills with ink.

### Search Bar
- **Style:** 14px radius, white background, 1px border. Focus shifts to violet border with violet-soft glow.
- **Layout:** Icon prefix, flexible input, pill button suffix.

### Skeleton Loaders
- **Shape:** Matches the component being loaded.
- **Animation:** Horizontal shimmer sweep at 1.5s, 800px gradient. Light uses border-to-zinc-200, dark uses border-to-zinc-600.

### Empty States
- **Layout:** Centered grid with icon, message, and primary action button.
- **Tone:** Informational, not apologetic. "ยังไม่มีประกาศนียบัตร" / "ไม่พบประกาศนียบัตร" — direct, no filler.

## 6. Do's and Don'ts

### Do:
- **Do** use the multi-color accent system purposefully — violet for primary interactive signals, pink/amber/emerald/cyan/rose for stats, year tabs, file icons, and tags.
- **Do** use Mali for every text element — headings, body, buttons, labels, navigation. The only exception is monospace data labels (eyebrow text, tags, stats).
- **Do** keep surfaces flat. Cards, panels, and containers have no shadow at rest.
- **Do** use Phosphor duotone icons throughout. Never mix icon families.
- **Do** write all UI text in Thai. The language is part of the brand identity.
- **Do** respect `prefers-reduced-motion` — GSAP entrance animations use `gsap.matchMedia()` to disable on reduced motion.
- **Do** use GSAP entrance animations (fade-up, scale, slide) for page-entry choreography via `useEntranceAnimation` hook.
- **Do** keep form controls consistent: same radius, padding, border, focus treatment everywhere.

### Don't:
- **Don't** use CSS gradients as generic decoration — allowed exceptions: brand mark, hero card glow, login page background, year tab tint overlays.
- **Don't** use blue as an accent. The palette is violet-purple.
- **Don't** use CSS keyframe animations for entrance sequences — use GSAP instead.
- **Don't** use AI-sounding copy — no "unlock your potential", "elevate", "supercharge". Direct Thai copy only.
- **Don't** use side-stripe borders (border-left >1px as decoration).
- **Don't** use glassmorphism, numbered section markers (01/02/03), or card-grid-with-icon-heading-body patterns.
- **Don't** mix radii — 999px for buttons, 16px for cards, 12px for inputs, 8px for filters. No 32px+ cards.
- **Don't** place shadows on the same element that has a 1px border decoration. Pick one.
