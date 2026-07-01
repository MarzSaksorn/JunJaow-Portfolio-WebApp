---
name: Bug & Improvement Todo
description: Active bugs and improvements tracked from the June 2026 audit
metadata:
  priority:
    - p0: security
    - p1: css bugs
    - p2: ux & cognitive load
    - p3: code quality & consistency
---

# Bug & Improvement Todo

> Generated 2026-06-29 from DESIGN.md alignment audit.
> Mark items with `[x]` when done.

## 🔴 P0 — Security

- [x] **Hardcoded demo credentials** — `app/login/page.tsx:108`
  `setEmail("jj@gmail.com"); setPassword("aaaaaa")` guarded behind `process.env.NODE_ENV !== "production"`. Fixed 2026-06-30.

## 🟠 P1 — CSS Bugs (undefined variables)

- [x] **`var(--crease-warm)` undefined** — `app/styles.css:3337`
  `.bulk-card-header { background: var(--crease-warm); }` — added `--crease-warm` to all 8 color scheme blocks. Fixed 2026-06-30.

- [x] **`var(--tab-red)` undefined** — `app/styles.css:2609`
  `.pw-saved-del:hover { color: var(--tab-red); }` — replaced with `var(--destructive)`. Fixed 2026-06-30.

- [x] **`border-radius: 10px` orphan value** — `app/styles.css:3326`
  `.bulk-card` uses 10px but the design system scale is 8/12/16/20. Changed to `var(--radius-sm)`. Fixed 2026-06-30.

- [x] **Login success renders in red** — `app/login/page.tsx:31`
  `setError("สมัครสมาชิกสำเร็จ")` uses `className="login-error"`. Added `success` state + `.login-success` green class. Fixed 2026-06-30.

## 🟡 P2 — UX & Cognitive Load

- [x] **Portfolio generator: 5 simultaneous decisions** — `app/(dashboard)/portfolio/portfolio-generator.tsx`
  Template picker + section toggles collapsed behind expandable "ตั้งค่าเพิ่มเติม" panel. Fixed 2026-06-30.

- [x] **No drag-reorder on mobile** — `app/(dashboard)/portfolio/portfolio-generator.tsx`
  Added CaretUp/CaretDown buttons on each selected cert for touch reorder. Fixed 2026-06-30.

- [x] **No pagination in certificates list** — `app/(dashboard)/certificates/certificate-list.tsx`
  Added 24-item `.range()` pagination + "โหลดเพิ่ม" button + exact count tracking. Fixed 2026-06-30.

## 🟢 P3 — Code Quality & Consistency (all fixed ✓)

- [x] **Extract inline styles into CSS classes** — Fixed 2026-06-30
  Added `.ink-muted`, `.fz-13`, `.py-8`, `.py-4`, `.mt-8`, `.mt-10`, `.mt-12`, `.mb-8`, `.p-24-16` utility classes.
  Replaced all repeated inline-style combos in portfolio-generator, dashboard-client, certificate-detail.

- [x] **Unify 3 hand-rolled modals into reusable component** — Fixed 2026-06-30
  Upgraded `ConfirmDialog` with `children`, `confirmIcon`, `confirmDisabled` props.
  Replaced delete/year/tags batch modals in certificate-list with `<ConfirmDialog>`.

- [x] **`nav-dir` sessionStorage pattern is fragile** — Fixed 2026-06-30
  Both uses in `dashboard-client.tsx` now consume-and-clear (`removeItem` after read),
  preventing stale direction on direct navigation / refresh.

- [x] **`--radius-sm` on brand mark looks inconsistent** — Fixed 2026-06-30
  `.binder-link`, `.binder-collapse` changed to `--radius-md` (12px);
  `.binder-mark` keeps `--radius-sm` (8px). Intentional hierarchy.

## ✅ Animations — Cinematic System (2026-06-30)

- [x] **`lib/animations.ts`** — GSAP core file with CustomEase (`easePremium`), presets (`fade-up`, `fade-in`, `scale-in`, `slide-left`, `slide-right`), `isReducedMotion()`, `createPageEntranceTimeline()`, `createStaggerEntrance()`
- [x] **`hooks/use-page-entrance.ts`** — Scans `data-animate` (ordered) and `data-animate-stagger` (sequential delay) attrs on mount, builds GSAP timeline, respects reduced motion
- [x] **`hooks/use-scroll-reveal.ts`** — ScrollTrigger-based section reveals via `data-scroll` and `data-scroll-stagger`, each section gets its own timeline
- [x] **`hooks/use-micro-interactions.ts`** — Hover/click effects on buttons (scale), cards (lift + shadow), sidebar links (icon bounce), standalone icons (rotation)
- [x] **`app/components/fade-in.tsx`** — Declarative `<FadeIn>` wrapper for server components or spot-use
- [x] **Dashboard** — 4 ordered sections (header, stats, years, main) + staggered stat cards, cert cards, feed items + scroll-reveal on sidebar flap
- [x] **Certificates list** — Slide-right on sidebar, slide-left on toolbar, staggered tile grid
- [x] **Certificates detail** — Sequential reveal of header, content body
- [x] **Years** — Fade-up header + staggered year cards
- [x] **Timeline** — Fade-up header + scroll-reveal on each month section + staggered entries
- [x] **Profile** — Fade-up header/form + staggered form fields
- [x] **Settings** — Fade-up header/form + staggered theme cards + backup section
- [x] **Portfolio generator** — Fade-up main panel + sidebar
- [x] **Login** — Scale-in card + sequential fade-up inputs
- [x] **Public portfolio** — Fade-up header/hero + scroll-reveal footer
- [x] **Verify** — Scale-in card + sequential fade-up sections
- [x] **Admin dashboard** — Fade-up header + staggered metric cards + recent users
- [x] **Admin users** — Fade-up header/body + staggered table rows
- [x] **404** — Scale-in via `<FadeIn>` (server component compatible)
- [x] **Dashboard layout** — `useMicroInteractions` for global button/card/icon hover effects
- [x] **Reduced motion** — `isReducedMotion()` check in every hook/component + CSS `@media (prefers-reduced-motion: reduce)` fallback
- [x] **Spec written** — `docs/superpowers/specs/2026-06-30-cinematic-animations-design.md`
- [x] **Build passes** — No TypeScript or compilation errors

## ✅ Fixed in 2026-06-29 session

- [x] **`var(--mint)` → `var(--tab-mint)`** — `app/styles.css:3330`
  `.bulk-card.done` referenced non-existent `--mint` variable. Fixed.
- [x] **DESIGN.md rewrite** — radius scale, tactile naming, shadow/easing/duration tokens, tab colors, gradient exceptions, accent strip rule, button radii
- [x] **PRODUCT.md update** — added portfolio hero gradient + verify accent bar to exceptions list; refined side-stripe rule
- [x] **Create image compression utility** — `lib/image-compression.ts` with Canvas-based resize, JPEG re-encode at 0.82 quality, auto-skips non-images/GIFs/SVGs
- [x] **Integrate compression into single upload** — `certificates/new/page.tsx` compresses image on file select, shows savings label, uploads compressed version
- [x] **Integrate compression into bulk upload** — `certificates/bulk/page.tsx` compresses each image in background after adding files, shows per-file savings, uploads compressed
- [x] **Fix `var(--mint)` inline color** — `certificates/bulk/page.tsx:214` CheckCircle icon used undefined `var(--mint)` → `var(--tab-mint)`
- [x] **Create drag-drop utility** — `lib/drag-drop.ts` with `getFilesFromDrop()` for recursive folder walking via `webkitGetAsEntry()`, `createDropHandlers()` for counter-based drag events
- [x] **Enable drag-and-drop from explorer** — `certificates/new/page.tsx` and `certificates/bulk/page.tsx` now support drag-from-explorer and folder drops with visual drag-over feedback
- [x] **Full-page drag overlay** — `app/components/drop-overlay.tsx` listens for file drags on the document, shows a translucent overlay with "วางไฟล์ที่นี่" cue anywhere on the page, wired into both single and bulk upload pages
