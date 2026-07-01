"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { isReducedMotion, easePremium, durations } from "@/lib/animations";

interface FadeInProps {
  children: React.ReactNode;
  as?: "div" | "span" | "section" | "article";
  preset?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  as: Tag = "div",
  preset = "fade-up",
  delay = 0,
  duration,
  className,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isReducedMotion()) {
      gsap.set(ref.current, { opacity: 1, y: 0, scale: 1, x: 0 });
      return;
    }

    const fromVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration: duration ?? durations.reveal,
      delay,
      ease: easePremium,
    };

    switch (preset) {
      case "fade-up":
        fromVars.y = 40;
        toVars.y = 0;
        break;
      case "scale-in":
        fromVars.scale = 0.95;
        toVars.scale = 1;
        break;
      case "slide-left":
        fromVars.x = 40;
        toVars.x = 0;
        break;
      case "slide-right":
        fromVars.x = -40;
        toVars.x = 0;
        break;
    }

    gsap.fromTo(ref.current, fromVars, toVars);
  }, [preset, delay, duration]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
