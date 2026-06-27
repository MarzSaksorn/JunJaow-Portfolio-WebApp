# Product

## Register

product

## Users

A single Thai-speaking user ("Jj") managing their own academic certificates and portfolio privately. One person, one dashboard — no multi-user, no sharing. The user is in a task-focused mindset: upload a certificate, search by year, edit profile, generate a portfolio page. Efficiency matters more than flourish.

## Product Purpose

A private portfolio manager that stores certificates (images/docs) tagged by Thai academic year (2569–2572), maintains a personal profile, and generates portfolio pages from the data. Everything is behind login. The output is a browsable, printable portfolio.

## Brand Personality

Bold, creative, playful. The interface should have character — purple/pink personality, sharp typography, confident spacing — but disappear when the user is in a task. It's a personal dashboard for someone who wants their tools to feel distinctive, not generic.

## Anti-references

- No CSS gradients as generic decoration — specific gradient exceptions: brand mark (violet→pink), hero card accent glow, login page background, year tab tint overlays
- No AI-generated heuristics or generic motion — GSAP entrance animations are used for page-entry choreography (fade-up, scale, slide) and respect `prefers-reduced-motion` via `gsap.matchMedia()`
- No AI-sounding words or clichés — no "unlock your potential", "supercharge", "elevate your journey". Copy is direct and specific, in Thai.
- No SaaS-cream palette, no side-stripe borders, no glassmorphism as default, no numbered section markers (01/02/03 scaffolding).

## Design Principles

1. **Tool first, personality second.** The UI gets out of the user's way for tasks (upload, search, filter) and shows personality in the shell (sidebar, header, cards). Never at the expense of clarity.
2. **Contrast is not negotiable.** Body text always ≥4.5:1 against its background. No muted gray that reads like a suggestion.
3. **One family, well tuned.** Product UIs don't need a display/body pairing. A single strong sans with multiple weights carries headings, buttons, labels, body, and data consistently.
4. **Consistent vocabulary.** Every button, form control, icon style, and interaction has one canonical shape. No surprises between screens.
5. **Motion serves state and entry.** Transitions are 150–250ms for feedback (hover, focus, loading). GSAP entrance animations (fade-up, scale, slide) choreograph page entry on mount, respecting `prefers-reduced-motion` via `gsap.matchMedia()`.

## Accessibility & Inclusion

- WCAG AA minimum (contrast ≥4.5:1 body, ≥3:1 large text)
- Full `prefers-reduced-motion` support — every animation has a zero-duration fallback
- Focus-visible outlines on all interactive elements
- Thai language throughout the UI
