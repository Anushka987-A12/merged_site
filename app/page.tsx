"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  IconArrowUpRight,
  IconFileText,
  IconTrophy,
} from "@tabler/icons-react";
import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { TimelineDroneArt } from "@/components/timeline-drone-art";
import { ForestMissionScene } from "@/components/forest-mission-scene";
import { RUGVED_DATA } from "@/lib/rugved-data";

const EVENTS = RUGVED_DATA.milestones;

const TIMELINE_COLORS = {
  textPrimary: "text-[var(--ink)]",
  textSecondary: "text-[var(--muted-ink)]",
  textMuted: "text-[var(--muted-ink)]",
  accentDot: "bg-[var(--field-accent)]",
  iconColor: "var(--blue-accent)",
};

type TimelineEvent = (typeof EVENTS)[number];
const LAST_MILESTONE_INDEX = EVENTS.length - 1;

function TimelineSpotlightItem({
  event,
  index,
  isCurrent,
}: {
  event: TimelineEvent;
  index: number;
  isCurrent: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const Icon = event.type === "paper" ? IconFileText : IconTrophy;
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 82%", "center 50%", "end 18%"],
  });
  const scale = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.42, 0.58, 1],
      isCurrent ? [0.98, 1.035, 1.035, 0.98] : [0.94, 0.98, 0.98, 0.94],
    ),
    { stiffness: 260, damping: 34 },
  );
  const opacity = useSpring(
    useTransform(
      scrollYProgress,
      [0, 0.36, 0.64, 1],
      isCurrent ? [0.82, 1, 1, 0.82] : [0.46, 0.68, 0.68, 0.46],
    ),
    { stiffness: 260, damping: 34 },
  );

  return (
    <motion.div
      ref={rowRef}
      data-timeline-row
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-36px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      data-side={index % 2 === 0 ? "left" : "right"}
      className="timeline-row relative my-1 flex w-full items-center md:my-2"
    >
      <div className="timeline-row__column">
        <motion.article
          style={{ scale, opacity }}
          className={
            "timeline-entry theme-rule relative isolate z-10 border-b py-5 md:py-6" +
            (isCurrent ? " is-current" : " is-inactive")
          }
        >
          <motion.div
            className="timeline-entry__aura"
            aria-hidden="true"
            animate={{
              opacity: isCurrent ? 0.9 : 0,
              scale: isCurrent ? 1.08 : 0.82,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <div className="timeline-entry__content">
            <div className="mb-3 flex items-center justify-end gap-3 font-mono text-[10px] tracking-[0.16em]">
              <span className="shrink-0 font-mono text-[11px] font-bold text-[var(--muted-ink)]">{event.year}</span>
            </div>

            <div className="flex items-start gap-2.5">
              <Icon
                size={19}
                strokeWidth={1.8}
                style={{
                  color: isCurrent
                    ? "var(--signal-accent)"
                    : TIMELINE_COLORS.iconColor,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <h3 className="timeline-entry__title font-commissioner text-[17px] font-semibold leading-snug tracking-tight text-[var(--ink)] md:text-[19px]">
                {event.title}
              </h3>
            </div>

            <p className="timeline-entry__detail ml-[28px] mt-2">
              <strong>{event.detail.split(" · ")[0]}</strong>
              {event.detail.includes(" · ") && (
                <span> · {event.detail.split(" · ").slice(1).join(" · ")}</span>
              )}
            </p>

          </div>
        </motion.article>
      </div>
    </motion.div>
  );
}

type DronePoint = { x: number; y: number };
type DroneRect = { left: number; right: number; top: number; bottom: number };
type DronePersonality = { side: -1 | 1; homeGap: number; yJitter: number };
type DroneAnchor = DronePersonality & { y: number; edgeX: number };
type DroneGap = { yTop: number; yBot: number; yCenter: number };
type DroneFlightPath = { from: DronePoint; c1: DronePoint; c2: DronePoint; to: DronePoint };
type DroneGeometry = {
  width: number;
  height: number;
  centerX: number;
  anchors: DroneAnchor[];
  cards: DroneRect[];
  gaps: DroneGap[];
  revision: number;
};

const TIMELINE_TRAIL_MAX = 36;

function TimelineDroneRoute({
  progress,
  activeIndex,
  trackRef,
  onActiveIndexChange,
}: {
  progress: MotionValue<number>;
  activeIndex: number;
  trackRef: React.RefObject<HTMLDivElement | null>;
  onActiveIndexChange: (index: number) => void;
}) {
  const droneRef = useRef<HTMLDivElement>(null);
  const trailSvgRef = useRef<SVGSVGElement>(null);
  const trailLinesRef = useRef<Array<SVGLineElement | null>>([]);
  const activeIndexRef = useRef(activeIndex);
  const lastReportedIndexRef = useRef(activeIndex);
  const [seededPersonalities] = useState<DronePersonality[]>(() => {
    const seed = Math.random() * 100000;
    const randomAt = (index: number, salt: number) => {
      const value = Math.sin(seed * 12.9898 + index * 78.233 + salt * 37.719) * 43758.5453;
      return value - Math.floor(value);
    };
    return EVENTS.map((_, index) => ({
      side: (index % 2 === 0 ? 1 : -1) as -1 | 1,
      homeGap: 56 + randomAt(index, 100) * 48,
      yJitter: (randomAt(index, 200) * 2 - 1) * 40,
    }));
  });
  const personalitiesRef = useRef(seededPersonalities);
  const geometryRef = useRef<DroneGeometry>({
    width: 0,
    height: 0,
    centerX: 0,
    anchors: [],
    cards: [],
    gaps: [],
    revision: 0,
  });

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measureFlightArea = () => {
      const trackBounds = track.getBoundingClientRect();
      const width = track.clientWidth || trackBounds.width;
      const height = Math.max(track.offsetHeight, track.scrollHeight);
      const columnWidth = Math.max(0, Math.min(520, width / 2 - 64));
      const centerX = width / 2;
      const entries = Array.from(
        track.querySelectorAll<HTMLElement>(".timeline-entry"),
      );
      const rawCards = entries.map((entry) => {
        const bounds = entry.getBoundingClientRect();
        return {
          left: bounds.left - trackBounds.left,
          right: bounds.right - trackBounds.left,
          top: bounds.top - trackBounds.top,
          bottom: bounds.bottom - trackBounds.top,
        };
      });
      const cards = rawCards.map((rect) => ({
        left: rect.left - 16,
        right: rect.right + 16,
        top: rect.top - 16,
        bottom: rect.bottom + 16,
      }));
      const gaps = cards.slice(0, -1).flatMap((card, index) => {
        const yTop = card.bottom + 8;
        const yBot = cards[index + 1].top - 8;
        if (yBot < yTop) return [];
        return [{ yTop, yBot, yCenter: (yTop + yBot) / 2 }];
      });

      geometryRef.current = {
        width,
        height,
        centerX,
        anchors: EVENTS.map((_, index) => {
          const raw = rawCards[index];
          const padded = cards[index];
          const personality = personalitiesRef.current[index] ?? {
            side: 1 as const,
            homeGap: 80,
            yJitter: 0,
          };
          const side = raw ? ((raw.left + raw.right) / 2 < centerX ? 1 : -1) : personality.side;
          return {
            ...personality,
            side: side as -1 | 1,
            y: raw
              ? (raw.top + raw.bottom) / 2
              : (height * (index + 0.5)) / EVENTS.length,
            edgeX: padded
              ? side < 0 ? padded.left : padded.right
              : side < 0 ? centerX - columnWidth / 2 : centerX + columnWidth / 2,
          };
        }),
        cards,
        gaps,
        revision: geometryRef.current.revision + 1,
      };
      trailSvgRef.current?.setAttribute("viewBox", `0 0 ${width} ${height}`);
    };

    measureFlightArea();
    const observer = new ResizeObserver(measureFlightArea);
    observer.observe(track);
    track.querySelectorAll("[data-timeline-row], .timeline-entry").forEach((node) => {
      observer.observe(node);
    });
    window.addEventListener("resize", measureFlightArea, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureFlightArea);
    };
  }, [trackRef]);

  useEffect(() => {
    const updateActiveMilestone = (value: number) => {
      const amount = Math.min(1, Math.max(0, value));
      let index = 0;
      for (let milestone = 1; milestone < EVENTS.length; milestone += 1) {
        if (amount >= milestone / LAST_MILESTONE_INDEX) index = milestone;
        else break;
      }
      activeIndexRef.current = index;
      if (index !== lastReportedIndexRef.current) {
        lastReportedIndexRef.current = index;
        onActiveIndexChange(index);
      }
    };

    updateActiveMilestone(progress.get());
    return progress.on("change", updateActiveMilestone);
  }, [onActiveIndexChange, progress]);

  useEffect(() => {
    const drone = droneRef.current;
    if (!drone || !trailSvgRef.current) return;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));
    const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = {
      mode: "WANDER" as "WANDER" | "TRANSIT",
      activeIdx: 0,
      lastIdx: -1,
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      home: { x: 0, y: 0 },
      wanderTarget: null as DronePoint | null,
      nextPickAt: 0,
      transitPath: null as DroneFlightPath | null,
      transitT: 0,
      transitDuration: 1,
      geometryRevision: 0,
      initialized: false,
      trail: [] as DronePoint[],
    };
    let frameId = 0;
    let previousFrame = 0;
    let previousPosition = { x: 0, y: 0 };

    const pointInside = (point: DronePoint, rect: DroneRect) =>
      point.x > rect.left && point.x < rect.right &&
      point.y > rect.top && point.y < rect.bottom;

    const safePosition = (candidate: DronePoint, geometry: DroneGeometry) => {
      let point = {
        x: clamp(candidate.x, 16, geometry.width - 16),
        y: clamp(candidate.y, 8, geometry.height - 8),
      };
      for (let pass = 0; pass <= geometry.cards.length; pass += 1) {
        const card = geometry.cards.find((rect) => pointInside(point, rect));
        if (!card) break;
        const candidates = [
          { x: card.left - 1, y: point.y },
          { x: card.right + 1, y: point.y },
          { x: point.x, y: card.top - 1 },
          { x: point.x, y: card.bottom + 1 },
        ].map((next) => ({
          x: clamp(next.x, 16, geometry.width - 16),
          y: clamp(next.y, 8, geometry.height - 8),
        }));
        candidates.sort(
          (a, b) => Math.hypot(a.x - point.x, a.y - point.y) - Math.hypot(b.x - point.x, b.y - point.y),
        );
        point = candidates[0];
      }
      return point;
    };

    const homePoint = (anchor: DroneAnchor, geometry: DroneGeometry) =>
      safePosition(
        {
          x: anchor.edgeX + anchor.side * anchor.homeGap,
          y: anchor.y + anchor.yJitter,
        },
        geometry,
      );

    const cubicPoint = (path: DroneFlightPath, u: number): DronePoint => {
      const inverse = 1 - u;
      return {
        x: inverse ** 3 * path.from.x + 3 * inverse ** 2 * u * path.c1.x + 3 * inverse * u ** 2 * path.c2.x + u ** 3 * path.to.x,
        y: inverse ** 3 * path.from.y + 3 * inverse ** 2 * u * path.c1.y + 3 * inverse * u ** 2 * path.c2.y + u ** 3 * path.to.y,
      };
    };

    const makeFlightPath = (
      from: DronePoint,
      to: DronePoint,
      geometry: DroneGeometry,
    ): DroneFlightPath => {
      const dy = to.y - from.y;
      const crossesColumn = (from.x - geometry.centerX) * (to.x - geometry.centerX) < 0;
      let c1: DronePoint;
      let c2: DronePoint;
      if (crossesColumn) {
        const midpointY = from.y + dy * 0.5;
        const corridor = geometry.gaps.reduce<DroneGap | null>(
          (nearest, gap) => !nearest || Math.abs(gap.yCenter - midpointY) < Math.abs(nearest.yCenter - midpointY) ? gap : nearest,
          null,
        );
        const corridorY = corridor?.yCenter ?? clamp(midpointY, 16, geometry.height - 16);
        const corridorTop = corridor?.yTop ?? 16;
        const corridorBottom = corridor?.yBot ?? geometry.height - 16;
        c1 = {
          x: from.x + (to.x - from.x) * 0.25,
          y: clamp(corridorY - dy * 0.15, corridorTop, corridorBottom),
        };
        c2 = {
          x: from.x + (to.x - from.x) * 0.75,
          y: clamp(corridorY + dy * 0.15, corridorTop, corridorBottom),
        };
      } else {
        const outward = Math.sign(to.x - geometry.centerX) || 1;
        const bow = outward * randomBetween(60, 150);
        c1 = {
          x: clamp(from.x + bow, 16, geometry.width - 16),
          y: from.y + dy * 0.33,
        };
        c2 = {
          x: clamp(to.x + bow, 16, geometry.width - 16),
          y: from.y + dy * 0.66,
        };
      }
      return { from, c1, c2, to };
    };

    const startTransit = (destination: DronePoint, geometry: DroneGeometry) => {
      const path = makeFlightPath(state.pos, destination, geometry);
      const pathLength =
        Math.hypot(path.c1.x - path.from.x, path.c1.y - path.from.y) +
        Math.hypot(path.c2.x - path.c1.x, path.c2.y - path.c1.y) +
        Math.hypot(path.to.x - path.c2.x, path.to.y - path.c2.y);
      state.transitPath = path;
      state.transitT = 0;
      state.transitDuration = clamp(pathLength / 900, 0.7, 1.6);
      state.mode = "TRANSIT";
      state.wanderTarget = null;
    };

    const nearestCardEdge = (
      home: DronePoint,
      card: DroneRect,
      geometry: DroneGeometry,
    ) => {
      const options = [
        { x: card.left - 24, y: clamp(home.y, card.top, card.bottom) },
        { x: card.right + 24, y: clamp(home.y, card.top, card.bottom) },
        { x: clamp(home.x, card.left, card.right), y: card.top - 24 },
        { x: clamp(home.x, card.left, card.right), y: card.bottom + 24 },
      ].map((point) => safePosition(point, geometry));
      options.sort(
        (a, b) => Math.hypot(a.x - home.x, a.y - home.y) - Math.hypot(b.x - home.x, b.y - home.y),
      );
      return options[0];
    };

    const renderTrail = (speed: number, reduced: boolean, hover: number) => {
      const lines = trailLinesRef.current;
      if (reduced) state.trail.length = 0;
      else {
        state.trail.push({ x: state.pos.x, y: state.pos.y + hover });
        if (state.trail.length > TIMELINE_TRAIL_MAX) state.trail.shift();
      }
      const glow = clamp(speed / 500, 0.35, 1);
      const segmentCount = Math.max(0, state.trail.length - 1);
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        if (!line) continue;
        if (index >= segmentCount) {
          line.setAttribute("opacity", "0");
          continue;
        }
        const first = state.trail[index];
        const second = state.trail[index + 1];
        const age = (index + 1) / segmentCount;
        line.setAttribute("x1", `${first.x}`);
        line.setAttribute("y1", `${first.y}`);
        line.setAttribute("x2", `${second.x}`);
        line.setAttribute("y2", `${second.y}`);
        line.setAttribute("opacity", `${age ** 2 * 0.45 * glow}`);
        line.setAttribute("stroke-width", `${0.5 + age * 2}`);
      }
    };

    const animate = (now: number) => {
      const geometry = geometryRef.current;
      if (geometry.width < 1 || geometry.height < 1 || geometry.anchors.length === 0) {
        frameId = requestAnimationFrame(animate);
        return;
      }
      const delta = previousFrame === 0 ? 1 / 60 : Math.min((now - previousFrame) / 1000, 0.05);
      const time = now / 1000;
      previousFrame = now;
      const reduced = reducedMotion.matches;
      const idx = clamp(activeIndexRef.current, 0, geometry.anchors.length - 1);

      if (!state.initialized) {
        state.activeIdx = idx;
        state.lastIdx = idx;
        state.home = homePoint(geometry.anchors[idx], geometry);
        state.pos = { ...state.home };
        state.geometryRevision = geometry.revision;
        state.initialized = true;
        state.nextPickAt = time + 0.45;
        state.wanderTarget = { ...state.home };
        previousPosition = { ...state.pos };
      } else if (geometry.revision !== state.geometryRevision) {
        state.geometryRevision = geometry.revision;
        state.pos = safePosition(state.pos, geometry);
        state.vel = { x: 0, y: 0 };
        state.home = homePoint(geometry.anchors[state.activeIdx], geometry);
        if (state.mode === "TRANSIT" && !reduced) startTransit(state.home, geometry);
        else {
          state.mode = "WANDER";
          state.transitPath = null;
          state.wanderTarget = null;
          state.nextPickAt = time;
        }
      }

      if (state.initialized && idx !== state.lastIdx) {
        const personality: DronePersonality = {
          side: geometry.anchors[idx]?.side ?? (idx % 2 === 0 ? 1 : -1),
          homeGap: randomBetween(56, 104),
          yJitter: randomBetween(-40, 40),
        };
        personalitiesRef.current[idx] = personality;
        geometry.anchors[idx] = { ...geometry.anchors[idx], ...personality };
        state.activeIdx = idx;
        state.lastIdx = idx;
        state.home = homePoint(geometry.anchors[idx], geometry);
        state.vel = { x: 0, y: 0 };
        if (reduced) {
          state.pos = { ...state.home };
          state.mode = "WANDER";
          state.transitPath = null;
        } else {
          startTransit(state.home, geometry);
        }
      }

      let target: DronePoint = state.home;
      if (state.mode === "TRANSIT" && state.transitPath) {
        state.transitT += delta / state.transitDuration;
        const raw = clamp(state.transitT, 0, 1);
        const eased = raw < 0.5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2;
        const flightPoint = cubicPoint(state.transitPath, eased);
        const life = Math.sin(Math.PI * eased);
        target = {
          x: flightPoint.x + Math.sin(time * 2.1 + idx) * 6 * life,
          y: flightPoint.y + Math.sin(time * 1.7 + idx * 0.7) * 4 * life,
        };
        if (state.transitT >= 1) {
          state.mode = "WANDER";
          state.transitPath = null;
          state.wanderTarget = state.home;
          state.nextPickAt = time + 0.45;
        }
      } else {
        if (reduced) {
          state.wanderTarget = state.home;
        } else if (!state.wanderTarget || time >= state.nextPickAt) {
          const home = state.home;
          let pick: DronePoint = {
            x: home.x + randomBetween(-140, 140),
            y: home.y + randomBetween(-70, 70),
          };
          if (Math.random() < 0.15 && geometry.cards[idx]) {
            pick = nearestCardEdge(home, geometry.cards[idx], geometry);
          }
          if (geometry.cards[idx] && pointInside(pick, geometry.cards[idx])) {
            pick.x = home.x - (pick.x - home.x);
          }
          state.wanderTarget = safePosition(pick, geometry);
          state.nextPickAt = time + randomBetween(0.8, 2);
        }
        target = state.wanderTarget ?? state.home;
      }

      if (reduced) {
        state.pos = { ...state.home };
        state.vel = { x: 0, y: 0 };
      } else {
        state.vel.x += (target.x - state.pos.x) * 26 * delta;
        state.vel.y += (target.y - state.pos.y) * 26 * delta;
        const damping = Math.exp(-6 * delta);
        state.vel.x *= damping;
        state.vel.y *= damping;
        state.pos.x += state.vel.x * delta;
        state.pos.y += state.vel.y * delta;
      }
      state.pos = safePosition(state.pos, geometry);

      const vx = (state.pos.x - previousPosition.x) / delta;
      const vy = (state.pos.y - previousPosition.y) / delta;
      previousPosition = { ...state.pos };
      const speed = Math.hypot(state.vel.x, state.vel.y);
      const bank = reduced
        ? 0
        : clamp(
            ((Math.atan2(vy, Math.abs(vx) + 0.001) * 180) / Math.PI) * 0.5 * Math.sign(vx || 1),
            -20,
            20,
          );
      const hover = reduced ? 0 : Math.sin(time * 9) * 1.5;
      drone.style.transform = `translate3d(${state.pos.x}px, ${state.pos.y + hover}px, 0) translate(-50%, -50%) rotate(${bank}deg)`;
      drone.style.setProperty("--rotor-duration", `${Math.max(0.22, 1.4 - speed * 0.0004)}s`);
      drone.style.setProperty("--flight-blur", `${Math.min(0.65, speed * 0.00035)}px`);
      renderTrail(speed, reduced, hover);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [progress]);

  return (
    <div className="timeline-drone-layer" aria-hidden="true">
      <svg ref={trailSvgRef} className="timeline-drone-trail" preserveAspectRatio="none">
        <g>
          {Array.from({ length: TIMELINE_TRAIL_MAX - 1 }, (_, index) => (
            <line
              key={index}
              ref={(line) => {
                trailLinesRef.current[index] = line;
              }}
              x1="0"
              y1="0"
              x2="0"
              y2="0"
              opacity="0"
            />
          ))}
        </g>
      </svg>
      <div
        className="timeline-drone"
        ref={droneRef}
        style={{ transform: "translate3d(90px, 90px, 0) translate(-50%, -50%)" }}
      >
        <TimelineDroneArt />
      </div>
    </div>
  );
}

export default function Home() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 86%", "end 82%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 105,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <main className="home-page mx-auto max-w-[1440px] space-y-24 px-5 pb-12 md:space-y-32 md:px-8">
      <section
        className="home-hero relative isolate left-1/2 -translate-x-1/2 overflow-hidden"
        aria-labelledby="home-title"
      >
        <ForestMissionScene />
        <div className="home-hero__shade" aria-hidden="true" />

        <div className="home-hero__content">
          <h1 id="home-title" className="home-hero__title">
            Manipal&apos;s only defence robotics club
          </h1>
        </div>
      </section>

      <motion.section
        id="about"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="home-about space-y-7"
      >
        <motion.div
          className="home-about__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <h2 className="max-w-[15ch] font-commissioner text-4xl font-bold leading-tight tracking-tight text-[var(--ink)] md:text-6xl">
              Engineering for the unstructured world.
            </h2>
          </motion.div>
          <motion.div
            className="home-about__copy"
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p>
              Based at MIT Manipal, RUGVED builds autonomous ground and aerial
              robotics for surveillance, reconnaissance and defence. Students
              across engineering, research and operations develop the systems
              together.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        id="timeline"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65 }}
        className="home-timeline space-y-7"
      >
        <div className="home-timeline__frame">
          <header className="home-timeline__header">
            <div>
              <h2 className="font-commissioner text-3xl font-bold tracking-tight text-[var(--ink)] md:text-4xl">
                Our milestones.
              </h2>
            </div>
          </header>
          <div className="timeline-layout">
            <div className="home-timeline__track" ref={trackRef}>
              <TimelineDroneRoute
                progress={smoothProgress}
                activeIndex={activeTimelineIndex}
                trackRef={trackRef}
                onActiveIndexChange={setActiveTimelineIndex}
              />
              <div className="relative z-10 flex flex-col gap-8 md:gap-10">
                {EVENTS.map((event, index) => (
                  <TimelineSpotlightItem
                    key={event.id}
                    event={event}
                    index={index}
                    isCurrent={index === activeTimelineIndex}
                  />
                ))}
              </div>
            </div>
          </div>
          <footer className="home-timeline__source">
            <span className="flex flex-wrap items-center gap-4">
              <a href="https://rugved.co.in/" target="_blank" rel="noreferrer">
                RUGVED
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.manipal.edu/content/dam/manipal/mu/mit/images/ad_sw/Ingenuity2022.pdf"
                target="_blank"
                rel="noreferrer"
              >
                MAHE
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </span>
          </footer>
        </div>
      </motion.section>

      <motion.section
        id="sponsors"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="pb-8"
      >
        <div className="flex flex-col gap-4 border-y border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] py-7 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-commissioner text-2xl font-bold tracking-tight text-[var(--ink)] md:text-3xl">
            Support student-led robotics.
          </h2>
          <a href="https://rugved.co.in/#contact" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.16em] text-[var(--field-accent)]">
            BECOME A SPONSOR <IconArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </motion.section>
    </main>
  );
}
