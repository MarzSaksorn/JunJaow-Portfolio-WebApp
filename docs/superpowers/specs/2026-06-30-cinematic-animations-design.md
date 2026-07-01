# Cinematic Animation System — Design Spec

> 2026-06-30 | Vibe: Cinematic & Premium | GSAP v3.15

## Overview

A comprehensive, declarative animation system for all 14+ pages and shared components. Uses GSAP with ScrollTrigger and CustomEase for premium staggered reveals, scroll-triggered animations, page transitions, and micro-interactions.

## Architecture

```
lib/animations.ts               ← Easings, presets, helper factories
hooks/use-page-entrance.ts       ← Scans data-animate attrs → GSAP timeline on mount
hooks/use-scroll-reveal.ts       ← ScrollTrigger-based section reveals
hooks/use-micro-interactions.ts  ← Hover/click effects for interactive elements
components/fade-in.tsx           ← <FadeIn> declarative wrapper
components/transition-layout.tsx ← Page transition wrapper for dashboard
```

## Animation Palette

| Preset | Transform | Opacity | Duration | Stagger |
|--------|-----------|---------|----------|---------|
| `fade-up` | y: 40→0 | 0→1 | 600ms | — |
| `fade-in` | — | 0→1 | 500ms | — |
| `scale-in` | scale: 0.95→1 | 0→1 | 500ms | — |
| `stagger-up` | y: 30→0 | 0→1 | 600ms | 80ms |
| `slide-left` | x: 40→0 | 0→1 | 500ms | — |
| `slide-right` | x: -40→0 | 0→1 | 500ms | — |

**Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` via GSAP CustomEase — Apple-style "super ease"

## Pages & Animation Maps

| Page | Primary | Scroll | Notes |
|------|---------|--------|-------|
| Dashboard | stagger-up (stats → year chips → recent → activity) | stat cards, feed | Hero greeting fades first |
| Certificates | stagger-up (filter → tiles) | — | Row-staggered grid |
| Certificate detail | fade-up (image → info → tags) | — | Progressive reveal |
| Certificate new/edit | fade-up (form sections) | — | Focus transitions |
| Certificate bulk | fade-up (drop zone → files) | — | File cards stagger |
| Years | stagger-up (year cards) | — | — |
| Timeline | fade-up (items) | year sections | Vertical line stagger |
| Profile | fade-up (sections) | — | — |
| Portfolio generator | fade-up (panels) | — | Template previews stagger |
| Settings | fade-up (panels) | — | Theme toggle morph |
| Login | fade-up (form card) | — | Inputs sequence |
| Public portfolio | stagger-up (hero → certs) | section reveals | Hero parallax |
| Verify | fade-up (cert card) | — | — |
| Admin | stagger-up (rows) | — | — |
| 404 | scale-in (illustration) | — | Bouncy |

## Micro-interactions

| Element | Hover | Click |
|---------|-------|-------|
| Buttons | scale(1.03) + shadow deepen, 200ms | scale(0.96) snap, 100ms |
| Cards/tiles | translateY(-4px) + shadow intensify | — |
| Sidebar links | active indicator slide + icon bounce | — |
| Form inputs | focus glow border animation | — |
| Theme toggle | smooth rotation/icon morph | — |

## Page Transitions

- Outgoing page: opacity 1→0, scale(0.98), 300ms
- Incoming page: fade-up, 500ms
- Wrapped in `<TransitionLayout>` in dashboard layout
- Respects `prefers-reduced-motion`

## Reduced Motion

All animations check `prefers-reduced-motion`. If enabled, skip all GSAP animations and render at final state. The existing CSS `@media (prefers-reduced-motion: reduce)` block in styles.css will also override durations to 0.01ms.

## Implementation Order

1. `lib/animations.ts` — easings, presets, helpers
2. `hooks/use-page-entrance.ts` — entry reveals
3. `hooks/use-scroll-reveal.ts` — scroll animations
4. `hooks/use-micro-interactions.ts` — hover/click effects
5. `components/fade-in.tsx` — declarative wrapper
6. `components/transition-layout.tsx` — page transitions
7. Wire into all pages and components
8. Test build + reduced motion
