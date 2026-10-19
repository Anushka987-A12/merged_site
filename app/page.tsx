"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconArrowUpRight,
  IconFileText,
  IconMinus,
  IconTrophy,
} from "@tabler/icons-react";
import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { TimelineDroneArt } from "@/components/timeline-drone-art";
import { ForestMissionScene } from "@/components/forest-mission-scene";

const EVENTS = [
  {
    id: 1,
    year: "2017",
    type: "achievement",
    badge: "UAV CHALLENGE",
    title: "Tata Pioneer’s Makerthon",
    detail: "National-level winner · Techfest, IIT Bombay",
    tag: "FIRST COMPETITION",
  },
  {
    id: 2,
    year: "2018",
    type: "achievement",
    badge: "IGVC",
    title: "Design Challenge",
    detail: "8th worldwide · Intelligent Ground Vehicle Competition",
    tag: "INTERNATIONAL",
  },
  {
    id: 3,
    year: "2020",
    type: "achievement",
    badge: "COVIDEATE",
    title: "Covideate",
    detail: "First place · IIT Bombay Techfest",
    tag: "TECHFEST",
  },
  {
    id: 4,
    year: "2020",
    type: "achievement",
    badge: "E-YANTRA",
    title: "e-Yantra Robotics Competition",
    detail: "Finalist · e-Yantra Robotics Competition (EYRC)",
    tag: "ROBOTICS",
  },
  {
    id: 5,
    year: "2020",
    type: "achievement",
    badge: "FORD GME",
    title: "Ford GME Hackathon",
    detail: "Second place",
    tag: "HACKATHON",
  },
  {
    id: 6,
    year: "2020",
    type: "achievement",
    badge: "DEF HACKS",
    title: "Def Hacks Global 2.0",
    detail: "First place · Major League Hacking",
    tag: "GLOBAL",
  },
  {
    id: 7,
    year: "2021",
    type: "achievement",
    badge: "PRAGYAAN",
    title: "Pragyaan Fusion Hackathon",
    detail: "First place · Mechanical and Electrical divisions · NIT Trichy",
    tag: "NIT TRICHY",
  },
  {
    id: 8,
    year: "2023",
    type: "achievement",
    badge: "GUIDING GAZE",
    title: "OpenCV AI Competition",
    detail: "International Rank 7 · Only Indian undergraduate team",
    tag: "COMPUTER VISION",
  },
  {
    id: 9,
    year: "2023–24",
    type: "achievement",
    badge: "E-YANTRA",
    title: "IIT Bombay Robotics Competition",
    detail: "All India Rank 10",
    tag: "ROBOTICS",
  },
  {
    id: 10,
    year: "2024",
    type: "achievement",
    badge: "SMART INDIA HACKATHON",
    title: "National finalist",
    detail: "Top 5 · Defence theme",
    tag: "AI TERRAIN NAVIGATION",
  },
  {
    id: 11,
    year: "2025",
    type: "achievement",
    badge: "AYUSH HABBA",
    title: "Ayush Habba Hackathon",
    detail: "First place · ₹25,000 prize · Mangalore",
    tag: "HACKATHON",
  },
  {
    id: 12,
    year: "2025",
    type: "achievement",
    badge: "E-YANTRA",
    title: "e-Yantra Stage 2",
    detail: "Among the top 20 teams in India to reach Stage 2",
    tag: "ROBOTICS",
  },
  {
    id: 13,
    year: "2025",
    type: "achievement",
    badge: "WALRUS 2.0",
    title: "National Defence Expo",
    detail: "Prototype feature and platform showcase",
    tag: "FIELD ROBOTICS",
  },
  {
    id: 14,
    year: "2026",
    type: "achievement",
    badge: "TECHSOLSTICE",
    title: "TechSolstice competitions",
    detail: "Top 7 and Top 15 finishes · MITB competitions",
    tag: "COMPETITION RESULTS",
  },
];

const SPECIALTIES = [
  "Electronics",
  "Mechanical engineering",
  "Artificial intelligence",
  "Research",
  "Management",
];

const TIMELINE_COLORS = {
  textPrimary: "text-[var(--ink)]",
  textSecondary: "text-[var(--muted-ink)]",
  textMuted: "text-[var(--muted-ink)]",
  accentDot: "bg-[var(--field-accent)]",
  iconColor: "var(--blue-accent)",
};

type TimelineEvent = (typeof EVENTS)[number];

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="section-label">
      <span className="section-label__index">
        <IconMinus className="h-3 w-3" />
        {index}
      </span>
      <span className="theme-rule hidden h-px w-12 sm:block" />
      <span className="section-label__text">{label}</span>
    </div>
  );
}

function DynamicPercent({ value }: { value: MotionValue<number> }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => value.on("change", (next) => setPercent(next)), [value]);

  return <>{percent}</>;
}

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
  const isEven = index % 2 === 0;
  const Icon = event.type === "paper" ? IconFileText : IconTrophy;
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 82%", "center 50%", "end 18%"],
  });
  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.42, 0.58, 1], [0.92, 1, 1, 0.92]),
    { stiffness: 260, damping: 34 },
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.36, 0.64, 1], [0.48, 1, 1, 0.48]),
    { stiffness: 260, damping: 34 },
  );

  return (
    <div
      ref={rowRef}
      data-timeline-row
      className={
        "timeline-row relative isolate my-3 flex w-full items-center md:my-5 " +
        (isEven
          ? "timeline-row--right lg:flex-row-reverse"
          : "timeline-row--left lg:flex-row") +
        " flex-col" +
        (isCurrent ? " is-current" : "")
      }
    >
      <div
        className={
          "w-full pl-24 lg:w-[calc(50%-84px)] lg:pl-0 " +
          (isEven ? "lg:pr-10" : "lg:pl-10")
        }
      >
        <motion.article
          style={{ scale, opacity }}
          className={
            "timeline-entry theme-rule relative z-10 border-b py-5 md:py-6" +
            (isCurrent ? " is-current" : "")
          }
        >
          <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.16em]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--signal-accent)]">
                {event.badge}
              </span>
              <span className="hidden text-[var(--muted-ink)] sm:inline">
                {event.tag}
              </span>
            </div>
            <span className="shrink-0 font-mono text-[11px] font-bold text-[var(--muted-ink)]">
              {event.year}
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Icon
              size={19}
              strokeWidth={1.8}
              style={{
                color: TIMELINE_COLORS.iconColor,
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <h3 className="font-commissioner text-[17px] font-semibold leading-snug tracking-tight text-[var(--ink)] md:text-[19px]">
              {event.title}
            </h3>
          </div>

          <p className="ml-[28px] mt-2 text-[13px] font-medium leading-relaxed text-[var(--muted-ink)]">
            {event.detail}
          </p>

          <div className="ml-[28px] mt-3 flex items-center gap-2 font-mono text-[9px] text-[var(--muted-ink)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--field-accent)]" />
            <span className="tracking-widest">MILESTONE · REPORTED</span>
            <span className="theme-rule h-px w-6" />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </div>
        </motion.article>
      </div>
    </div>
  );
}

function TimelineDroneRoute({
  progress,
  trackRef,
  onActiveIndexChange,
}: {
  progress: MotionValue<number>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  onActiveIndexChange: (index: number) => void;
}) {
  const [route, setRoute] = useState({ path: "", width: 0, height: 0 });
  const scrollVelocity = useVelocity(progress);
  const pathRef = useRef<SVGPathElement>(null);
  const droneRef = useRef<HTMLDivElement>(null);
  const anchorsRef = useRef<Array<{ x: number; y: number }>>([]);
  const milestoneProgressRef = useRef<number[]>([]);
  const curveNoiseRef = useRef<number[]>([]);
  const activeIndexRef = useRef(-1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measureRoute = () => {
      const bounds = track.getBoundingClientRect();
      const rows = Array.from(
        track.querySelectorAll<HTMLElement>("[data-timeline-row]"),
      );
      if (bounds.width < 1 || bounds.height < 1 || rows.length < 2) return;

      const isMobile = bounds.width < 1024;
      const curve = isMobile ? Math.min(bounds.width * 0.12, 44) : Math.min(bounds.width * 0.16, 180);
      if (curveNoiseRef.current.length !== rows.length) {
        curveNoiseRef.current = rows.map(() => Math.random() * 2 - 1);
      }
      const anchors = rows.map((row, index) => {
        const card = row.querySelector<HTMLElement>(".timeline-entry");
        const cardBounds = (card ?? row).getBoundingClientRect();
        return {
          x: isMobile
            ? 44 + curveNoiseRef.current[index] * Math.min(14, bounds.width * 0.035)
            : cardBounds.left - bounds.left + cardBounds.width / 2,
          y: cardBounds.top - bounds.top - (isMobile ? 28 : 38),
        };
      });
      const tangents = anchors.map((anchor, index) => {
        const previous = anchors[Math.max(0, index - 1)];
        const next = anchors[Math.min(anchors.length - 1, index + 1)];
        const neighborCount = index === 0 || index === anchors.length - 1 ? 1 : 2;
        return {
          x: (next.x - previous.x) / neighborCount + curveNoiseRef.current[index] * curve * 0.8,
          y: (next.y - previous.y) / neighborCount,
        };
      });
      const segments = anchors.slice(1).map((end, index) => {
        const start = anchors[index];
        const startTangent = tangents[index];
        const endTangent = tangents[index + 1];
        return {
          start,
          control1: { x: start.x + startTangent.x / 3, y: start.y + startTangent.y / 3 },
          control2: { x: end.x - endTangent.x / 3, y: end.y - endTangent.y / 3 },
          end,
        };
      });
      const path = segments.reduce(
        (currentPath, segment) =>
          `${currentPath} C ${segment.control1.x} ${segment.control1.y}, ${segment.control2.x} ${segment.control2.y}, ${segment.end.x} ${segment.end.y}`,
        `M ${anchors[0].x} ${anchors[0].y}`,
      );
      let measuredLength = 0;
      const milestoneDistances = [0];
      segments.forEach((segment) => {
        let previous = segment.start;
        for (let step = 1; step <= 64; step += 1) {
          const t = step / 64;
          const inverse = 1 - t;
          const point = {
            x: inverse ** 3 * segment.start.x + 3 * inverse ** 2 * t * segment.control1.x + 3 * inverse * t ** 2 * segment.control2.x + t ** 3 * segment.end.x,
            y: inverse ** 3 * segment.start.y + 3 * inverse ** 2 * t * segment.control1.y + 3 * inverse * t ** 2 * segment.control2.y + t ** 3 * segment.end.y,
          };
          measuredLength += Math.hypot(point.x - previous.x, point.y - previous.y);
          previous = point;
        }
        milestoneDistances.push(measuredLength);
      });

      anchorsRef.current = anchors;
      milestoneProgressRef.current = milestoneDistances.map((distance) => distance / measuredLength);
      setRoute({ path, width: bounds.width, height: bounds.height });
    };

    measureRoute();
    const observer = new ResizeObserver(measureRoute);
    observer.observe(track);
    track.querySelectorAll("[data-timeline-row]").forEach((row) => {
      observer.observe(row);
    });
    window.addEventListener("resize", measureRoute, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureRoute);
    };
  }, [trackRef]);

  useEffect(() => {
    const path = pathRef.current;
    const drone = droneRef.current;
    if (!route.path || !path || !drone) return;

    const length = path.getTotalLength();
    const updatePosition = (value: number) => {
      const amount = Math.min(1, Math.max(0, value));
      const point = path.getPointAtLength(length * amount);
      drone.style.left = point.x + "px";
      drone.style.top = point.y + "px";

      const anchors = anchorsRef.current;
      const milestoneProgress = milestoneProgressRef.current;
      let nearestIndex = 0;
      for (let index = 1; index < anchors.length; index += 1) {
        if (
          Math.abs(milestoneProgress[index] - amount) <
          Math.abs(milestoneProgress[nearestIndex] - amount)
        ) {
          nearestIndex = index;
        }
      }
      if (nearestIndex !== activeIndexRef.current) {
        activeIndexRef.current = nearestIndex;
        onActiveIndexChange(nearestIndex);
      }
    };

    const unsubscribe = progress.on("change", updatePosition);
    const unsubscribeVelocity = scrollVelocity.on("change", (velocity) => {
      const duration = Math.max(0.22, 1.4 - Math.abs(velocity) * 1.35);
      drone.style.setProperty("--rotor-duration", `${duration}s`);
    });
    drone.style.setProperty("--rotor-duration", "1.4s");
    updatePosition(progress.get());
    return () => {
      unsubscribe();
      unsubscribeVelocity();
    };
  }, [onActiveIndexChange, progress, route, scrollVelocity]);

  return (
    <>
      {route.path && (
        <svg
          className="timeline-route"
          viewBox={"0 0 " + route.width + " " + route.height}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="timeline-route-base" d={route.path} />
          <motion.path
            ref={pathRef}
            className="timeline-route-progress"
            d={route.path}
            style={{ pathLength: progress }}
          />
        </svg>
      )}
      <div className="timeline-drone" ref={droneRef} aria-hidden="true">
        <TimelineDroneArt />
      </div>
    </>
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
  const spineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const percentReadout = useTransform(smoothProgress, (value) =>
    Math.min(100, Math.max(0, Math.round(value * 100))),
  );

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
            MIT MANIPAL <span /> STUDENT-LED ROBOTICS
          </p>
          <h1 id="home-title">RUGVED</h1>
          <p className="home-hero__full-form">
            Remote Unmanned Ground Vehicular Electronic Defence Systems
          </p>
          <p className="home-hero__description">
            Ground and aerial robotics for autonomy, reconnaissance and
            real-world field challenges.
          </p>
          <div className="home-hero__actions">
            <Link href="/projects" className="home-hero__button">
              Explore projects
              <IconArrowUpRight className="h-4 w-4" />
            </Link>
            <a href="#about" className="home-hero__text-link">
              About the team
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <span className="home-hero__credit">ILLUSTRATED FIELD SYSTEMS · MANIPAL</span>
        <span className="home-hero__index" aria-hidden="true">
          01 / FIELD SYSTEMS
        </span>
      </section>

      <motion.section
        id="about"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="home-about space-y-7"
      >
        <SectionLabel index="01" label="ABOUT US" />
        <div className="home-about__grid">
          <div>
            <span className="home-about__overline">FROM MANIPAL, KARNATAKA</span>
            <h2 className="mt-3 max-w-[15ch] font-commissioner text-4xl font-bold leading-tight tracking-tight text-[var(--ink)] md:text-6xl">
              Engineering for the unstructured world.
            </h2>
          </div>
          <div className="home-about__copy">
            <p>
              RUGVED Systems is a defence-focused student robotics project
              based at MIT Manipal, MAHE. The team develops intelligent,
              autonomous systems for surveillance, reconnaissance and tactical
              defence applications.
            </p>
            <p>
              Its stated focus is innovation, safety and operational efficiency.
              Electronics, mechanical engineering, artificial intelligence,
              research and management come together across the team’s work.
            </p>
            <div className="home-about__specialties">
              <span className="home-about__overline">OUR SPECIALTIES</span>
              <ul>
                {SPECIALTIES.map((specialty) => (
                  <li key={specialty}>{specialty}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="timeline"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65 }}
        className="home-timeline space-y-7"
      >
        <SectionLabel index="02" label="MILESTONES" />
        <div className="home-timeline__frame">
          <header className="home-timeline__header">
            <div>
              <span className="home-about__overline">THE JOURNEY SO FAR</span>
              <h2 className="mt-3 font-commissioner text-3xl font-bold tracking-tight text-[var(--ink)] md:text-4xl">
                Progress, revealed one milestone at a time.
              </h2>
              <p className="mt-3 max-w-[64ch] text-sm leading-7 text-[var(--muted-ink)]">
                Scroll the route. The drone and timeline focus follow each
                milestone in view.
              </p>
            </div>
          </header>
          <div className="timeline-layout">
            <aside className="timeline-progress-panel" aria-label="Achievement timeline progress">
              <div className="timeline-progress-panel__card">
                <div className="flex items-baseline justify-between font-mono">
                  <span className="timeline-progress-panel__label"><i /> JOURNEY</span>
                  <span className="timeline-progress-panel__percent">
                    <DynamicPercent value={percentReadout} /><small>%</small>
                  </span>
                </div>
                <div className="timeline-progress-panel__bar">
                  <motion.div style={{ width: spineHeight }} />
                </div>
                <div className="timeline-progress-panel__ticks" aria-hidden="true">
                  <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                </div>
                <div className="timeline-progress-panel__milestone">
                  <span>MILESTONE</span>
                  <strong>{String(activeTimelineIndex + 1).padStart(2, "0")} / {String(EVENTS.length).padStart(2, "0")}</strong>
                </div>
              </div>
            </aside>
            <div className="home-timeline__track" ref={trackRef}>
              <TimelineDroneRoute
                progress={smoothProgress}
                trackRef={trackRef}
                onActiveIndexChange={setActiveTimelineIndex}
              />
              <div className="relative z-10 flex flex-col">
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
            <span>Selected team-reported results; recent additions are from the RUGVED brochure.</span>
            <span className="flex flex-wrap items-center gap-4">
              <a href="https://rugved.co.in/" target="_blank" rel="noreferrer">
                RUGVED source
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.manipal.edu/content/dam/manipal/mu/mit/images/ad_sw/Ingenuity2022.pdf"
                target="_blank"
                rel="noreferrer"
              >
                MAHE compendium
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </span>
          </footer>
        </div>
      </motion.section>

    </main>
  );
}
