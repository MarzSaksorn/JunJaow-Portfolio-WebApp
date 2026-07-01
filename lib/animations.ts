import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

export const easePremium = CustomEase.create(
  "easePremium",
  "0.16, 1, 0.3, 1",
);

export const easeOut = CustomEase.create("easeOut", "0.22, 1, 0.36, 1");

export const durations = {
  fast: 0.2,
  base: 0.35,
  slow: 0.5,
  reveal: 0.6,
  pageEnter: 0.5,
  pageExit: 0.3,
} as const;

export const staggerDelay = 0.08;

export interface EntrancePreset {
  fromVars: gsap.TweenVars;
  toVars: gsap.TweenVars;
}

export const presets: Record<string, EntrancePreset> = {
  "fade-up": {
    fromVars: { opacity: 0, y: 40, ease: easePremium },
    toVars: { opacity: 1, y: 0, ease: easePremium },
  },
  "fade-in": {
    fromVars: { opacity: 0, ease: easePremium },
    toVars: { opacity: 1, ease: easePremium },
  },
  "scale-in": {
    fromVars: { opacity: 0, scale: 0.95, ease: easePremium },
    toVars: { opacity: 1, scale: 1, ease: easePremium },
  },
  "slide-left": {
    fromVars: { opacity: 0, x: 40, ease: easePremium },
    toVars: { opacity: 1, x: 0, ease: easePremium },
  },
  "slide-right": {
    fromVars: { opacity: 0, x: -40, ease: easePremium },
    toVars: { opacity: 1, x: 0, ease: easePremium },
  },
};

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function animateEntrance(
  element: Element,
  presetName: string,
  delay: number = 0,
): gsap.core.Tween | null {
  const preset = presets[presetName] || presets["fade-up"];
  if (isReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0, scale: 1, x: 0 });
    return null;
  }
  return gsap.fromTo(
    element,
    { ...preset.fromVars },
    { ...preset.toVars, delay, duration: durations.reveal },
  );
}

export function createPageEntranceTimeline(
  container: Element,
  selector: string = "[data-animate]",
): gsap.core.Timeline | null {
  if (isReducedMotion()) return null;
  const elements = container.querySelectorAll(selector);
  if (!elements.length) return null;

  const tl = gsap.timeline({ defaults: { ease: easePremium } });

  elements.forEach((el) => {
    const presetName = el.getAttribute("data-animate") || "fade-up";
    const preset = presets[presetName] || presets["fade-up"];
    const delay = parseFloat(el.getAttribute("data-delay") || "0");
    const duration = parseFloat(el.getAttribute("data-duration") || `${durations.reveal}`);

    tl.fromTo(
      el,
      { ...preset.fromVars },
      { ...preset.toVars, delay, duration },
      "<",
    );
  });

  return tl;
}

export function createStaggerEntrance(
  container: Element,
  selector: string = "[data-animate-stagger]",
  stagger: number = staggerDelay,
): gsap.core.Timeline | null {
  if (isReducedMotion()) return null;
  const elements = container.querySelectorAll(selector);
  if (!elements.length) return null;

  const tl = gsap.timeline({ defaults: { ease: easePremium } });
  const defaultPresetName = container
    .querySelector("[data-animate-stagger]")
    ?.getAttribute("data-animate-stagger");

  const items = Array.from(elements);
  items.forEach((el, i) => {
    const presetName = el.getAttribute("data-animate") || defaultPresetName || "fade-up";
    const preset = presets[presetName] || presets["fade-up"];
    tl.fromTo(
      el,
      { ...preset.fromVars },
      { ...preset.toVars, duration: durations.reveal },
      i * stagger,
    );
  });

  return tl;
}
