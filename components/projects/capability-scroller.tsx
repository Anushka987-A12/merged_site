"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CapabilityAnimation } from "@/components/capability-animation";
import type { Capability } from "@/lib/project-data";

export function CapabilityScroller({
  capabilities,
}: {
  capabilities: Capability[];
}) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = sectionRefs.current.filter(
      (node): node is HTMLElement => node !== null,
    );
    if (!nodes.length) return;

    const updateActive = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActive(closestIndex);
    };

    const observer = new IntersectionObserver(
      () => updateActive(),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    updateActive();

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActive();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const goTo = (index: number) => {
    setActive(index);
    sectionRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  const activeCapability = capabilities[active];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
      {/* Sticky stage: the capability animations are the centrepiece here */}
      <div className="hidden lg:sticky lg:top-[84px] lg:block lg:self-start">
        <div className="capability-stage">
          <div className="capability-card is-active">
            <CapabilityAnimation
              key={active}
              kind={activeCapability.animation}
              label={"CAP-" + String(active + 1).padStart(2, "0")}
            />
          </div>
        </div>

        <ol className="mt-4 list-none border-t border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] p-0">
          {capabilities.map((capability, index) => {
            const isActive = index === active;
            return (
              <li
                key={capability.title}
                className="border-b border-[color-mix(in_srgb,var(--blue-accent)_16%,transparent)]"
              >
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative flex w-full items-center gap-3 py-2.5 pl-4 pr-2 text-left transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal-accent)] ${
                    isActive
                      ? "text-[var(--ink)]"
                      : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="capability-tick"
                      transition={
                        reduceMotion ? { duration: 0 } : { duration: 0.25 }
                      }
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-0.5 bg-[var(--field-accent)]"
                    />
                  )}
                  <span
                    className={`font-mono text-[9px] font-bold tracking-[0.16em] ${
                      isActive
                        ? "text-[var(--field-accent)]"
                        : "text-[var(--muted-ink)]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[11px]">
                    {capability.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Scrolling capability descriptions */}
      <div className="lg:pt-0">
        {capabilities.map((capability, index) => {
          const isActive = index === active;
          return (
            <section
              key={capability.title}
              ref={(node) => {
                sectionRefs.current[index] = node;
              }}
              tabIndex={0}
              aria-current={isActive ? "true" : undefined}
              aria-labelledby={`capability-${index}`}
              onFocus={() => setActive(index)}
              className="flex min-h-[60vh] scroll-mt-[100px] flex-col justify-center border-b border-[color-mix(in_srgb,var(--blue-accent)_18%,transparent)] py-10 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal-accent)] lg:py-16"
            >
              <div className="capability-stage mb-6 lg:hidden">
                <div className="capability-card is-active">
                  <CapabilityAnimation
                    kind={capability.animation}
                    label={"CAP-" + String(index + 1).padStart(2, "0")}
                  />
                </div>
              </div>

              <h3
                id={`capability-${index}`}
                className="font-commissioner text-2xl font-bold tracking-tight text-[var(--ink)] md:text-3xl"
              >
                {capability.title}
              </h3>
              <p className="mt-4 max-w-[46ch] text-sm leading-7 text-[var(--muted-ink)]">
                {capability.summary}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
