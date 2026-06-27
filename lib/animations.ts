import { useEffect } from "react";
import gsap from "gsap";

function navDir(): number {
  const d = sessionStorage.getItem("nav-dir");
  sessionStorage.removeItem("nav-dir");
  return d === "up" ? -1 : 1;
}

export function useEntranceAnimation(ref: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dir = navDir();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-entrance]", { y: 24 * dir, autoAlpha: 0, duration: 0.25, stagger: 0.04, ease: "power2.out" });
      gsap.from("[data-entrance-hero]", { y: 32 * dir, autoAlpha: 0, duration: 0.3, ease: "power2.out" });
      gsap.from("[data-entrance-panel]", { y: 20 * dir, autoAlpha: 0, duration: 0.25, stagger: 0.06, ease: "power2.out" });
      gsap.from("[data-entrance-scale]", { scale: 0.92, autoAlpha: 0, duration: 0.3, ease: "power2.out" });
      gsap.from("[data-entrance-left]", { y: -12 * dir, autoAlpha: 0, duration: 0.25, ease: "power2.out" });
      gsap.from("[data-entrance-filter]", { y: -12 * dir, autoAlpha: 0, duration: 0.25, ease: "power2.out" });
      gsap.from("[data-entrance-detail] > *", { y: 12 * dir, autoAlpha: 0, duration: 0.2, stagger: 0.04, ease: "power2.out" });
      gsap.from("[data-entrance-preview]", { scale: 0.95, autoAlpha: 0, duration: 0.3, ease: "power2.out" });
      gsap.from("[data-entrance-form] > *", { y: 16 * dir, autoAlpha: 0, duration: 0.25, stagger: 0.05, ease: "power2.out" });
      gsap.from("[data-entrance-sidebar]", { x: -280, autoAlpha: 0, duration: 0.3, ease: "power2.out" });
    }, el);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
