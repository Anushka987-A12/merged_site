"use client";

/**
 * TimelineYearRail
 *
 * A sticky left year-progress rail that scroll-spies the existing
 * [data-timeline-row] elements rendered by the home-page timeline.
 * It does NOT change or re-render any timeline cards — it only reads
 * their positions via IntersectionObserver and a rAF scroll handler.
 *
 * Props:
 *  milestones — same array used to render the timeline rows (order must match).
 *  trackRef   — ref to the .home-timeline__track wrapper div.
 */

import { useCallback, useEffect, useRef, useState } from "react";

/* ── helpers ─────────────────────────────────── */
function normYear(raw: string) {
  const m = raw.match(/\d{4}/);
  return m ? m[0] : raw;
}

/* ── types ───────────────────────────────────── */
interface Props {
  milestones: readonly { id: number; year: string }[];
  trackRef: React.RefObject<HTMLDivElement | null>;
}

/* ── component ───────────────────────────────── */
export function TimelineYearRail({ milestones, trackRef }: Props) {
  /* unique years in order of first appearance */
  const railYears = [...new Set(milestones.map((m) => normYear(m.year)))];
  /* index → normalised year (same order as rendered rows) */
  const indexToYear = milestones.map((m) => normYear(m.year));

  const [activeYear, setActiveYear] = useState(railYears[0] ?? "");
  const [progressPct, setProgressPct] = useState(0);
  const rafPending = useRef(false);

  /* ── Scroll-spy ─────────────────────────────────────────────────
     Observe every [data-timeline-row] inside the track.
     rootMargin "-45% 0px -45% 0px" → only fires near viewport centre.
     When multiple rows intersect at once, pick nearest to centre.
  ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const rows = Array.from(
      track.querySelectorAll<HTMLElement>("[data-timeline-row]")
    );
    if (!rows.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hitting = entries.filter((e) => e.isIntersecting);
        if (!hitting.length) return;

        /* nearest-to-viewport-centre wins */
        const mid = window.innerHeight / 2;
        let best = hitting[0];
        let bestDist = Infinity;
        for (const e of hitting) {
          const r = e.boundingClientRect;
          const dist = Math.abs((r.top + r.bottom) / 2 - mid);
          if (dist < bestDist) { bestDist = dist; best = e; }
        }

        const idx = rows.indexOf(best.target as HTMLElement);
        const year = indexToYear[idx];
        if (year) setActiveYear(year);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    rows.forEach((el) => io.observe(el));
    return () => io.disconnect();
  // indexToYear is derived from props – safe to stringify as dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackRef, milestones]);

  /* ── Progress fill: rAF-throttled scroll handler ─────────────── */
  const updateProgress = useCallback(() => {
    rafPending.current = false;
    const track = trackRef.current;
    if (!track) return;
    const { top, height } = track.getBoundingClientRect();
    const scrolled = Math.max(0, -top);
    const total = Math.max(1, height - window.innerHeight);
    setProgressPct(Math.min(100, (scrolled / total) * 100));
  }, [trackRef]);

  useEffect(() => {
    const onScroll = () => {
      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(updateProgress);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress(); // seed on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateProgress]);

  /* ── Rail click → smooth-scroll to first row of that year ────── */
  const scrollToYear = useCallback(
    (year: string) => {
      const track = trackRef.current;
      if (!track) return;
      const rows = Array.from(
        track.querySelectorAll<HTMLElement>("[data-timeline-row]")
      );
      const idx = milestones.findIndex((m) => normYear(m.year) === year);
      if (idx >= 0 && rows[idx]) {
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        rows[idx].scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
          block: "center",
        });
      }
    },
    [trackRef, milestones]
  );

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        /* ── Year rail custom properties ─────────────────── */
        .tyr-rail {
          --tyr-accent: var(--field-accent, #77dda4);
          --tyr-glow:   rgba(119,221,164,.55);
          --tyr-muted:  var(--muted-ink, #a8bec1);

          /* Sticky: stays centred vertically while track scrolls */
          position: sticky;
          top: calc(60px + 12svh); /* below site nav */
          width: 56px;
          flex-shrink: 0;
          align-self: flex-start;

          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0;
        }

        /* ── Continuous 2px track line ───────────────────── */
        .tyr-track {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: color-mix(in srgb, var(--tyr-accent) 16%, transparent);
          border-radius: 1px;
          overflow: hidden;
        }
        .tyr-fill {
          position: absolute;
          top: 0; left: 0; right: 0;
          background: var(--tyr-accent);
          box-shadow: 0 0 8px var(--tyr-glow);
          border-radius: 1px;
          transition: height 80ms linear;
        }

        /* ── Year list ───────────────────────────────────── */
        .tyr-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
          list-style: none;
          margin: 0;
          padding: 0 0 0 12px; /* indent past the 2px track */
        }

        /* ── Individual year button ──────────────────────── */
        .tyr-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: var(--font-code, monospace);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--tyr-muted);
          transition: color 250ms ease;
          white-space: nowrap;
        }
        .tyr-btn:focus-visible {
          outline: 2px solid var(--tyr-accent);
          outline-offset: 3px;
          border-radius: 2px;
        }

        /* Tick mark */
        .tyr-tick {
          display: block;
          width: 2px;
          height: 20px;
          background: currentColor;
          border-radius: 1px;
          flex-shrink: 0;
          transition: height 250ms ease, box-shadow 250ms ease;
        }

        /* Active state */
        .tyr-btn[aria-current="true"] {
          color: var(--tyr-accent);
        }
        .tyr-btn[aria-current="true"] .tyr-tick {
          height: 36px;
          box-shadow: 0 0 10px var(--tyr-glow);
        }

        /* ── Hide on mobile (rail would be too cramped) ──── */
        @media (max-width: 767px) {
          .tyr-rail { display: none; }
        }

        /* ── Reduced-motion: kill transitions ────────────── */
        @media (prefers-reduced-motion: reduce) {
          .tyr-btn, .tyr-tick, .tyr-fill { transition: none !important; }
        }
      `}</style>

      <nav
        className="tyr-rail"
        aria-label="Timeline year navigation"
      >
        {/* Progress fill track */}
        <div className="tyr-track" aria-hidden="true">
          <div className="tyr-fill" style={{ height: `${progressPct}%` }} />
        </div>

        <ol className="tyr-list" role="list">
          {railYears.map((year) => (
            <li key={year}>
              <button
                className="tyr-btn"
                aria-current={activeYear === year ? "true" : undefined}
                onClick={() => scrollToYear(year)}
              >
                <span className="tyr-tick" aria-hidden="true" />
                <span>{year}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
