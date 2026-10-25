"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconBrain,
  IconCircuitCapacitor,
  IconRobot,
  IconSettings,
  IconShieldCheck,
  IconArrowDownRight,
  IconChevronDown,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { SectionAtmosphere } from "@/components/section-atmosphere";
import { SUBSYSTEMS } from "@/lib/subsystem-data";

export default function SubsystemsPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [pinnedSlug, setPinnedSlug] = useState<string | null>(null);

  return (
    <main data-background-slot="subsystems" className="relative isolate mx-auto min-h-screen max-w-[1360px] space-y-10 px-5 pb-24 pt-10 md:space-y-14 md:px-10 md:pt-16">
      <SectionAtmosphere variant="subsystems" />

      <header className="border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-8 md:pb-10">
        <h1 className="font-commissioner text-4xl font-bold tracking-tight text-[var(--ink)] md:text-6xl">Subsystems</h1>
      </header>

      <section aria-label="RUGVED subsystems" className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SUBSYSTEMS.map((subsystem, index) => {
          const Icon = {
            management: IconSettings,
            robotics: IconRobot,
            electronics: IconCircuitCapacitor,
            mechanical: IconShieldCheck,
            research: IconBrain,
          }[subsystem.icon];
          const isActive = activeSlug === subsystem.slug;
          const detailsId = `division-details-${subsystem.slug}`;

          return (
            <motion.article
              key={subsystem.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: index * 0.04 }}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse" && !pinnedSlug) {
                  setActiveSlug(subsystem.slug);
                }
              }}
              onPointerLeave={() => {
                if (pinnedSlug !== subsystem.slug) {
                  setActiveSlug((current) => current === subsystem.slug ? null : current);
                }
              }}
              onFocusCapture={() => {
                if (!pinnedSlug) setActiveSlug(subsystem.slug);
              }}
              className={`overflow-hidden border bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] transition-colors ${isActive ? "border-[color-mix(in_srgb,var(--signal-accent)_58%,transparent)] shadow-[0_18px_48px_rgba(0,0,0,0.2)]" : "border-[color-mix(in_srgb,var(--blue-accent)_20%,transparent)]"}`}
            >
              <Link
                href={`/subsystems/${subsystem.slug}`}
                className="group flex min-h-56 w-full flex-col p-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--field-accent)] sm:p-7"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-[color-mix(in_srgb,var(--field-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--field-accent)_8%,transparent)] text-[var(--field-accent)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h2 className="font-commissioner text-2xl font-bold tracking-tight text-[var(--ink)] md:text-[27px]">{subsystem.title}</h2>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--muted-ink)]">{subsystem.summary}</p>
                <span className="mt-auto flex items-center justify-between pt-6 font-mono text-[9px] font-bold tracking-[0.17em] text-[var(--field-accent)]">
                  VIEW DETAILS <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>

              <button
                type="button"
                aria-expanded={isActive}
                aria-controls={detailsId}
                onClick={() => {
                  if (pinnedSlug === subsystem.slug) {
                    setPinnedSlug(null);
                    setActiveSlug(null);
                  } else {
                    setPinnedSlug(subsystem.slug);
                    setActiveSlug(subsystem.slug);
                  }
                }}
                className="flex w-full items-center justify-between border-t border-[color-mix(in_srgb,var(--blue-accent)_18%,transparent)] px-6 py-3 text-left font-mono text-[9px] font-bold tracking-[0.17em] text-[var(--muted-ink)] transition-colors hover:text-[var(--field-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--field-accent)] sm:px-7"
              >
                {isActive ? "CLOSE QUICK VIEW" : "QUICK VIEW"}
                <IconChevronDown className={`h-4 w-4 transition-transform duration-300 ${isActive ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    id={detailsId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] px-6 pb-6 pt-5 sm:px-7 sm:pb-7">
                      <p className="text-sm text-[var(--ink)]"><span className="font-semibold">Lead:</span> {subsystem.leadRole}</p>
                      <p className="mt-5 text-sm leading-6 text-[var(--muted-ink)]">{subsystem.overview}</p>
                      <h3 className="mt-5 text-sm font-semibold text-[var(--ink)]">Deliverables</h3>
                      <ul className="mt-3 grid gap-2">
                        {subsystem.deliverables.map((deliverable) => (
                          <li key={deliverable} className="flex items-start gap-2 text-sm text-[var(--ink)]">
                            <IconArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--field-accent)]" />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {subsystem.focus.map((focus) => (
                          <span key={focus} className="border border-[color-mix(in_srgb,var(--blue-accent)_25%,transparent)] px-2.5 py-1.5 font-mono text-[9px] tracking-wide text-[var(--muted-ink)]">{focus}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </section>
    </main>
  );
}
