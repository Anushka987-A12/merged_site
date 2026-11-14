"use client";

import { useEffect, type RefObject } from "react";

/** Suspend decorative CSS and Web Animations when nobody can see them. */
export function useAmbientActivity(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const paused = new Set<Animation>();
    const sync = () => {
      const active = visible && !document.hidden && !preference.matches;
      element.dataset.motionPaused = String(!active);
      if (!active) {
        element.getAnimations({ subtree: true }).forEach((animation) => {
          if (animation.playState === "running") {
            paused.add(animation);
            animation.pause();
          }
        });
      } else {
        element.getAnimations({ subtree: true }).forEach((animation) => {
          if (animation.playState === "paused") animation.play();
        });
        paused.clear();
      }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      paused.clear();
    };
  }, [ref]);
}
