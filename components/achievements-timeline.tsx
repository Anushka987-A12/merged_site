"use client";

/**
 * AchievementsTimeline — MotoManipal-style scroll-linked timeline.
 *
 * Layout:
 *  - Desktop (≥768px): sticky left year-rail  +  scrolling right entries column
 *  - Mobile (<768px):  sticky top horizontal year bar  +  stacked entries below
 *
 * Behaviour:
 *  - IntersectionObserver scroll-spy (rootMargin "-45% 0px -45% 0px")
 *    marks the viewport-centre entry as active → highlights year in rail.
 *  - rAF-throttled scroll handler fills the rail's progress line.
 *  - Rail <button>s scroll to the matching entry on click; aria-current tracks active.
 *  - history.replaceState keeps the URL hash in sync for deep-links (#2024).
 *  - Entrance: opacity 0 + translateY(40px) → in-view; dim past entries to 40%.
 *  - Odometer counters on stat chips animate up when an entry becomes active.
 *  - Prefers-reduced-motion: skips all transforms / smooth scroll.
 */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export interface Milestone {
  id: number;
  year: string;
  title: string;
  detail: string;
  badge?: string;
  tag?: string;
  stats?: string[];
  image?: string;
  type?: string;
}

interface AchievementsTimelineProps {
  milestones: readonly Milestone[];
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

/** Normalise "2023–24" → "2023" for rail grouping */
function normaliseYear(raw: string): string {
  // Take only the first 4-digit sequence
  const m = raw.match(/\d{4}/);
  return m ? m[0] : raw;
}

/** Animate a number from 0 → target over ~800ms */
function useOdometer(target: number, active: boolean, reducedMotion: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) { setValue(0); return; }
    if (reducedMotion) { setValue(target); return; }

    const start = performance.now();
    const duration = 800;

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, target, reducedMotion]);

  return value;
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Parses a stat string like "132 km/h" → number + unit suffix */
function StatChip({ raw, active, reducedMotion }: { raw: string; active: boolean; reducedMotion: boolean }) {
  const match = raw.match(/^(\d+)(.*)/);
  const num = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : raw;
  const animated = useOdometer(num, active, reducedMotion);

  if (!match) {
    return (
      <span className="at-stat-chip">{raw}</span>
    );
  }
  return (
    <span className="at-stat-chip">
      <span className="at-stat-num">{active ? animated : 0}</span>
      <span className="at-stat-unit">{suffix}</span>
    </span>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export function AchievementsTimeline({ milestones }: AchievementsTimelineProps) {
  // ── Reduced-motion preference ─────────────────
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Build display list: one entry per milestone ───────
  // Group milestones: deduplicate year labels for the rail
  const entries = useMemo(
    () =>
      milestones.map((m) => ({
        ...m,
        normYear: normaliseYear(m.year),
      })),
    [milestones]
  );

  // Unique, ordered rail years (preserving first-occurrence order)
  const railYears = useMemo(() => {
    const seen = new Set<string>();
    return entries
      .map((e) => e.normYear)
      .filter((y) => { if (seen.has(y)) return false; seen.add(y); return true; });
  }, [entries]);

  // ── Active tracking ────────────────────────────
  const [activeYear, setActiveYear] = useState<string>(railYears[0] ?? "");
  const [progressPct, setProgressPct] = useState(0); // 0-100 fill of rail line

  // Refs to entry DOM nodes keyed by milestone id
  const entryRefs = useRef<Map<number, HTMLLIElement>>(new Map());
  const sectionRef = useRef<HTMLElement>(null);
  const rafScheduled = useRef(false);

  // ── Scroll-spy (IntersectionObserver) ─────────────────
  // Fires when an entry crosses the ±45% viewport band (i.e., viewport centre)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        // If multiple entries intersect simultaneously, pick nearest-to-centre
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (!intersecting.length) return;

        const midVP = window.innerHeight / 2;
        let best = intersecting[0];
        let bestDist = Infinity;
        for (const e of intersecting) {
          const rect = e.boundingClientRect;
          const centre = (rect.top + rect.bottom) / 2;
          const dist = Math.abs(centre - midVP);
          if (dist < bestDist) { bestDist = dist; best = e; }
        }

        const year = (best.target as HTMLElement).dataset.normYear ?? "";
        if (year) {
          setActiveYear(year);
          // Deep-link: update hash without page jump
          history.replaceState(null, "", year ? `#${year}` : " ");
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    entryRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [entries]);

  // ── Progress line: rAF-throttled scroll handler ────────
  const updateProgress = useCallback(() => {
    rafScheduled.current = false;
    const section = sectionRef.current;
    if (!section) return;
    const { top, height } = section.getBoundingClientRect();
    const vh = window.innerHeight;
    // pct = how far we've scrolled through the section
    const scrolled = Math.max(0, -top);
    const total = Math.max(1, height - vh);
    setProgressPct(Math.min(100, (scrolled / total) * 100));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!rafScheduled.current) {
        rafScheduled.current = true;
        requestAnimationFrame(updateProgress);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateProgress]);

  // ── Deep-link: jump to hash year on first render ───────
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    // Find first entry for this year
    const target = Array.from(entryRefs.current.values()).find(
      (el) => el.dataset.normYear === hash
    );
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
      }, 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Rail click handler ────────────────────────
  const scrollToYear = useCallback(
    (year: string) => {
      const el = Array.from(entryRefs.current.values()).find(
        (e) => e.dataset.normYear === year
      );
      if (el) {
        el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
      }
    },
    [reducedMotion]
  );

  // ── Entry visibility state for entrance animation ──────
  // We track which entries have entered the viewport (for opacity fade-in)
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());
  const [pastIds, setPastIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (reducedMotion) {
      // Show all immediately
      setVisibleIds(new Set(entries.map((e) => e.id)));
      return;
    }
    const io = new IntersectionObserver(
      (ioEntries) => {
        setVisibleIds((prev) => {
          const next = new Set(prev);
          ioEntries.forEach((e) => {
            const id = Number((e.target as HTMLElement).dataset.id);
            if (e.isIntersecting) next.add(id);
          });
          return next;
        });
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 }
    );
    entryRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [entries, reducedMotion]);

  // Dim past entries
  useEffect(() => {
    const idx = entries.findIndex((e) => e.normYear === activeYear);
    if (idx < 0) return;
    // Any entry with an earlier index is "past"
    setPastIds(new Set(entries.slice(0, idx).map((e) => e.id)));
  }, [activeYear, entries]);

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Injected styles (scoped, no animation library) ── */}
      <style>{`
        /* ── CSS custom properties ──────────────────── */
        :root {
          --at-accent: #77dda4;          /* re-theme here */
          --at-glow:   rgba(119,221,164,.55);
          --at-page:   var(--page, #071720);
          --at-surface: var(--surface, #0d2029);
          --at-ink:    var(--ink, #eef7f5);
          --at-muted:  var(--muted-ink, #a8bec1);
        }

        /* ── Section wrapper ────────────────────────── */
        .at-section {
          position: relative;
          /* Faint radial glow behind section */
          --at-glow-opacity: 0;
        }

        /* ── Two-column layout ──────────────────────── */
        .at-layout {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 0 40px;
          align-items: start;
        }

        /* ── Year rail (left column) ────────────────── */
        .at-rail {
          position: sticky;
          top: calc(60px + 10svh); /* offset for nav */
          height: calc(80svh);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
          align-self: start;
        }

        /* Continuous progress track behind ticks */
        .at-rail__track {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: color-mix(in srgb, var(--at-accent) 18%, transparent);
          border-radius: 1px;
          overflow: hidden;
        }
        .at-rail__fill {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: var(--at-accent);
          box-shadow: 0 0 8px var(--at-glow);
          border-radius: 1px;
          transition: height 80ms linear;
        }

        /* Rail year items */
        .at-rail__list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          list-style: none;
          margin: 0;
          padding: 0;
          padding-left: 14px; /* space for the 2px track */
        }
        .at-rail__btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: var(--font-code, monospace);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--at-muted);
          transition: color 250ms ease;
          text-align: left;
        }
        .at-rail__btn:focus-visible {
          outline: 2px solid var(--at-accent);
          outline-offset: 3px;
          border-radius: 2px;
        }
        /* Tick mark */
        .at-rail__tick {
          display: block;
          width: 2px;
          height: 28px;
          background: currentColor;
          border-radius: 1px;
          flex-shrink: 0;
          transition: height 250ms ease, box-shadow 250ms ease, background 250ms ease;
        }
        /* Active rail item */
        .at-rail__btn[aria-current="true"] {
          color: var(--at-accent);
        }
        .at-rail__btn[aria-current="true"] .at-rail__tick {
          height: 44px;
          box-shadow: 0 0 12px var(--at-glow);
        }

        /* Sliding active indicator: an absolute glowing bar
           that travels between years (FLIP technique via CSS translate) */
        .at-rail__indicator {
          position: absolute;
          left: 0;
          width: 2px;
          height: 44px;
          background: var(--at-accent);
          box-shadow: 0 0 12px var(--at-glow);
          border-radius: 1px;
          transition: transform 280ms cubic-bezier(.34,1.56,.64,1);
          pointer-events: none;
        }

        /* ── Entries column (right) ─────────────────── */
        .at-entries {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* Each entry occupies ~1 screen height */
        .at-entry {
          min-height: 90svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 0;
          scroll-margin-top: 80px; /* offset sticky nav */
          /* Entrance animation */
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 550ms ease, transform 550ms ease;
        }
        .at-entry.is-visible {
          opacity: 1;
          transform: none;
        }
        /* Past entries dimmed */
        .at-entry.is-past {
          opacity: 0.4;
        }
        /* Active entry: full brightness, radial bg glow */
        .at-entry.is-active {
          opacity: 1;
        }
        .at-entry.is-active .at-entry__card {
          border-color: color-mix(in srgb, var(--at-accent) 40%, transparent);
          background: color-mix(in srgb, var(--at-surface) 90%, var(--at-accent) 10%);
          box-shadow: 0 0 60px -20px var(--at-glow);
        }

        /* Entry card */
        .at-entry__card {
          border: 1px solid color-mix(in srgb, var(--at-accent) 18%, transparent);
          background: color-mix(in srgb, var(--at-surface) 84%, transparent);
          padding: clamp(24px, 4vw, 40px);
          position: relative;
          transition: border-color 350ms ease, background 350ms ease, box-shadow 350ms ease;
        }

        /* Year eyebrow */
        .at-entry__eyebrow {
          font-family: var(--font-code, monospace);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--at-accent);
          margin-bottom: 10px;
        }

        /* Badge pill */
        .at-entry__badge {
          display: inline-block;
          font-family: var(--font-code, monospace);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--at-accent);
          border: 1px solid color-mix(in srgb, var(--at-accent) 42%, transparent);
          padding: 3px 8px;
          border-radius: 2px;
          margin-bottom: 14px;
        }

        /* Title */
        .at-entry__title {
          font-family: var(--font-display, sans-serif);
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 700;
          color: var(--at-ink);
          line-height: 1.2;
          margin: 0 0 14px;
        }

        /* Blurb */
        .at-entry__blurb {
          font-size: 15px;
          line-height: 1.8;
          color: var(--at-muted);
          max-width: 58ch;
          margin: 0;
        }

        /* Tag */
        .at-entry__tag {
          margin-top: 18px;
          font-family: var(--font-code, monospace);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--at-muted) 60%, transparent);
        }

        /* Stat chips row */
        .at-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }
        .at-stat-chip {
          display: inline-flex;
          align-items: baseline;
          gap: 3px;
          border: 1px solid color-mix(in srgb, var(--at-accent) 34%, transparent);
          background: color-mix(in srgb, var(--at-accent) 8%, transparent);
          padding: 5px 11px;
          border-radius: 3px;
          font-family: var(--font-code, monospace);
          font-size: 12px;
          font-weight: 700;
          color: var(--at-accent);
        }
        .at-stat-num { font-size: 14px; }
        .at-stat-unit { font-size: 10px; opacity: 0.7; }

        /* Entry image */
        .at-entry__img-wrap {
          margin-top: 24px;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--at-accent) 22%, transparent);
          max-height: 240px;
        }
        .at-entry__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(30%) brightness(0.88);
          transition: filter 350ms ease;
        }
        .at-entry.is-active .at-entry__img {
          filter: none;
        }

        /* ── End caps ───────────────────────────────── */
        .at-scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          padding: 32px 0 16px;
          color: var(--at-muted);
          font-family: var(--font-code, monospace);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .at-scroll-hint__arrow {
          display: block;
          width: 1px;
          height: 44px;
          background: linear-gradient(to bottom, var(--at-accent), transparent);
          margin-left: 1px;
          animation: at-arrow-bob 1.6s ease-in-out infinite;
        }
        @keyframes at-arrow-bob {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        .at-continued {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          padding-top: 32px;
          border-top: 1px solid color-mix(in srgb, var(--at-accent) 20%, transparent);
          color: var(--at-muted);
          font-family: var(--font-code, monospace);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .at-continued::before {
          content: "";
          display: block;
          width: 24px;
          height: 1px;
          background: var(--at-accent);
          flex-shrink: 0;
        }

        /* ── Mobile: horizontal sticky bar ─────────── */
        @media (max-width: 767px) {
          .at-layout {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .at-rail {
            position: sticky;
            top: 60px;
            height: auto;
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            scrollbar-width: none;
            padding: 12px 16px;
            background: color-mix(in srgb, var(--at-page) 92%, transparent);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid color-mix(in srgb, var(--at-accent) 18%, transparent);
            z-index: 10;
            gap: 0;
            justify-content: flex-start;
            align-self: auto;
          }
          .at-rail::-webkit-scrollbar { display: none; }
          .at-rail__track,
          .at-rail__indicator { display: none; }
          .at-rail__list {
            flex-direction: row;
            gap: 0;
            padding-left: 0;
            overflow-x: auto;
          }
          .at-rail__btn {
            flex-direction: column;
            gap: 6px;
            padding: 0 14px;
            font-size: 10px;
          }
          .at-rail__tick {
            width: 100%;
            height: 2px;
            /* Active: underline grows */
          }
          .at-rail__btn[aria-current="true"] .at-rail__tick {
            height: 2px;
            box-shadow: 0 0 8px var(--at-glow);
            width: 100%;
          }
          .at-entry {
            min-height: 85svh;
            padding: 32px 0;
          }
          .at-scroll-hint { display: none; }
        }

        /* ── Reduced-motion overrides ──────────────── */
        @media (prefers-reduced-motion: reduce) {
          .at-entry {
            opacity: 1 !important;
            transform: none !important;
            transition: opacity 200ms ease !important;
          }
          .at-entry.is-past { opacity: 0.5 !important; }
          .at-rail__btn,
          .at-rail__tick,
          .at-rail__fill,
          .at-rail__indicator { transition: none !important; }
          .at-scroll-hint__arrow { animation: none !important; }
          .at-entry__img { transition: none !important; }
          .at-entry__card { transition: none !important; }
        }
      `}</style>

      <section ref={sectionRef} className="at-section" aria-label="Achievements timeline">

        {/* ── "Scroll to explore" hint ──────────────── */}
        <div className="at-scroll-hint" aria-hidden="true">
          <span>Scroll to explore</span>
          <span className="at-scroll-hint__arrow" />
        </div>

        <div className="at-layout">
          {/* ════════════════════════════════════════
              LEFT — Sticky year rail
          ════════════════════════════════════════ */}
          <nav aria-label="Timeline years" className="at-rail">
            {/* Continuous progress fill track */}
            <div className="at-rail__track" aria-hidden="true">
              <div
                className="at-rail__fill"
                style={{ height: `${progressPct}%` }}
              />
            </div>

            <ol className="at-rail__list" role="list">
              {railYears.map((year) => (
                <li key={year}>
                  <button
                    className="at-rail__btn"
                    aria-current={activeYear === year ? "true" : undefined}
                    onClick={() => scrollToYear(year)}
                  >
                    <span className="at-rail__tick" aria-hidden="true" />
                    <span>{year}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {/* ════════════════════════════════════════
              RIGHT — Scrolling achievement entries
          ════════════════════════════════════════ */}
          <ol className="at-entries" aria-label="Achievement entries">
            {entries.map((entry, i) => {
              const isActive = entry.normYear === activeYear;
              const isVisible = visibleIds.has(entry.id);
              const isPast = pastIds.has(entry.id);

              return (
                <li
                  key={entry.id}
                  ref={(el) => {
                    if (el) entryRefs.current.set(entry.id, el);
                    else entryRefs.current.delete(entry.id);
                  }}
                  id={i === 0 || entries[i - 1]?.normYear !== entry.normYear ? entry.normYear : undefined}
                  data-norm-year={entry.normYear}
                  data-id={entry.id}
                  className={[
                    "at-entry",
                    isVisible ? "is-visible" : "",
                    isActive ? "is-active" : "",
                    isPast && !isActive ? "is-past" : "",
                  ].filter(Boolean).join(" ")}
                  aria-label={`${entry.year} — ${entry.title}`}
                >
                  <div className="at-entry__card">
                    {/* Year eyebrow */}
                    <p className="at-entry__eyebrow" aria-hidden="true">
                      {entry.year}
                    </p>

                    {/* Badge pill */}
                    {entry.badge && (
                      <span className="at-entry__badge">{entry.badge}</span>
                    )}

                    {/* Title */}
                    <h3 className="at-entry__title">{entry.title}</h3>

                    {/* Blurb */}
                    <p className="at-entry__blurb">{entry.detail}</p>

                    {/* Tag */}
                    {entry.tag && (
                      <p className="at-entry__tag" aria-hidden="true">
                        ◈ {entry.tag}
                      </p>
                    )}

                    {/* Stat chips with odometer animation */}
                    {entry.stats && entry.stats.length > 0 && (
                      <div className="at-stats" aria-label="Statistics">
                        {entry.stats.map((s) => (
                          <StatChip
                            key={s}
                            raw={s}
                            active={isActive}
                            reducedMotion={reducedMotion}
                          />
                        ))}
                      </div>
                    )}

                    {/* Optional image */}
                    {entry.image && (
                      <div className="at-entry__img-wrap">
                        <img
                          src={entry.image}
                          alt=""
                          className="at-entry__img"
                          loading="lazy"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}

            {/* "…to be continued" terminator */}
            <li aria-hidden="true">
              <p className="at-continued">…to be continued</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
