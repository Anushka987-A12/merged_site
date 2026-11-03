"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  IconArrowUpRight,
  IconFileText,
  IconShieldLock,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { RUGVED_DATA } from "@/lib/rugved-data";

const PROJECTS = RUGVED_DATA.projects;

const FILTERS: string[] = [
  "All",
  ...Array.from(new Set(PROJECTS.map((project) => project.category))),
];

const FILTER_SPRING = { type: "spring", stiffness: 420, damping: 36 } as const;

type LedgerRow = {
  id: string;
  year: string;
  title: string;
  meta?: string;
  type: "PAPER" | "PATENT";
  href?: string;
};

const LEDGER: LedgerRow[] = [
  ...RUGVED_DATA.research.map((paper) => ({
    id: paper.title,
    year: paper.year,
    title: paper.title,
    type: "PAPER" as const,
    href: paper.href,
  })),
  ...RUGVED_DATA.patents.map((patent) => ({
    id: patent.applicationNumber,
    year: "—",
    title: patent.title,
    meta: `APP ${patent.applicationNumber} · ${patent.status}`,
    type: "PATENT" as const,
  })),
];

const ledgerList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const ledgerRow: Variants = {
  hidden: { y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

export function ProjectsCatalog() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState("All");
  const [activeSlug, setActiveSlug] = useState(PROJECTS[0].slug);

  const visible =
    filter === "All"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === filter);

  const preview =
    visible.find((project) => project.slug === activeSlug) ??
    visible[0] ??
    PROJECTS[0];

  const selectFilter = (nextFilter: string) => {
    setFilter(nextFilter);
    const nextVisible =
      nextFilter === "All"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === nextFilter);
    if (nextVisible[0]) setActiveSlug(nextVisible[0].slug);
  };

  return (
    <div className="space-y-16 md:space-y-20">
      <section aria-labelledby="platforms-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-4">
          <h2
            id="platforms-heading"
            className="font-commissioner text-2xl font-bold text-[var(--ink)] md:text-3xl"
          >
            Field systems
          </h2>
          <p className="hidden max-w-[38ch] text-[11px] leading-6 text-[var(--muted-ink)] lg:block">
            Hover or focus a line to preview the platform. Open it for the full
            dossier.
          </p>
        </div>

        {/* Filter chips with a sliding pill */}
        <div
          role="group"
          aria-label="Filter projects by category"
          className="mb-2 flex flex-wrap items-center gap-1.5"
        >
          {FILTERS.map((category) => {
            const isActive = category === filter;
            return (
              <button
                key={category}
                type="button"
                onClick={() => selectFilter(category)}
                aria-pressed={isActive}
                className={`relative rounded-full px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal-accent)] ${
                  isActive
                    ? "text-[var(--ink)]"
                    : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="project-filter-pill"
                    transition={reduceMotion ? { duration: 0 } : FILTER_SPRING}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[color-mix(in_srgb,var(--field-accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--field-accent)_12%,var(--surface))]"
                  />
                )}
                <span className="relative">{category}</span>
              </button>
            );
          })}
          <span aria-live="polite" className="sr-only">
            {String(visible.length).padStart(2, "0")} visible
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12 xl:gap-16">
          <motion.ul
            layout
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
            className="m-0 list-none border-t border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] p-0"
          >
            {visible.map((project) => {
              const isPreview = project.slug === preview.slug;
              return (
                <motion.li
                  key={project.slug}
                  layout
                  transition={{
                    duration: reduceMotion ? 0 : 0.3,
                    ease: "easeOut",
                  }}
                  className="border-b border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)]"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    onMouseEnter={() => setActiveSlug(project.slug)}
                    onFocus={() => setActiveSlug(project.slug)}
                    className="group relative flex items-center gap-4 px-2 py-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--signal-accent)] md:gap-6 md:px-3 md:py-5"
                  >
                    {isPreview && (
                      <motion.span
                        layoutId="project-row-highlight"
                        transition={
                          reduceMotion ? { duration: 0 } : FILTER_SPRING
                        }
                        aria-hidden="true"
                        className="absolute inset-0 bg-[color-mix(in_srgb,var(--surface-raised)_58%,transparent)]"
                      />
                    )}

                    <span className="relative w-9 shrink-0 font-mono text-[10px] font-bold tracking-[0.12em] text-[var(--field-accent)] md:w-11">
                      {project.code}
                    </span>

                    <span className="relative h-11 w-16 shrink-0 overflow-hidden border border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[var(--surface-raised)] lg:hidden">
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>

                    <span className="relative min-w-0 flex-1">
                      <span className="block truncate font-commissioner text-xl font-bold tracking-tight text-[var(--ink)] md:text-2xl">
                        {project.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-[var(--muted-ink)]">
                        {project.subtitle}
                      </span>
                    </span>

                    <span className="relative hidden shrink-0 font-mono text-[9px] tracking-[0.16em] text-[var(--muted-ink)] sm:block">
                      {project.category}
                    </span>

                    <IconArrowUpRight
                      aria-hidden="true"
                      className="relative h-5 w-5 shrink-0 text-[var(--field-accent)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--field-accent)] transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* Sticky preview: the one signature moment on this page */}
          <aside className="hidden lg:block lg:sticky lg:top-[84px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={preview.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.18 }}
                className="m-0"
              >
                <Link
                  href={`/projects/${preview.slug}`}
                  className="group block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal-accent)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden border border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] bg-[var(--surface-raised)]">
                    <Image
                      src={preview.image}
                      alt={preview.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent"
                    />
                    <span className="absolute left-4 top-4 border border-[color-mix(in_srgb,var(--field-accent)_42%,transparent)] bg-[color-mix(in_srgb,var(--page)_74%,transparent)] px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.14em] text-[var(--field-accent)] backdrop-blur-sm">
                      {preview.code} · {preview.category}
                    </span>
                  </div>

                  <figcaption>
                    <h3 className="mt-5 font-commissioner text-2xl font-bold tracking-tight text-[var(--ink)]">
                      {preview.title}
                    </h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                      {preview.subtitle}
                    </p>

                    <ul className="mt-5 m-0 list-none border-t border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] p-0">
                      {preview.keyPoints.slice(0, 3).map((point) => (
                        <li
                          key={point}
                          className="border-b border-[color-mix(in_srgb,var(--blue-accent)_16%,transparent)] py-2.5 text-[12px] leading-6 text-[var(--ink)]"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-5 inline-flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.18em] text-[var(--field-accent)]">
                      OPEN DOSSIER
                      <IconArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </figcaption>
                </Link>
              </motion.figure>
            </AnimatePresence>
          </aside>
        </div>
      </section>

      {/* Research as a ledger */}
      <section
        id="research"
        aria-labelledby="research-heading"
        className="scroll-mt-24"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-4">
          <h2
            id="research-heading"
            className="font-commissioner text-2xl font-bold text-[var(--ink)] md:text-3xl"
          >
            Research &amp; patents
          </h2>
        </div>

        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Research papers and patent filings
          </caption>
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--muted-ink)]">
              <th scope="col" className="py-3 pr-4 font-medium">
                Year
              </th>
              <th scope="col" className="py-3 pr-4 font-medium">
                Title
              </th>
              <th scope="col" className="py-3 pr-4 font-medium">
                Type
              </th>
              <th scope="col" className="py-3 text-right font-medium">
                Link
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={ledgerList}
            initial={reduceMotion ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {LEDGER.map((entry) => (
              <motion.tr
                key={entry.id}
                variants={ledgerRow}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 border-b border-[color-mix(in_srgb,var(--blue-accent)_18%,transparent)] py-4 md:table-row md:py-0"
              >
                <td className="col-start-1 row-start-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted-ink)] md:table-cell md:w-40 md:py-4 md:pr-4">
                  {entry.year}
                </td>

                <td className="col-span-2 row-start-2 md:table-cell md:py-4 md:pr-4">
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm font-medium leading-6 text-[var(--ink)] underline decoration-transparent decoration-1 underline-offset-[3px] transition-colors duration-200 hover:text-[var(--field-accent)] hover:decoration-[var(--field-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal-accent)]"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    <span className="block text-sm font-medium leading-6 text-[var(--ink)]">
                      {entry.title}
                    </span>
                  )}
                  {entry.meta && (
                    <span className="mt-1 block font-mono text-[9px] uppercase leading-5 tracking-[0.1em] text-[var(--muted-ink)]">
                      {entry.meta}
                    </span>
                  )}
                </td>

                <td className="col-start-2 row-start-1 justify-self-end md:table-cell md:py-4 md:pr-4">
                  <span
                    className={`inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[8px] font-bold tracking-[0.14em] ${
                      entry.type === "PAPER"
                        ? "border-[color-mix(in_srgb,var(--blue-accent)_38%,transparent)] text-[var(--blue-accent)]"
                        : "border-[color-mix(in_srgb,var(--signal-accent)_38%,transparent)] text-[var(--signal-accent)]"
                    }`}
                  >
                    {entry.type === "PAPER" ? (
                      <IconFileText className="h-3 w-3" stroke={1.6} />
                    ) : (
                      <IconShieldLock className="h-3 w-3" stroke={1.6} />
                    )}
                    {entry.type}
                  </span>
                </td>

                <td
                  className={`col-start-2 row-start-3 justify-self-end md:table-cell md:py-4 md:text-right ${
                    entry.href ? "" : "hidden"
                  }`}
                >
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.16em] text-[var(--field-accent)] hover:text-[var(--signal-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal-accent)]"
                    >
                      VIEW
                      <IconArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span
                      aria-label="No public link"
                      className="font-mono text-[10px] text-[var(--muted-ink)]"
                    >
                      —
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>

        <div className="mt-5 space-y-1.5 border-t border-[color-mix(in_srgb,var(--blue-accent)_18%,transparent)] pt-4 text-xs leading-6 text-[var(--muted-ink)]">
          <p>{RUGVED_DATA.disclosures.research}</p>
          <p>{RUGVED_DATA.disclosures.patents}</p>
        </div>
      </section>
    </div>
  );
}
