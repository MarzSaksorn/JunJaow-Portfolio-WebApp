---
name: Jj Portfolio Manager
description: Private certificate and portfolio dashboard
colors:
  # Tactile naming system (matches CSS variables)
  ink: '#2d1b4e'
  ink-muted: '#7b6f9a'
  ink-faint: '#a99ec2'
  page: '#f5f0fa'
  parchment: '#fcfaff'
  paper: '#fefcfd'
  crease: '#e4daf2'
  crease-light: '#eee6f8'
  binder: '#2d1b4e'
  binder-ink: '#ede4f5'
  binder-stripe: 'rgba(237, 228, 245, 0.1)'
  binder-hover: 'rgba(237, 228, 245, 0.07)'
  clip: '#f87195'
  clip-glow: '#f990aa'
  clip-warm: 'rgba(248, 113, 149, 0.08)'
  focus: '#f87195'
  destructive: '#d67a8a'
  accent: '#7c3aed'
  accent-hover: '#6d28d9'
  accent-soft: '#f5f3ff'
  accent-focus: '#a78bfa'
  # 6 semantic tab colors
  tab-pink: '#d67a9e'
  tab-mint: '#7ec8a3'
  tab-lavender: '#b589d6'
  tab-honey: '#d4b87a'
  tab-coral: '#d49a7a'
  # Dark mode
  ink-dark: '#ede4f5'
  ink-muted-dark: '#a090c0'
  ink-faint-dark: '#7a6b9a'
  page-dark: '#1a1428'
  parchment-dark: 'rgba(45, 27, 78, 0.82)'
  paper-dark: '#2d1d4e'
  crease-dark: '#3d2d58'
  crease-light-dark: '#2a1d3a'
  binder-dark: '#0f0a1a'
  binder-stripe-dark: 'rgba(237, 228, 245, 0.08)'
  binder-hover-dark: 'rgba(237, 228, 245, 0.06)'
  clip-dark: '#f990aa'
  clip-glow-dark: '#fab3c4'
  clip-warm-dark: 'rgba(248, 113, 149, 0.12)'
  focus-dark: '#c4b5fd'
  accent-dark: '#a78bfa'
  accent-hover-dark: '#8b5cf6'
  accent-soft-dark: 'rgba(124, 58, 237, 0.12)'
  accent-focus-dark: '#c4b5fd'
typography:
  display:
    fontFamily: Mali, ui-sans-serif, system-ui, sans-serif
    fontSize: clamp(32px, 4.5vw, 64px)
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: -0.04em
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
  subheading:
    fontFamily: Mali, ui-sans-serif, system-ui, sans-serif
    fontSize: clamp(20px, 2.5vw, 36px)
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.01em
  card-title:
    fontFamily: Mali, ui-sans-serif, system-ui, sans-serif
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.3
  data:
    fontFamily: SFMono-Regular, Consolas, Liberation Mono, monospace
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.1em
    textTransform: uppercase
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  pill: 999px
spacing:
  page: clamp(12px, 2.4vw, 32px)
  gap-sm: 8px
  gap-md: 16px
  gap-lg: 24px
shadows:
  sm: '0 2px 8px rgba(45, 27, 78, 0.06)'
  md: '0 6px 20px rgba(45, 27, 78, 0.08)'
  lg: '0 12px 40px rgba(45, 27, 78, 0.1)'
  xl: '0 24px 60px rgba(45, 27, 78, 0.12)'
  sm-dark: '0 2px 8px rgba(0, 0, 0, 0.3)'
  md-dark: '0 6px 20px rgba(0, 0, 0, 0.35)'
  lg-dark: '0 12px 40px rgba(0, 0, 0, 0.4)'
motion:
  ease-out: 'cubic-bezier(0.22, 1, 0.36, 1)'
  ease-in: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)'
  duration-fast: 150ms
  duration-base: 200ms
  duration-slow: 300ms
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    rounded: '{rounded.md}'
    padding: 0 16px
    height: 38px
  button-primary-hover:
    backgroundColor: '{colors.ink}'  # uses primary-hover token
    boxShadow: '{shadows.md}'
  button-primary-active:
    transform: scale(0.97)
  button-secondary:
    backgroundColor: transparent
    textColor: '{colors.ink}'
    rounded: '{rounded.md}'
    padding: 0 16px
    height: 38px
    border: '1px solid {colors.crease}'
  button-pill:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    rounded: '{rounded.pill}'
    padding: 11px 18px
  card:
    backgroundColor: '{colors.paper}'
    rounded: '{rounded.lg}'
    padding: 22px
    borderColor: '{colors.crease}'
  card-dark:
    backgroundColor: '{colors.paper-dark}'
    borderColor: '{colors.crease-dark}'
  input:
    backgroundColor: '{colors.paper}'
    rounded: '{rounded.md}'
    padding: 12px 14px
    borderColor: '{colors.crease}'
  sidebar:
    backgroundColor: '{colors.binder}'
    textColor: '{colors.binder-ink}'
    rounded: '{rounded.xl}'
    padding: 24px 20px
  filter-option:
    rounded: '{rounded.sm}'
    padding: 8px 12px
  tag-chip:
    rounded: '{rounded.pill}'
    padding: 2px 10px
---

# Design System: Jj Portfolio Manager

A purple-accented velvet-notebook feel for a private portfolio dashboard. Single-user, Thai-language, expressive yet precise.

## 1. Overview

**Creative North Star: "The Velvet Notebook"**

A polished personal journal for achievements — tactile, warm, proudly individual. The interface combines the focused utility of a productivity tool with the personality of a curated notebook.

**Key Characteristics:**
- Single sans-serif family (Mali) throughout — warm and playful, with handwritten character
- Multi-color accent system — clip (pink), pink, mint, lavender, honey, coral — each encoding a semantic role (stat card types, year tabs, file type icons, deterministic tag colors)
- Flat surfaces with purposeful lift on hover — no resting shadows
- Rounded corners at 8–20px radii with full-pill (999px) reserved for tags, chips, and login/auth buttons
- Phosphor duotone icons for consistent visual vocabulary
- Thai-language UI entirely — the language is part of the brand
- 4 color presets (lavender default, warm, mint, slate) with dark mode for each — 8 complete color schemes

**Anti-References:**
- No CSS gradients as generic decoration — gradient exceptions: brand mark (violet→pink gradient), hero card accent glow, login page background, year tab tint overlays, portfolio hero name text, verify page accent bar
- No AI-generated heuristics — GSAP entrance animations (fade-up, scale, slide) are used on mount and respect `prefers-reduced-motion`
- No SaaS-cream or blue-enterprise palette
- No glassmorphism, no numbered section markers

## 2. Colors: The Tactile Vocabulary

The design system uses a tactile naming metaphor for its CSS custom properties, evoking a physical notebook or portfolio case:

| Token | Role | Light Mode | Dark Mode |
|-------|------|-----------|-----------|
| `--ink` | Primary text, strong contrast | `#2d1b4e` | `#ede4f5` |
| `--ink-muted` | Secondary body text | `#7b6f9a` | `#a090c0` |
| `--ink-faint` | Placeholders, subtle labels | `#a99ec2` | `#7a6b9a` |
| `--page` | Body background | `#f5f0fa` | `#1a1428` |
| `--parchment` | Hover surface, soft tint | `#fcfaff` | `rgba(45,27,78,0.82)` |
| `--paper` | Cards, panels, surfaces | `#fefcfd` | `#2d1d4e` |
| `--crease` | Borders, dividers | `#e4daf2` | `#3d2d58` |
| `--crease-light` | Subtle separators | `#eee6f8` | `#2a1d3a` |
| `--binder` | Sidebar background | `#2d1b4e` | `#0f0a1a` |
| `--binder-ink` | Sidebar text | `#ede4f5` | — |
| `--clip` | Primary accent (pink), interactive signals | `#f87195` | `#f990aa` |
| `--clip-glow` | Accent glow / hover | `#f990aa` | `#fab3c4` |
| `--clip-warm` | Accent soft tint glow | `rgba(248,113,149,0.08)` | `rgba(248,113,149,0.12)` |
| `--focus` | Focus ring color | `var(--clip)` | `#c4b5fd` |

### Semantic Tab Colors (6-color accent palette)

These encode semantic roles — stat card categories, year tabs, file-type icon tints, deterministic tag colors:

| Role | Token | Light Value | Used For |
|------|-------|-------------|----------|
| Clip (pink) | `--clip` | `#f87195` | Primary accent, stats, default year |
| Pink | `--tab-pink` | `#d67a9e` | Year 2570, file type icons |
| Mint | `--tab-mint` | `#7ec8a3` | Year 2571, success, document type icons |
| Lavender | `--tab-lavender` | `#b589d6` | Year 2572, profile stats |
| Honey | `--tab-honey` | `#d4b87a` | Slide/archive type icons |
| Coral | `--tab-coral` | `#d49a7a` | Image/image type icons |

### Color Presets

Four color presets switch via the `data-color-preset` attribute on `<html>`:

1. **Lavender** (default) — violet-black ink on lavender-tinted page, pink clip accent
2. **Warm** — warm brown ink on cream page, amber clip accent
3. **Mint** — deep teal ink on mint-tinted page, emerald clip accent
4. **Slate** — navy ink on cool grey page, blue clip accent

Each preset redefines `--ink`, `--page`, `--parchment`, `--paper`, `--crease`, `--binder`, `--clip`, shadow colors, and tab colors — while keeping the same component structure. Dark mode variants exist for all 4 presets via `[data-theme="dark"]`.

### Named Rules

**The Multi-Color Accent Rule.** Six accent colors (clip/pink, tab-pink, tab-mint, tab-lavender, tab-honey, tab-coral) encode semantic roles — stat card types, year tabs, file-type icon tints, deterministic tag colors. Each color family carries meaning; no color is purely decorative. `--clip` (pink) remains the primary interactive signal (focus rings, hover borders, button states).

**The Binder Rule.** The sidebar (`--binder`) is always a saturated dark version of the preset's ink color — it anchors the layout as a constant physical object regardless of light/dark mode. The sidebar never inverts with the theme.

## 3. Typography

**Single font:** Mali, from Google Fonts, a Thai-and-Latin handwritten sans by Cadson Demak. Playful, warm, and naturally comfortable at all sizes. We use it for everything — headings, body, buttons, labels, navigation.

**Data font:** SF Mono / Consolas / Liberation Mono (system monospace), used only for small uppercase labels, tags, filter chips, and data displays where technical precision matters.

**Character:** Mali's 6th-grade-handwriting origin gives the interface a disarming warmth. It reads like a personal note rather than a corporate dashboard. The monospace data font provides a deliberate contrast for metadata.

### CSS Token Mapping
- `--font-display` → `"Mali", ui-sans-serif, system-ui, sans-serif` — used for display headings, hero text
- `--font-body` → `"Mali", ui-sans-serif, system-ui, sans-serif` — used for everything else
- `--font-mono` → `"SFMono-Regular", Consolas, "Liberation Mono", monospace` — used for data labels, stats, tags, filter chips

### Hierarchy
- **Display** (Weight 600, `clamp(32px, 4.5vw, 64px)`, line-height 0.92, letter-spacing -0.04em): Topbar H2s. Max width 780px. `text-wrap: balance`.
- **Subheading** (Weight 600, `clamp(20px, 2.5vw, 36px)`, line-height 1.15, letter-spacing -0.01em): Hero card H3s, detail page H2s.
- **Card Title** (Weight 600, 15px, line-height 1.3): Certificate card titles, panel headings.
- **Body** (Weight 400, 15–17px, line-height 1.65): Paragraphs, descriptions. Max line length 65–75ch.
- **Label** (Weight 600, 13–14px, letter-spacing 0.01em): Form labels, button text, nav items.
- **Data** (Weight 600, 11–12px, letter-spacing 0.1em, uppercase): Eyebrow labels, tags, filter chips, stat numbers, detail labels. Always in monospace.

### Named Rules
**The One-Family Rule.** Mali carries every role — heading, body, button, label — with no display/body pairing. The only exception is the monospace data tier for small metadata labels. The `--font-display` token also uses Mali; the name refers to its intended usage context (large display headings), not a different font.

## 4. Elevation

**Flat by default, lift on hover.** Surfaces at rest have no shadow — only a 1px border defines their edge. Depth is conveyed through tonal layering (surface vs. body background) and border contrast.

On hover, cards and buttons lift with a shadow token and a 1px Y translation or scale(0.97) active state. This is a state response, not a resting property.

### Shadow Vocabulary

Four shadow levels map to elevation contexts:

| Token | Light Value | Dark Value | Usage |
|-------|------------|-----------|-------|
| `--shadow-sm` | `0 2px 8px rgba(45,27,78,0.06)` | `0 2px 8px rgba(0,0,0,0.3)` | Card resting, button resting |
| `--shadow-md` | `0 6px 20px rgba(45,27,78,0.08)` | `0 6px 20px rgba(0,0,0,0.35)` | Card hover, button hover |
| `--shadow-lg` | `0 12px 40px rgba(45,27,78,0.1)` | `0 12px 40px rgba(0,0,0,0.4)` | Dropdown, elevated panel |
| `--shadow-xl` | `0 24px 60px rgba(45,27,78,0.12)` | — | Modal, overlay |

Shadows are tinted to the ink color — not pure black/white — so they feel part of the material. Dark mode shadows are neutral black with higher opacity.

### Named Rules
**The Flat-by-Default Rule.** No surface has a shadow at rest. Shadows appear only as a response to hover or active state. The app depth is read through tonal layering and border contrast.

## 5. Motion

### Easing
- `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` — default for all enter/hover transitions. Fast start, slow finish.
- `--ease-in: cubic-bezier(0.55, 0.06, 0.68, 0.19)` — used for exit transitions.

### Durations
| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Hover/focus, immediate feedback |
| `--duration-base` | 200ms | Most transitions |
| `--duration-slow` | 300ms | Panel reveals, complex changes |

### GSAP Entrance Animations
Page entry choreography uses `useEntranceAnimation` hook with GSAP:
- Entrance variants: hero, panel, scale, left, filter, detail, preview, form, sidebar
- Stagger delay between items: 50–80ms
- All animations respect `prefers-reduced-motion` via `gsap.matchMedia()`

## 6. Components

### Buttons
- **Standard (`.btn`, `.btn-primary`, `.btn-secondary`):** 12px border radius (`--radius-md`), 38px height, 0 16px padding. Ink background with white text (primary) or transparent with 1px crease border (secondary).
- **Pill buttons:** Used for login submit, auth actions — 999px radius (`--radius-pill`), 11px 18px padding.
- **Button sizes:** `.btn-sm` (32px, 12px font), `.btn-lg` (44px, 14px font).
- **States:** Hover elevates with shadow-md. Active scale-down to 0.97. Focus-visible gets a 2px clip/pink ring at 2px offset. All transitions are 150ms `--ease-out`.
- **Consistency:** Standard buttons use 12px radius. Pill shape (999px) is used only for specific contexts: login submission, auth actions, tag chips, filter pills. This is intentional — not a mixed-radii failure.

### Inputs & Fields
- **Shape:** 12px border radius (`--radius-md`).
- **Style:** 1px `--crease` border, white background. Focus shifts the border to `--focus` (clip/pink color) with a 2px `--clip-warm` glow ring.
- **Padding:** 12px 14px consistently across text inputs, selects, and textareas.
- **Filter options:** 8px border radius (`--radius-sm`), compact 8px 12px padding.

### Cards / Containers
- **Shape:** 16px border radius (`--radius-lg` — standard), 20px (`--radius-xl` — hero / elevated).
- **Background:** `--paper` in light, `--paper-dark` in dark.
- **Border:** 1px solid, using `--crease`.
- **Padding:** 22px (standard panels), `clamp(24px, 4vw, 44px)` (hero cards).
- **States:** Hover lifts with shadow-md. No nested cards — each card is a self-contained unit.

### Sidebar (The Binder)
- **Shape:** 20px border radius (`--radius-xl`), full-height sticky column.
- **Background:** `--binder` — always a saturated dark of the preset's ink, regardless of theme. An anchor constant.
- **Text:** `--binder-ink`, with nav items at 60% white, active at full white.
- **Navigation:** Flex-column stack with 4px gap between items. Items have 11px 14px padding, 12px border radius (`--radius-md`). Hover adds `--binder-hover` lightening. Icons use Phosphor duotone weight consistently.
- **Font:** Mali Weight 500, 15px.

### Accent Strip Pattern
An intentional side accent used in two contexts:
- **Dashboard flap profile** (`.ds-flap-accent`): 4px wide vertical strip, positioned absolutely at the left edge, `--clip` colored, with 2px right radius.
- **Portfolio generator meter** (`.pw-meter-accent`): Same 4px strip pattern.

This is not the banned "side-stripe border" pattern — it is a positioned accent element, not a `border-left` on a content container. (The actual banned pattern — 1px `border-left` on table-like rows — exists only in `.detail-meta-value` and `.verify-meta-value` which use it as grid dividers, not decorative accent.)

### Chips / Tags
- **Shape:** Full pill (999px).
- **Style:** 1px border, transparent background, monospace 12px text. Hover shifts border to `--clip`. Active (selected) fills with ink.
- **Dot Tags:** Small colored-label pills at 11px, deterministic color based on tag string hash.

### Gradient Text (Portfolio Hero)
Portfolio public display pages use gradient text for the owner's name:
- `.modern-name` and `.portfolio-cinematic-title`: `linear-gradient(135deg, var(--ink), var(--clip))` with `background-clip: text` and `-webkit-text-fill-color: transparent`.
- This is a deliberate decorative exception — the gradient emphasizes the portfolio as a personal showcase, distinct from the task-oriented dashboard.

### Gradient Accent Bar (Verify Page)
`.verify-accent-bar`: A 4px horizontal bar with `linear-gradient(90deg, var(--tab-mint), var(--clip))`. This is a decorative gradient — an intentional exception for the verification page, which is a public-facing branded document.

### Search Bar
- **Style:** 12px radius (`--radius-md`), white/paper background, 1px crease border. Focus shifts to `--clip` border with `--clip-warm` glow.
- **Layout:** Icon prefix, flexible input, pill button suffix.

### Skeleton Loaders
- **Shape:** Matches the component being loaded.
- **Animation:** Horizontal shimmer sweep at 1.5s across the component width. Light uses border-to-crease, dark uses border-to-crease-dark.
- **Color reference:** Light mode uses skeleton background from `--crease-light`, dark from `--crease-dark`.

### Empty States
- **Layout:** Centered grid with icon (Phosphor duotone), message, and primary action button.
- **Three variants:** No data at all ("ยังไม่มีประกาศนียบัตร" with upload CTA), filtered with no results ("ไม่พบประกาศนียบัตร" with clear filter CTA), search with no matches.
- **Tone:** Informational, not apologetic.

## 7. Do's and Don'ts

### Do:
- **Do** use the multi-color accent system purposefully — clip/pink for primary interactive signals, tab-pink/mint/lavender/honey/coral for stats, year tabs, file icons, and tags.
- **Do** use Mali for every text element — headings, body, buttons, labels, navigation. The only exception is monospace data labels (eyebrow text, tags, stats).
- **Do** keep surfaces flat. Cards, panels, and containers have no shadow at rest.
- **Do** use Phosphor duotone icons throughout. Never mix icon families.
- **Do** write all UI text in Thai. The language is part of the brand identity.
- **Do** respect `prefers-reduced-motion` — GSAP entrance animations use `gsap.matchMedia()` to disable on reduced motion.
- **Do** use GSAP entrance animations (fade-up, scale, slide) for page-entry choreography via `useEntranceAnimation` hook.
- **Do** keep form controls consistent: same radius, padding, border, focus treatment everywhere.
- **Do** use the tactile token naming (`--ink`, `--page`, `--crease`, `--binder`, `--clip`) for all color references.

### Don't:
- **Don't** use CSS gradients as generic decoration — allowed exceptions: brand mark (violet→pink gradient), hero card accent glow, login page background, year tab tint overlays, portfolio hero name gradient text, verify page accent bar gradient.
- **Don't** use blue as an accent. The palette is violet-purple with pink clip accent. The "slate" preset uses blue as the clip color (`#3b82f6`), which is the allowed exception for that preset.
- **Don't** use CSS keyframe animations for entrance sequences — use GSAP instead.
- **Don't** use AI-sounding copy — no "unlock your potential", "elevate", "supercharge". Direct Thai copy only.
- **Don't** use decorative `border-left > 1px` as content decoration. The accent strip pattern (4px positioned `<div>`) is allowed for the dashboard flap and portfolio meter — but do not apply `border-left` as a decorative accent on cards or containers.
- **Don't** use glassmorphism, numbered section markers (01/02/03), or card-grid-with-icon-heading-body patterns.
- **Don't** mix radii arbitrarily — standard buttons use 12px, cards use 16px, inputs use 12px, filter options use 8px, tags/chips use 999px. Each component type has one canonical radius.
- **Don't** place shadows on the same element that has a 1px border decoration. Pick one.
- **Don't** use `var(--mint)` — the correct variable name is `var(--tab-mint)`. All semantic tab colors use the `--tab-*` prefix.
