"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion, easePremium, durations } from "@/lib/animations";

interface ScrollRevealOptions {
  selector?: string;
  stagger?: number;
  threshold?: number;
  rootMargin?: string;
  toggleActions?: string;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isReducedMotion()) {
      ref.current.querySelectorAll("[data-scroll]").forEach((el) => {
        gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      });
      return;
    }

    const sections = ref.current.querySelectorAll(
      options.selector || "[data-scroll]",
    );

    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const presetName = section.getAttribute("data-scroll") || "fade-up";
      const stagger = parseFloat(section.getAttribute("data-scroll-stagger") || "0");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: options.toggleActions || "play none none none",
          invalidateOnRefresh: true,
        },
        defaults: { ease: easePremium },
      });

      if (stagger > 0) {
        const children = section.children;
        Array.from(children).forEach((child, i) => {
          const preset = getPresetVars(presetName);
          tl.fromTo(
            child,
            { ...preset.from },
            { ...preset.to, duration: durations.reveal },
            i * stagger,
          );
        });
      } else {
        const preset = getPresetVars(presetName);
        tl.fromTo(
          section,
          { ...preset.from },
          { ...preset.to, duration: durations.reveal },
        );
      }

      const st = tl.scrollTrigger;
      if (st) triggers.push(st);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, [options.selector, options.stagger, options.threshold, options.rootMargin, options.toggleActions]);

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
