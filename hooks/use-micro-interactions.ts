"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { isReducedMotion, easeOut, durations } from "@/lib/animations";

interface MicroOptions {
  buttonSelector?: string;
  cardSelector?: string;
  sidebarLinkSelector?: string;
  iconSelector?: string;
}

export function useMicroInteractions<T extends HTMLElement>(
  options: MicroOptions = {},
) {
  const ref = useRef<T>(null);
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (!ref.current || isReducedMotion()) return;

    const container = ref.current;
    const cleanups: (() => void)[] = [];

    const buttonSelector = options.buttonSelector || ".btn, button:not(.no-anim):not([class*='filter'])";
    const cardSelector = options.cardSelector || ".cert-tile, .cert-card, .ds-stat, .ds-year, .ds-flap-btn";
    const sidebarLinkSelector = options.sidebarLinkSelector || ".binder-link";
    const iconSelector = options.iconSelector || "[class*='ph-']";

    document.querySelectorAll(buttonSelector).forEach((btn) => {
      const el = btn as HTMLElement;
      const hoverIn = () => {
        gsap.to(el, { scale: 1.03, duration: durations.fast, ease: easeOut, overwrite: "auto" });
      };
      const hoverOut = () => {
        gsap.to(el, { scale: 1, duration: durations.fast, ease: easeOut, overwrite: "auto" });
      };
      const clickDown = () => {
        gsap.to(el, { scale: 0.96, duration: 0.1, ease: "power2.out", overwrite: "auto" });
      };
      const clickUp = () => {
        gsap.to(el, { scale: 1, duration: 0.15, ease: "back.out(2)", overwrite: "auto" });
      };

      el.addEventListener("mouseenter", hoverIn);
      el.addEventListener("mouseleave", hoverOut);
      el.addEventListener("mousedown", clickDown);
      el.addEventListener("mouseup", clickUp);
      el.addEventListener("mouseleave", clickUp);

      cleanups.push(() => {
        el.removeEventListener("mouseenter", hoverIn);
        el.removeEventListener("mouseleave", hoverOut);
        el.removeEventListener("mousedown", clickDown);
        el.removeEventListener("mouseup", clickUp);
        el.removeEventListener("mouseleave", clickUp);
      });
    });

    document.querySelectorAll(cardSelector).forEach((card) => {
      const el = card as HTMLElement;
      const hoverIn = () => {
        gsap.to(el, {
          y: -4,
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          duration: durations.fast,
          ease: easeOut,
          overwrite: "auto",
        });
      };
      const hoverOut = () => {
        gsap.to(el, {
          y: 0,
          boxShadow: "none",
          duration: durations.fast,
          ease: easeOut,
          overwrite: "auto",
        });
      };

      el.addEventListener("mouseenter", hoverIn);
      el.addEventListener("mouseleave", hoverOut);

      cleanups.push(() => {
        el.removeEventListener("mouseenter", hoverIn);
        el.removeEventListener("mouseleave", hoverOut);
      });
    });

    document.querySelectorAll(sidebarLinkSelector).forEach((link) => {
      const el = link as HTMLElement;
      const icon = el.querySelector("[class*='ph-']") as HTMLElement | null;

      const hoverIn = () => {
        if (icon) {
          gsap.to(icon, { rotation: 5, scale: 1.1, duration: durations.fast, ease: easeOut, overwrite: "auto" });
        }
      };
      const hoverOut = () => {
        if (icon) {
          gsap.to(icon, { rotation: 0, scale: 1, duration: durations.fast, ease: easeOut, overwrite: "auto" });
        }
      };

      el.addEventListener("mouseenter", hoverIn);
      el.addEventListener("mouseleave", hoverOut);

      cleanups.push(() => {
        el.removeEventListener("mouseenter", hoverIn);
        el.removeEventListener("mouseleave", hoverOut);
      });
    });

    document.querySelectorAll(iconSelector).forEach((icon) => {
      const el = icon as HTMLElement;
      const hoverIn = () => {
        gsap.to(el, {
          rotation: 5,
          scale: 1.1,
          duration: durations.fast,
          ease: easeOut,
          overwrite: "auto",
        });
      };
      const hoverOut = () => {
        gsap.to(el, {
          rotation: 0,
          scale: 1,
          duration: durations.fast,
          ease: easeOut,
          overwrite: "auto",
        });
      };

      el.addEventListener("mouseenter", hoverIn);
      el.addEventListener("mouseleave", hoverOut);

      cleanups.push(() => {
        el.removeEventListener("mouseenter", hoverIn);
        el.removeEventListener("mouseleave", hoverOut);
      });
    });

    cleanupRef.current = cleanups;

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [options.buttonSelector, options.cardSelector, options.sidebarLinkSelector, options.iconSelector]);

  return ref;
}
