"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { createPageEntranceTimeline, isReducedMotion, easePremium, durations } from "@/lib/animations";

interface PageEntranceOptions {
  selector?: string;
  stagger?: number;
  defaults?: gsap.TweenVars;
  onComplete?: () => void;
}

export function usePageEntrance<T extends HTMLElement>(
  options: PageEntranceOptions = {},
) {
  const ref = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isReducedMotion()) {
      ref.current.querySelectorAll("[data-animate], [data-animate-stagger]").forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0, scale: 1, x: 0 });
      });
      options.onComplete?.();
      return;
    }

    const container = ref.current;

    const staggered = container.querySelectorAll("[data-animate-stagger]");
    const nonStaggered = container.querySelectorAll(
      `${options.selector || "[data-animate]"}:not([data-animate-stagger] *)`,
    );

    const tl = gsap.timeline({
      defaults: { ease: easePremium, ...options.defaults },
      onComplete: options.onComplete,
    });

    const duration = durations.reveal;

    const sorted: { el: Element; order: number }[] = [];
    nonStaggered.forEach((el) => {
      const order = parseInt(el.getAttribute("data-order") || "0", 10);
      sorted.push({ el, order });
    });
    sorted.sort((a, b) => a.order - b.order);

    sorted.forEach(({ el }) => {
      const presetName = el.getAttribute("data-animate") || "fade-up";
      const preset = getPresetVars(presetName);
      const delay = parseFloat(el.getAttribute("data-delay") || "0");
      tl.fromTo(
        el,
        { ...preset.from },
        { ...preset.to, delay, duration },
        "<",
      );
    });

    const staggerItems = Array.from(staggered);
    if (staggerItems.length > 0) {
      const staggerDelay = options.stagger ?? 0.08;
      staggerItems.forEach((el, i) => {
        const presetName = el.getAttribute("data-animate") || "fade-up";
        const preset = getPresetVars(presetName);
        tl.fromTo(
          el,
          { ...preset.from },
          { ...preset.to, duration: durations.reveal },
          i * staggerDelay,
        );
      });
    }

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [options.selector, options.stagger, options.onComplete]);

  return ref;
}

function getPresetVars(name: string): { from: gsap.TweenVars; to: gsap.TweenVars } {
  switch (name) {
    case "fade-in":
      return { from: { opacity: 0 }, to: { opacity: 1 } };
    case "scale-in":
      return { from: { opacity: 0, scale: 0.95 }, to: { opacity: 1, scale: 1 } };
    case "slide-left":
      return { from: { opacity: 0, x: 40 }, to: { opacity: 1, x: 0 } };
    case "slide-right":
      return { from: { opacity: 0, x: -40 }, to: { opacity: 1, x: 0 } };
    case "fade-up":
    default:
      return { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } };
  }
}
