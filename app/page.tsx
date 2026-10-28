"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconArrowDown,
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
import { TimelineYearRail } from "@/components/timeline-year-rail";
import { RUGVED_DATA } from "@/lib/rugved-data";

const EVENTS = RUGVED_DATA.milestones;

const TIMELINE_COLORS = {
  textPrimary: "text-[var(--ink)]",
  textSecondary: "text-[var(--muted-ink)]",
  textMuted: "text-[var(--muted-ink)]",
  accentDot: "bg-[var(--field-accent)]",
  iconColor: "var(--blue-accent)",
};

const SPONSORS = [
  { name: "Altium Designer", src: "/sponsors/altium.png", w: 182, h: 96 },
  { name: "OnlyScrews", src: "/sponsors/onlyscrews.png", w: 746, h: 137 },
  { name: "OpenMV", src: "/sponsors/openmv.png", w: 1076, h: 288 },
  { name: "RapidHarness", src: "/sponsors/rapidharness.png", w: 496, h: 96 },
  { name: "Batemo", src: "/sponsors/batemo.png", w: 413, h: 96 },
  { name: "Protocase", src: "/sponsors/protocase.png", w: 178, h: 96 },
  { name: "Ansys", src: "/sponsors/ansys.png", w: 299, h: 96 },
];

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
      isCurrent ? [0.9, 1, 1, 0.9] : [0.7, 0.82, 0.82, 0.7],
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
              <span className="shrink-0 font-mono text-[11px] font-bold text-[var(--muted-ink)]">
                {event.year}
              </span>
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
type DroneAnchor = DronePersonality & { y: number };
type DroneGap = { yTop: number; yBot: number; yCenter: number };
type DroneGeometry = {
  width: number;
  height: number;
  centerX: number;
  columnLeft: number;
  columnRight: number;
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
      const value =
        Math.sin(seed * 12.9898 + index * 78.233 + salt * 37.719) * 43758.5453;
      return value - Math.floor(value);
    };
    return EVENTS.map((_, index) => ({
      side: (randomAt(index, 0) < 0.5 ? -1 : 1) as -1 | 1,
      homeGap: 56 + randomAt(index, 100) * 48,
      yJitter: (randomAt(index, 200) * 2 - 1) * 40,
    }));
  });
  const personalitiesRef = useRef(seededPersonalities);
  const geometryRef = useRef<DroneGeometry>({
    width: 0,
    height: 0,
    centerX: 0,
    columnLeft: 0,
    columnRight: 0,
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
      // Match merged layout: single-column cards, max width constrained
      const columnWidth = Math.min(680, window.innerWidth * 0.92, width);
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

      // Cap homeGap so drone always stays within track bounds
      const maxGap = Math.max(16, (width - columnWidth) / 2 - 20);
      geometryRef.current = {
        width,
        height,
        centerX,
        columnLeft: centerX - columnWidth / 2,
        columnRight: centerX + columnWidth / 2,
        anchors: EVENTS.map((_, index) => {
          const p = personalitiesRef.current[index] ?? {
            side: 1 as const,
            homeGap: 80,
            yJitter: 0,
          };
          return {
            y: rawCards[index]
              ? (rawCards[index].top + rawCards[index].bottom) / 2
              : (height * (index + 0.5)) / EVENTS.length,
            ...p,
            homeGap: Math.min(p.homeGap, maxGap),
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
    track
      .querySelectorAll("[data-timeline-row], .timeline-entry")
      .forEach((node) => {
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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const state = {
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      prevPos: { x: 0, y: 0 },
      initialized: false,
      trail: [] as DronePoint[],
    };
    let isVisible = false;
    let frameId = 0;
    let previousFrame = 0;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting;
        if (nextVisible && !isVisible) {
          isVisible = true;
          previousFrame = 0;
          cancelAnimationFrame(frameId);
          frameId = requestAnimationFrame(animate);
        } else if (!nextVisible) {
          isVisible = false;
          cancelAnimationFrame(frameId);
        }
      },
      { rootMargin: "400px 0px" },
    );

    const track = trackRef.current;
    if (track) intersectionObserver.observe(track);

    const renderTrail = (speed: number, reduced: boolean, hover: number) => {
      const lines = trailLinesRef.current;
      if (reduced) state.trail.length = 0;
      else {
        state.trail.push({ x: state.pos.x, y: state.pos.y + hover });
        if (state.trail.length > TIMELINE_TRAIL_MAX) state.trail.shift();
      }
      const glow = clamp(speed / 400, 0.3, 1);
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
        line.setAttribute("opacity", `${age ** 2 * 0.5 * glow}`);
        line.setAttribute("stroke-width", `${0.5 + age * 2}`);
      }
    };

    const animate = (now: number) => {
      if (!isVisible) return;
      const geometry = geometryRef.current;
      if (
        geometry.width < 1 ||
        geometry.height < 1 ||
        geometry.anchors.length === 0
      ) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      const delta =
        previousFrame === 0
          ? 1 / 60
          : Math.min((now - previousFrame) / 1000, 0.05);
      const time = now / 1000;
      previousFrame = now;
      const reduced = reducedMotion.matches;

      // -- Scroll-linked target position --
      // scrollT goes 0→1 as user scrolls through the timeline section
      const scrollT = clamp(progress.get(), 0, 1);

      // Interpolate Y continuously between anchor positions
      const floatIndex = scrollT * LAST_MILESTONE_INDEX;
      const loIdx = Math.floor(floatIndex);
      const hiIdx = Math.min(loIdx + 1, LAST_MILESTONE_INDEX);
      const frac = floatIndex - loIdx;
      const anchorLo = geometry.anchors[loIdx];
      const anchorHi = geometry.anchors[hiIdx];
      const targetY =
        anchorLo && anchorHi
          ? anchorLo.y * (1 - frac) + anchorHi.y * frac
          : geometry.height * scrollT;

      // X: alternate side each milestone — left of column on even, right on odd
      // Use a gentle sine to add wandering horizontal movement within each side
      const isRightSide = Math.floor(floatIndex + 0.5) % 2 === 1;
      const GAP = Math.min(72, geometry.width * 0.08); // gap outside column edge
      const wander = Math.sin(time * 0.9) * Math.min(28, geometry.width * 0.03);
      const targetX = isRightSide
        ? clamp(
            geometry.columnRight + GAP + wander,
            geometry.columnRight + 16,
            geometry.width - 16,
          )
        : clamp(
            geometry.columnLeft - GAP + wander,
            16,
            geometry.columnLeft - 16,
          );

      // Smooth spring toward target
      const SPRING = 10;
      const DAMP = 0.82;
      state.vel.x =
        state.vel.x * DAMP + (targetX - state.pos.x) * SPRING * delta;
      state.vel.y =
        state.vel.y * DAMP + (targetY - state.pos.y) * SPRING * delta;
      state.pos.x += state.vel.x * delta;
      state.pos.y += state.vel.y * delta;

      // Keep safely within track bounds
      state.pos.x = clamp(state.pos.x, 16, geometry.width - 16);
      state.pos.y = clamp(state.pos.y, 8, geometry.height - 8);

      const vx = (state.pos.x - state.prevPos.x) / delta;
      const vy = (state.pos.y - state.prevPos.y) / delta;
      state.prevPos = { ...state.pos };
      const speed = Math.hypot(vx, vy);

      const bank = reduced
        ? 0
        : clamp(
            ((Math.atan2(vy, Math.abs(vx) + 0.001) * 180) / Math.PI) *
              0.5 *
              Math.sign(vx || 1),
            -22,
            22,
          );
      const hover = reduced ? 0 : Math.sin(time * 9) * 1.5;

      drone.style.transform = `translate3d(${state.pos.x}px, ${state.pos.y + hover}px, 0) translate(-50%, -50%) rotate(${bank}deg)`;
      drone.style.setProperty(
        "--rotor-duration",
        `${Math.max(0.22, 1.4 - speed * 0.0005)}s`,
      );
      drone.style.setProperty(
        "--flight-blur",
        `${Math.min(0.6, speed * 0.0003)}px`,
      );
      renderTrail(speed, reduced, hover);
      frameId = requestAnimationFrame(animate);
    };

    return () => {
      intersectionObserver.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [progress, trackRef]);

  return (
    <div className="timeline-drone-layer" aria-hidden="true">
      <svg
        ref={trailSvgRef}
        className="timeline-drone-trail"
        preserveAspectRatio="none"
      >
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
        style={{
          transform: "translate3d(90px, 90px, 0) translate(-50%, -50%)",
        }}
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
          <p className="home-hero__eyebrow">
            <span className="home-hero__status" aria-hidden="true" />
            MIT Manipal · Est. 2016
          </p>
          <h1 id="home-title" className="home-hero__title">
            Manipal&apos;s only{" "}
            <span className="home-hero__title-accent">defence robotics</span>{" "}
            club.
          </h1>
          <p className="home-hero__description">
            Student engineers building autonomous ground and aerial systems for
            surveillance, reconnaissance and the field.
          </p>
          <div className="home-hero__actions">
            <Link href="/projects" className="home-hero__button">
              Explore platforms <IconArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/team" className="home-hero__text-link">
              Meet the team
            </Link>
          </div>
          <ul className="home-hero__meta" aria-label="Core capabilities">
            <li>WALRUS UGV</li>
            <li>UAV SWARM</li>
            <li>AI AUTONOMY</li>
          </ul>
          <a href="#about" className="home-hero__scroll">
            <span>Scroll to explore</span>
            <IconArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <motion.section
        id="about"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="home-about"
        aria-labelledby="about-title"
      >
        <motion.div
          className="home-about__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14 } },
          }}
        >
          <motion.figure
            className="home-about__media"
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="home-about__frame">
              <Image
                src="/pictures/team-2026-27.jpg"
                alt="The RUGVED team assembled in the lecture hall at MIT Manipal"
                fill
                sizes="(min-width: 1100px) 52vw, 94vw"
                className="home-about__photo"
              />
              <span className="home-about__scan" aria-hidden="true" />
              <span className="home-about__frame-code" aria-hidden="true">
                IMG-04 / Manipal
              </span>
              <figcaption className="home-about__tag">
                <span>Team</span> 26–27
              </figcaption>
            </div>
          </motion.figure>

          <motion.div
            className="home-about__copy"
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="home-about__eyebrow">
              <span>01</span>
              Who we are
            </p>
            <h2 id="about-title" className="home-about__title">
              Engineering the future of defence.
            </h2>
            <br></br>
            <span className="home-about__rule" aria-hidden="true" />
            <p className="home-about__lede">
              R.U.G.V.E.D. is a student-led robotics and engineering team
              focused on the development of autonomous ground vehicles and
              defense-oriented technologies. Based in an academic environment,
              we combine classroom learning with hands-on design, prototyping,
              and testing. Our team works across mechanical design, electronics,
              control systems, and software to build reliable autonomous
              platforms. Through research-driven development and practical
              experimentation, we aim to prepare students for real-world
              challenges in robotics, autonomous systems, and related
              engineering fields.
            </p>
            <div className="home-about__pillars">
              <div className="home-about__pillar">
                <h3>Innovation</h3>
                <p>Custom-built flight controllers and UGV drivetrains.</p>
              </div>
              <div className="home-about__pillar">
                <h3>Intelligence</h3>
                <p>Autonomous CV-based target acquisition systems.</p>
              </div>
            </div>
            <ul className="home-about__stats">
              <li>
                <strong>2016</strong>
                <span>Founded at MIT Manipal</span>
              </li>
              <li>
                <strong>14</strong>
                <span>Competition milestones</span>
              </li>
              <li>
                <strong>2</strong>
                <span>Field platforms in development</span>
              </li>
            </ul>
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
              <p className="mt-3 max-w-[52ch] text-sm leading-7 text-[var(--muted-ink)]">
                From makerthon wins to a national defence expo showcase — a
                decade of student-built robotics.
              </p>
            </div>
            <Link
              href="/accomplishments"
              className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] font-bold tracking-[0.16em] text-[var(--field-accent)]"
            >
              FULL RECORD <IconArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </header>
          <div className="timeline-layout">
            {/* flex row: sticky year-rail on the left, existing track on the right */}
            <div className="flex items-start gap-4">
              <TimelineYearRail
                milestones={RUGVED_DATA.milestones}
                trackRef={trackRef}
              />
              <div
                className="home-timeline__track min-w-0 flex-1"
                ref={trackRef}
              >
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
          </div>
          <footer className="home-timeline__source">
            <span className="flex flex-wrap items-center gap-4">
              <a
                href="https://rugved.co.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                RUGVED
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.manipal.edu/content/dam/manipal/mu/mit/images/ad_sw/Ingenuity2022.pdf"
                target="_blank"
                rel="noopener noreferrer"
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
        className="home-sponsors pb-8"
        aria-labelledby="sponsors-title"
      >
        <div className="home-sponsors__head">
          <div>
            <p className="home-sponsors__eyebrow">Partners</p>
            <h2 id="sponsors-title" className="home-sponsors__title">
              Support student-led robotics.
            </h2>
            <p className="home-sponsors__copy">
              Partner with the team on components, field testing and competition
              travel.
            </p>
          </div>
          <Link href="/contact" className="home-sponsors__cta">
            BECOME A SPONSOR <IconArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <ul className="home-sponsors__grid" aria-label="Sponsors and partners">
          {SPONSORS.map((sponsor) => (
            <li className="home-sponsors__tile" key={sponsor.name}>
              <Image
                src={sponsor.src}
                alt={`${sponsor.name} logo`}
                width={sponsor.w}
                height={sponsor.h}
                sizes="(min-width: 1024px) 240px, 45vw"
                className="home-sponsors__mark"
              />
            </li>
          ))}
        </ul>
      </motion.section>
    </main>
  );
}
