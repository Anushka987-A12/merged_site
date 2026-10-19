"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";

type RadarObstacle = { id: number; x: number; y: number; size: number; kind: number; delay: number };
type MotionProfile = { duration: number; keyTimes: string; keyPoints: string };
type DroneRoute = MotionProfile & {
  id: string;
  model: "uavRecon" | "uavFlir";
  path: string;
  transit: boolean;
  delay: number;
  x: number;
  y: number;
};

const DRONE_ROUTES: DroneRoute[] = [
  {
    id: "recon-east",
    model: "uavRecon",
    transit: true,
    x: 310,
    y: 280,
    path: "M -150,280 C 260,210 520,330 900,260 S 1500,190 2070,295",
    duration: 42.4,
    keyTimes: "0;0.380;0.510;1",
    keyPoints: "0;0.280;0.620;1",
    delay: 14.1,
  },
  {
    id: "flir-west",
    model: "uavFlir",
    transit: true,
    x: 700,
    y: 220,
    path: "M 2070,205 C 1660,280 1320,160 960,235 S 290,320 -150,230",
    duration: 36.8,
    keyTimes: "0;0.420;0.550;1",
    keyPoints: "0;0.310;0.640;1",
    delay: 8.9,
  },
  {
    id: "scout-high",
    model: "uavRecon",
    transit: true,
    x: 1100,
    y: 330,
    path: "M -150,390 C 420,350 720,300 1050,325 S 1640,390 2070,330",
    duration: 44.2,
    keyTimes: "0;0.360;0.490;1",
    keyPoints: "0;0.270;0.590;1",
    delay: 3.6,
  },
  {
    id: "flir-high",
    model: "uavFlir",
    transit: true,
    x: 1540,
    y: 300,
    path: "M 2070,390 C 1640,330 1410,280 1080,315 S 440,380 -150,320",
    duration: 34.6,
    keyTimes: "0;0.440;0.570;1",
    keyPoints: "0;0.350;0.670;1",
    delay: 6.8,
  },
  {
    id: "survey-north",
    model: "uavRecon",
    transit: false,
    x: 320,
    y: 245,
    path: "M 320,245 C 480,185 690,195 790,265 C 900,340 650,380 500,325 C 380,285 320,245",
    duration: 32.8,
    keyTimes: "0;0.516;0.596;1",
    keyPoints: "0;0.379;0.585;1",
    delay: 0,
  },
  {
    id: "survey-south",
    model: "uavFlir",
    transit: false,
    x: 1180,
    y: 360,
    path: "M 1180,360 C 1330,290 1570,285 1660,355 C 1730,410 1510,455 1360,425 C 1230,400 1180,360",
    duration: 42.1,
    keyTimes: "0;0.546;0.629;1",
    keyPoints: "0;0.430;0.670;1",
    delay: 0,
  },
];

const ROVER_MOTION: MotionProfile = {
  duration: 48.0,
  keyTimes: "0;0.420;0.550;1",
  keyPoints: "0;0.340;0.580;1",
};

function DronePatrol() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <g className="scroll-drones" aria-hidden="true">
      {DRONE_ROUTES.map((route) => (
        <g
          key={route.id}
          transform={reduceMotion ? `translate(${route.x} ${route.y})` : undefined}
          opacity={route.transit && !reduceMotion ? 0 : 0.84}
        >
          <use href={`#${route.model}`} />
          {!reduceMotion && <animateMotion
            path={route.path}
            dur={`${route.duration.toFixed(1)}s`}
            keyTimes={route.keyTimes}
            keyPoints={route.keyPoints}
            calcMode="linear"
            begin={`${route.delay.toFixed(1)}s`}
            repeatCount="indefinite"
          />}
          {route.transit && !reduceMotion && (
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0"
              keyTimes="0;0.12;0.82;1"
              dur={`${route.duration.toFixed(1)}s`}
              begin={`${route.delay.toFixed(1)}s`}
              repeatCount="indefinite"
            />
          )}
        </g>
      ))}
    </g>
  );
}

function RadarReturns() {
  const [returns, setReturns] = useState<RadarObstacle[]>([]);

  useEffect(() => {
    const refresh = () => setReturns(Array.from({ length: 3 }, (_, id) => ({
      id: Date.now() + id,
      x: 140 + Math.random() * 1640,
      y: 850 + Math.random() * 175,
      size: 3 + Math.random() * 6,
      kind: Math.floor(Math.random() * 3),
      delay: Math.random() * 1.6,
    })));

    const initialTimer = window.setTimeout(refresh, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.clearTimeout(initialTimer);
    }
    const interval = window.setInterval(refresh, 5200);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <g aria-hidden="true">
      {returns.map((obstacle) => (
        <g key={obstacle.id} className="radar-return" transform={`translate(${obstacle.x} ${obstacle.y})`} style={{ animationDelay: `${obstacle.delay}s` }}>
          {obstacle.kind === 0 ? (
            <circle r={obstacle.size} />
          ) : obstacle.kind === 1 ? (
            <rect x={-obstacle.size} y={-obstacle.size} width={obstacle.size * 2} height={obstacle.size * 2} />
          ) : (
            <path d={`M 0 ${-obstacle.size} L ${obstacle.size} 0 L 0 ${obstacle.size} L ${-obstacle.size} 0 Z`} />
          )}
          <path d={`M ${-obstacle.size * 1.6} 0 H ${obstacle.size * 1.6} M 0 ${-obstacle.size * 1.6} V ${obstacle.size * 1.6}`} />
        </g>
      ))}
    </g>
  );
}

export function DefenseBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${
        isLight ? "light-mode" : ""
      }`}
    >
      <style>{`
        :root {
          --td: 2.4s;
          --tt: cubic-bezier(0.22, 0.9, 0.26, 1);
          --hud: #a6edc1;
          --amber: #edb260;
          --ember: #e36a49;
          --sweep: 3.8s;
        }
        .light-mode { --hud: #a7f0dd; --amber: #9cac54; --ember: #97cd97; }

        .hero-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          background: #04151b;
          overflow: hidden;
          transition: background-color var(--td) var(--tt);
        }
        .light-mode .hero-wrapper { background: #345c32; }
        .hero-wrapper::after {
          content: "";
          position: absolute;
          z-index: 2;
          inset: auto 0 0;
          height: 12%;
          pointer-events: none;
          background: linear-gradient(to bottom, transparent, var(--page));
        }
        .hero-wrapper svg {
          width: 100%;
          height: 100%;
          display: block;
          shape-rendering: geometricPrecision;
          text-rendering: geometricPrecision;
        }

        /* ── DAY / NIGHT CROSSFADE PRIMITIVES ───────────────────── */
        .n-sky, .n-ember, .n-haze, .n-grade,
        .d-sky, .d-haze, .d-grade, .d-bloom, .d-cloud, .d-bird {
          transition: opacity var(--td) var(--tt);
        }

        .n-sky   { opacity: 1; }    .light-mode .n-sky   { opacity: 0; }
        .n-ember { opacity: 0.65; } .light-mode .n-ember { opacity: 0; }
        .n-haze  { opacity: 0; }
        .n-grade { opacity: 0.18; } .light-mode .n-grade { opacity: 0; }

        .d-sky   { opacity: 0; } .light-mode .d-sky   { opacity: 1; }
        .d-haze  { opacity: 0; }
        .d-grade { opacity: 0; } .light-mode .d-grade { opacity: 0.18; }
        .d-bloom { opacity: 0; } .light-mode .d-bloom { opacity: 0.06; }
        .d-cloud { opacity: 0; } .light-mode .d-cloud { opacity: 0.12; }
        .d-bird  { opacity: 0; } .light-mode .d-bird  { opacity: 0.28; }

        .starfield { opacity: 1; transition: opacity calc(var(--td) * 0.6) var(--tt); }
        .light-mode .starfield { opacity: 0.04; }

        /* ── CELESTIAL RIG ──────────────────────────────────────── */
        .moon-rig {
          transform-origin: 680px 260px;
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 1;
          transition: transform var(--td) var(--tt), opacity var(--td) var(--tt);
        }
        .light-mode .moon-rig { transform: translate3d(520px, -70px, 0) scale(0.72); opacity: 0.28; }

        .sun-rig {
          opacity: 0;
          transition: opacity var(--td) var(--tt);
        }
        .light-mode .sun-rig { opacity: 0.88; }

        .sun-rays {
          opacity: 0;
          transition: opacity var(--td) var(--tt);
        }
        .light-mode .sun-rays { opacity: 0.18; }

        .lake-ripple { animation: ripple-drift 24s linear infinite; }
        .lake-ripple:nth-of-type(even) { animation-direction: reverse; animation-duration: 31s; }
        @keyframes ripple-drift { to { transform: translateX(-180px); } }

        .moon-ring {
          transform-origin: 680px 260px;
          animation: spin 260s linear infinite reverse;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── TERRAIN: ATMOSPHERIC PERSPECTIVE LADDER (SHARPENED) ── */
        .t-bg, .t-mg, .t-fg {
          stroke-width: 1.2;
          transition: fill var(--td) var(--tt), stroke var(--td) var(--tt);
        }
        .t-bg { fill: var(--terrain-bg, #136d77); stroke: #238b96; }
        .t-mg { fill: var(--terrain-mg, #0d4c57); stroke: #196774; }
        .t-fg { fill: var(--terrain-fg, #08333c); stroke: #104853; }

        /* Crisp rim light along every crest */
        .crest {
          fill: none;
          stroke: #41e8b8;
          stroke-linecap: round;
          opacity: 0.72;
          transition: stroke var(--td) var(--tt), opacity var(--td) var(--tt);
        }
        .light-mode .crest { stroke: #0f6e5e; opacity: 0.82; }

        .creek-water { opacity: 0.98; transition: opacity var(--td) var(--tt); }
        .light-mode .creek-water { opacity: 1; }
        .creek-edge { fill: none; stroke: var(--shoreline); stroke-width: 9; stroke-linejoin: round; opacity: 0.95; transition: stroke var(--td) var(--tt); }
        .creek-ripple { fill: none; stroke: #b2fff0; stroke-width: 2.4; stroke-linecap: round; stroke-dasharray: 12 25; opacity: 0.58; animation: creek-flow 10s linear infinite; }
        .creek-ripple:nth-child(2) { animation-duration: 13s; animation-delay: -4s; opacity: 0.42; }
        .creek-ripple:nth-child(3) { animation-duration: 16s; animation-delay: -8s; opacity: 0.35; }
        .light-mode .creek-ripple { stroke: #e6fff0; opacity: 0.65; }
        @keyframes creek-flow { to { stroke-dashoffset: -148; } }
        .land-texture { fill: none; stroke: var(--land-detail); stroke-width: 2.2; opacity: 0.55; transition: stroke var(--td) var(--tt); }
        .terrain-facet { fill: #d5f1d4; opacity: 0.14; }
        .light-mode .terrain-facet { fill: #33594e; opacity: 0.14; }
        .terrain-strata { fill: none; stroke: #8ee9cb; stroke-width: 1.6; opacity: 0.42; }
        .light-mode .terrain-strata { stroke: #2a6f62; opacity: 0.38; }
        .trail-track { fill: none; stroke: #9fbaa0; stroke-width: 2; stroke-dasharray: 22 30 8 36; opacity: 0.28; }
        .light-mode .trail-track { stroke: #3e684a; opacity: 0.35; }
        .shore-rock { fill: #092f34; stroke: #5ca69a; stroke-width: 1.3; }
        .shore-rock-highlight { fill: #8ee3c8; opacity: 0.45; }
        .light-mode .shore-rock { fill: #234641; stroke: #5c8470; }
        .light-mode .shore-rock-highlight { fill: #e4d5a8; opacity: 0.5; }
        .shore-grass { fill: none; stroke: #7bc49e; stroke-width: 2.2; stroke-linecap: round; opacity: 0.68; }
        .light-mode .shore-grass { stroke: #2c6e4e; opacity: 0.72; }
        .lake-glint { fill: none; stroke: #e6fffa; stroke-linecap: round; opacity: 0.65; }
        .light-mode .lake-glint { stroke: #0b4a42; opacity: 0.7; }
        .firefly { fill: var(--amber); opacity: 0.35; transform-box: fill-box; transform-origin: center; animation: firefly-pulse 6s ease-in-out infinite; }
        .firefly:nth-child(2n) { animation-delay: -2.4s; }
        .firefly:nth-child(3n) { animation-delay: -4.2s; }
        @keyframes firefly-pulse { 0%, 100% { opacity: .2; transform: scale(.85); } 50% { opacity: .9; transform: scale(1.4); } }
        .pine-far { fill: #0b494d; opacity: 0.95; }
        .pine-near { fill: #052a2e; opacity: 1; }
        .light-mode .pine-far { fill: #1c6b68; opacity: 0.95; }
        .light-mode .pine-near { fill: #114245; opacity: 1; }

        .scoop {
          fill: #000000;
          opacity: 0.16;
          transition: fill var(--td) var(--tt), opacity var(--td) var(--tt);
        }
        .light-mode .scoop { fill: #104e55; opacity: 0.14; }

        /* ── VEHICLES ───────────────────────────────────────────── */
        .beam, .spot {
          mix-blend-mode: screen;
          transition: opacity var(--td) var(--tt);
        }
        .beam        { opacity: 0.28; }
        .spot        { opacity: 0.24; }
        .searchlight { opacity: 0.14; }
        .footprint   { opacity: 0.08; }
        .light-mode .beam,
        .light-mode .spot,
        .light-mode .searchlight,
        .light-mode .footprint { opacity: 0; }

        .hull-1, .hull-2, .hull-3, .hull-line {
          transition: fill var(--td) var(--tt), stroke var(--td) var(--tt);
        }
        .hull-1    { fill: #101d17; stroke: #6e9479; stroke-width: 1.2; stroke-linejoin: round; }
        .hull-2    { fill: #1b3023; stroke: #8bb384; stroke-width: 1.2; stroke-linejoin: round; }
        .hull-3    { fill: #29442e; stroke: #aed099; stroke-width: 1; stroke-linejoin: round; }
        .hull-line { stroke: #bde0a4; stroke-width: 1.6; }

        .light-mode .hull-1    { fill: #48281c; stroke: #331a12; }
        .light-mode .hull-2    { fill: #6b3c28; stroke: #45241a; }
        .light-mode .hull-3    { fill: #8f5537; stroke: #5a2f20; }
        .light-mode .hull-line { stroke: #b0764f; }

        .rim-light {
          stroke: #5de4ad;
          fill: none;
          opacity: 0.65;
          transition: stroke var(--td) var(--tt), opacity var(--td) var(--tt);
        }
        .light-mode .rim-light { stroke: #97cd97; opacity: 0.85; }

        .hud {
          font-family: var(--font-open-sans), sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          fill: var(--hud);
          opacity: 0.95;
          transition: fill var(--td) var(--tt), opacity var(--td) var(--tt);
        }
        .light-mode .hud { fill: #a7f0dd; opacity: 0.98; }

        /* ── PARALLAX ───────────────────────────────────────────── */
        .scroll-drones { filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.45)); }
        .light-mode .scroll-drones { filter: drop-shadow(0 3px 4px rgba(35, 54, 37, 0.28)); }
        .radar-return { fill: none; stroke: var(--hud); stroke-width: 1.8; opacity: 0; animation: radar-blip 4.8s ease-out infinite; }
        .light-mode .radar-return { stroke: #1e6847; }
        @keyframes radar-blip { 0% { opacity: 0; } 18% { opacity: 0.8; } 72% { opacity: 0.18; } 100% { opacity: 0; } }
        @keyframes blink  { 50% { opacity: 0.65; } }
        @keyframes strobe { 0%, 92%, 100% { opacity: 0.1; } 96% { opacity: 0.75; } }
        .beacon       { opacity: 0.15; animation: blink 2s infinite; }
        .beacon-amber { opacity: 0.15; animation: blink 2.3s infinite; }
        .beacon-ember { animation: strobe 3.6s infinite; }

        /* UGV emitter ticks once per sweep, in time with the wavefront */
        @keyframes emit { 0%, 7% { opacity: 0.7; } 20%, 100% { opacity: 0.1; } }
        .emitter { animation: emit var(--sweep) linear infinite; }

        .sat-drift { opacity: 0.5; }
        .ugv-anim { filter: drop-shadow(0 5px 4px rgba(0,0,0,0.42)); }
        .light-mode .ugv-anim { filter: drop-shadow(0 7px 5px rgba(10,35,32,0.4)) drop-shadow(0 0 6px rgba(35,115,75,0.2)); }
        .ugv-shadow { fill: #06191c; opacity: 0.46; }
        .light-mode .ugv-shadow { fill: #183c36; opacity: 0.28; }
        .radar-ring { fill: none; stroke: var(--hud); stroke-width: 1.25; stroke-dasharray: 4 7; opacity: 0; transform-box: fill-box; transform-origin: center; animation: radar-scan 5.6s ease-out infinite; }
        .radar-ring:nth-child(2) { animation-delay: -2.8s; }
        @keyframes radar-scan { 0% { opacity: .46; transform: scale(.08); } 75%, 100% { opacity: 0; transform: scale(1); } }
        .light-mode .radar-ring { stroke: #2b8268; }

        @keyframes wheel { to { transform: rotate(360deg); } }
        .wheel { animation: wheel 1.1s linear infinite; }

        @keyframes mote-a { 0% { transform: translate3d(0,0,0); opacity: 0; } 15% { opacity: 0.45; } 100% { transform: translate3d(-42px,-72px,0); opacity: 0; } }
        @keyframes mote-b { 0% { transform: translate3d(0,0,0); opacity: 0; } 20% { opacity: 0.35; } 100% { transform: translate3d(-26px,-96px,0); opacity: 0; } }
        @keyframes mote-c { 0% { transform: translate3d(0,0,0); opacity: 0; } 10% { opacity: 0.3;  } 100% { transform: translate3d(-56px,-52px,0); opacity: 0; } }
        .mote-a { animation: mote-a 2.6s ease-out infinite; }
        .mote-b { animation: mote-b 3.4s ease-out infinite 0.6s; }
        .mote-c { animation: mote-c 2.1s ease-out infinite 1.3s; }
        .mote   { fill: var(--ember); transition: fill var(--td) var(--tt); }
        .light-mode .mote { fill: #ffd9a8; }

        @media (prefers-reduced-motion: reduce) {
          .hero-wrapper * { animation: none !important; }
          .radar-return { opacity: 0.45 !important; animation: none !important; }
        }
      `}</style>

      <div className="hero-wrapper">
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          style={{
            "--terrain-bg": isLight ? "#51aaa4" : "#11616a",
            "--terrain-mg": isLight ? "#267b81" : "#0b424b",
            "--terrain-fg": isLight ? "#164b52" : "#082d35",
            "--shoreline": isLight ? "#17484b" : "#0b343b",
            "--land-detail": isLight ? "#76c5af" : "#397e82",
          } as React.CSSProperties}
        >
          <defs>
            {/* ── SKY ── */}
            <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06151e" />
            <stop offset="42%" stopColor="#073b48" />
            <stop offset="74%" stopColor="#08777d" />
            <stop offset="100%" stopColor="#2bb6a9" />
            </linearGradient>

            <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b2d8cc" />
              <stop offset="32%" stopColor="#83c9bd" />
              <stop offset="66%" stopColor="#4ca8a5" />
              <stop offset="100%" stopColor="#167a80" />
            </linearGradient>

            <linearGradient id="lakeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#268c8d" />
              <stop offset="35%" stopColor="#0d5965" />
              <stop offset="100%" stopColor="#061f2c" />
            </linearGradient>
            <linearGradient id="lakeFillDay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#55b6a8" />
              <stop offset="40%" stopColor="#27858a" />
              <stop offset="100%" stopColor="#12515e" />
            </linearGradient>
            <linearGradient id="lakeReflection" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4fff0" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#d4fff0" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="emberHorizon" cx="50%" cy="100%" r="62%">
              <stop offset="0%" stopColor="#FF7A2E" stopOpacity="0.3" />
              <stop offset="55%" stopColor="#C2431A" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#C2431A" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="dayBloom" cx="55%" cy="28%" r="62%">
              <stop offset="0%" stopColor="#fff0d5" stopOpacity="0.3" />
              <stop offset="42%" stopColor="#ffc0a0" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e9b28f" stopOpacity="0" />
            </radialGradient>

            {/* ── ATMOSPHERIC HAZE (replaces blur filters) ── */}
            <linearGradient id="hazeNight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2B6B59" stopOpacity="0" />
              <stop offset="46%" stopColor="#3E8C74" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2B6B59" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="hazeDay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE9C6" stopOpacity="0" />
              <stop offset="44%" stopColor="#e7dfc9" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#d8cfb8" stopOpacity="0" />
            </linearGradient>

            {/* ── DEPTH GRADE ── */}
            <linearGradient id="gradeNight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.62" />
            </linearGradient>

            <linearGradient id="gradeDay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#35533c" stopOpacity="0" />
              <stop offset="100%" stopColor="#173f43" stopOpacity="0.1" />
            </linearGradient>

            {/* ── CLOUDS (gradient-filled, no blur) ── */}
            <radialGradient id="cloudFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF6E2" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#FFEED2" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFE6C2" stopOpacity="0" />
            </radialGradient>

            {/* ── MOON ── */}
            <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#CFFFF0" stopOpacity="0.26" />
              <stop offset="48%" stopColor="#35D399" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#35D399" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="moonDisc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EAF3EE" />
              <stop offset="60%" stopColor="#C6DED3" />
              <stop offset="100%" stopColor="#93B4A5" />
            </linearGradient>

            {/* ── SUN ── */}
            <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF8DA" stopOpacity="0.9" />
              <stop offset="22%" stopColor="#FFE6B5" stopOpacity="0.62" />
              <stop offset="56%" stopColor="#F8B78B" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#F8B78B" stopOpacity="0" />
            </radialGradient>

            {/* ── VOLUMETRIC LIGHTING ── */}
            <linearGradient id="ugvBeam" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0%" stopColor="#E8FFF7" stopOpacity="0.65" />
              <stop offset="28%" stopColor="#35D399" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#35D399" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="ugvSpot" cx="40%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#E8FFF7" stopOpacity="0.5" />
              <stop offset="58%" stopColor="#35D399" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#35D399" stopOpacity="0" />
            </radialGradient>

            {/* ── RIDGELINES ──────────────────────────────────────
                Each path starts and ends at the same height AND the
                same tangent, so tile N's tail meets tile N+1's head
                with no step and no kink. The join sits in a trough,
                where it is hardest to read.                        */}
            <path
              id="ridgeBg"
              d="M0,545 C35,545 62,506 95,506 S148,516 174,514 S244,462 278,452 S326,472 350,475 S442,426 476,420 S546,457 570,464 S666,349 704,340 S773,394 797,399 S859,375 885,378 S978,427 1010,433 S1093,406 1120,409 S1210,463 1245,472 S1341,430 1373,434 S1468,480 1498,474 S1588,399 1625,398 S1685,430 1710,432 S1782,416 1820,420 C1870,420 1885,545 1920,545"
            />
            <path
              id="ridgeMg"
              d="M0,682 C40,682 76,644 105,644 S176,665 205,662 S272,601 302,592 S358,616 388,618 S462,572 492,568 S557,623 590,632 S657,553 690,548 S748,585 778,587 S842,568 872,570 S944,631 980,638 S1048,597 1084,596 S1154,642 1188,644 S1263,570 1298,566 S1360,610 1395,615 S1460,584 1496,588 S1572,640 1606,642 S1674,577 1710,574 S1781,625 1817,631 C1865,634 1886,682 1920,682"
            />
            <path
              id="ridgeFg"
              d="M0,814 C38,814 72,778 100,778 S154,800 184,796 S242,731 270,724 S326,763 354,765 S414,710 442,704 S503,764 530,770 S590,720 620,718 S681,760 710,765 S770,706 798,700 S856,758 885,766 S950,724 980,724 S1045,781 1074,786 S1132,735 1160,731 S1223,777 1252,780 S1313,720 1340,716 S1402,763 1430,768 S1492,708 1520,704 S1582,757 1610,760 S1677,724 1704,722 S1770,780 1800,786 C1855,790 1885,814 1920,814"
            />

            <path
              id="massBg"
              className="t-bg"
              d="M0,545 C35,545 62,506 95,506 S148,516 174,514 S244,462 278,452 S326,472 350,475 S442,426 476,420 S546,457 570,464 S666,349 704,340 S773,394 797,399 S859,375 885,378 S978,427 1010,433 S1093,406 1120,409 S1210,463 1245,472 S1341,430 1373,434 S1468,480 1498,474 S1588,399 1625,398 S1685,430 1710,432 S1782,416 1820,420 C1870,420 1885,545 1920,545 L1920,1080 L0,1080 Z"
            />
            <path
              id="massMg"
              className="t-mg"
              d="M0,682 C40,682 76,644 105,644 S176,665 205,662 S272,601 302,592 S358,616 388,618 S462,572 492,568 S557,623 590,632 S657,553 690,548 S748,585 778,587 S842,568 872,570 S944,631 980,638 S1048,597 1084,596 S1154,642 1188,644 S1263,570 1298,566 S1360,610 1395,615 S1460,584 1496,588 S1572,640 1606,642 S1674,577 1710,574 S1781,625 1817,631 C1865,634 1886,682 1920,682 L1920,1080 L0,1080 Z"
            />
            <path
              id="massFg"
              className="t-fg"
              d="M0,814 C38,814 72,778 100,778 S154,800 184,796 S242,731 270,724 S326,763 354,765 S414,710 442,704 S503,764 530,770 S590,720 620,718 S681,760 710,765 S770,706 798,700 S856,758 885,766 S950,724 980,724 S1045,781 1074,786 S1132,735 1160,731 S1223,777 1252,780 S1313,720 1340,716 S1402,763 1430,768 S1492,708 1520,704 S1582,757 1610,760 S1677,724 1704,722 S1770,780 1800,786 C1855,790 1885,814 1920,814 L1920,1080 L0,1080 Z"
            />

            <g id="pine">
              <path d="M0,0 C-7,9 -15,22 -22,34 C-19,37 -15,36 -12,34 C-18,44 -25,54 -31,62 C-27,66 -23,66 -19,63 C-26,74 -33,85 -39,92 C-30,96 -19,94 -9,91 L-9,111 Q0,115 9,111 L9,91 C19,94 30,96 39,92 C33,85 26,74 19,63 C23,66 27,66 31,62 C25,54 18,44 12,34 C15,36 19,37 22,34 C15,22 7,9 0,0 Z" />
            </g>

            <linearGradient id="coneGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#35D399" stopOpacity="0.4" />
              <stop offset="55%" stopColor="#35D399" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#35D399" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="coneAmber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFB347" stopOpacity="0.4" />
              <stop offset="55%" stopColor="#FFB347" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFB347" stopOpacity="0" />
            </linearGradient>

            <g id="uavRecon" transform="scale(1.38)">
              <polygon points="-4,8 4,8 44,178 -44,178" fill="url(#coneGreen)" className="searchlight" />
              <ellipse cx="0" cy="178" rx="44" ry="9" fill="url(#coneGreen)" className="footprint" />
              <polygon points="-15,0 15,-5 20,5 15,10 -10,10" className="hull-1" />
              <polygon points="-5,-5 10,-5 10,0 -5,0" className="hull-2" />
              <path d="M-15,-1 L13,-4.5" className="rim-light" strokeWidth="1" />
              <line x1="-20" y1="5" x2="25" y2="5" className="hull-line" strokeWidth="1.5" />
              <circle cx="0" cy="8" r="1.5" fill="var(--hud)" className="beacon" />
            </g>

            <g id="uavFlir" transform="scale(1.38)">
              <polygon points="-4,8 4,8 44,178 -44,178" fill="url(#coneAmber)" className="searchlight" />
              <ellipse cx="0" cy="178" rx="44" ry="9" fill="url(#coneAmber)" className="footprint" />
              <polygon points="-15,0 15,-5 20,5 15,10 -10,10" className="hull-1" />
              <polygon points="-5,-5 10,-5 10,0 -5,0" className="hull-2" />
              <path d="M-15,-1 L13,-4.5" className="rim-light" strokeWidth="1" />
              <line x1="-20" y1="5" x2="25" y2="5" className="hull-line" strokeWidth="1.5" />
              <circle cx="0" cy="8" r="1.5" fill="var(--amber)" className="beacon-amber" />
            </g>

            {/* ── BIRD (day only) ── */}
            <path id="bird" d="M0,0 c4,-5 8,-5 11,0 c3,-5 7,-5 11,0" fill="none" stroke="#7A3C22" strokeWidth="1.6" strokeLinecap="round" />

          </defs>

          {/* SKY */}
          <rect className="n-sky" x="0" y="0" width="1920" height="1080" fill="url(#skyNight)" />
          <rect className="d-sky" x="0" y="0" width="1920" height="1080" fill="url(#skyDay)" />
          <rect className="n-ember" x="0" y="300" width="1920" height="780" fill="url(#emberHorizon)" />

          {/* STARFIELD */}
          <g className="starfield" fill="#f4fff7">
            <circle cx="150" cy="120" r="1.4" opacity="0.22" />
            <circle cx="340" cy="200" r="1" opacity="0.14" />
            <circle cx="850" cy="80" r="1.8" opacity="0.28" />
            <circle cx="1250" cy="250" r="1.3" opacity="0.18" />
            <circle cx="1700" cy="140" r="1" opacity="0.15" />
            <circle cx="520" cy="90" r="1" opacity="0.13" />
            <circle cx="1050" cy="170" r="1" opacity="0.16" />
            <circle cx="1500" cy="60" r="1.6" opacity="0.24" />
            <circle cx="680" cy="140" r="1" opacity="0.12" />
            <circle cx="1820" cy="85" r="1.2" opacity="0.2" />
            <circle cx="1120" cy="300" r="1" opacity="0.1" />
            <circle cx="260" cy="320" r="1.1" opacity="0.12" />
            <circle cx="82" cy="255" r="1.3" opacity="0.34" />
            <circle cx="210" cy="72" r="1.1" opacity="0.44" />
            <circle cx="295" cy="165" r="1.5" opacity="0.38" />
            <circle cx="405" cy="275" r="1" opacity="0.32" />
            <circle cx="470" cy="130" r="1.4" opacity="0.52" />
            <circle cx="592" cy="45" r="1" opacity="0.38" />
            <circle cx="755" cy="210" r="1.2" opacity="0.35" />
            <circle cx="924" cy="145" r="1.5" opacity="0.52" />
            <circle cx="1015" cy="45" r="1" opacity="0.38" />
            <circle cx="1168" cy="92" r="1.4" opacity="0.43" />
            <circle cx="1320" cy="175" r="1" opacity="0.32" />
            <circle cx="1415" cy="288" r="1.2" opacity="0.38" />
            <circle cx="1605" cy="215" r="1.5" opacity="0.4" />
            <circle cx="1762" cy="285" r="1" opacity="0.35" />
            <circle cx="1880" cy="205" r="1.3" opacity="0.48" />
            <circle cx="78" cy="360" r="1" opacity="0.28" />
            <circle cx="365" cy="356" r="1.3" opacity="0.38" />
            <circle cx="562" cy="320" r="1" opacity="0.33" />
            <circle cx="845" cy="330" r="1.2" opacity="0.4" />
            <circle cx="1080" cy="350" r="1" opacity="0.32" />
            <circle cx="1265" cy="335" r="1.5" opacity="0.42" />
            <circle cx="1470" cy="350" r="1" opacity="0.35" />
            <circle cx="1688" cy="90" r="1.2" opacity="0.45" />
            <circle cx="1840" cy="50" r="1" opacity="0.4" />
            <circle cx="720" cy="285" r="1" opacity="0.3" />
            <circle cx="990" cy="245" r="1.2" opacity="0.36" />
            <circle cx="1540" cy="125" r="1" opacity="0.34" />
          </g>

          {/* MOON — sets on theme switch */}
          <g className="moon-rig">
            <circle cx="680" cy="260" r="180" fill="url(#moonHalo)" />
            <circle className="moon-ring" cx="680" cy="260" r="76" fill="none" stroke="var(--hud)" strokeWidth="0.5" strokeDasharray="4 18" opacity="0.16" />
            <circle cx="680" cy="260" r="92" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 32" opacity="0.14" />
            <circle cx="680" cy="260" r="54" fill="url(#moonDisc)" />
            <circle cx="664" cy="245" r="9" fill="#9DBEB1" opacity="0.38" />
            <circle cx="699" cy="277" r="12" fill="#9DBEB1" opacity="0.32" />
            <circle cx="671" cy="286" r="6" fill="#9DBEB1" opacity="0.26" />
          </g>

          {/* SUN — rises behind the dune line */}
          <g className="sun-rig" transform="translate(393 -7) scale(.62)">
            <g className="sun-rays">
              <path d="M1060,560 Q1022,296 992,188" stroke="#FFF6E0" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M1060,560 Q1112,318 1144,172" stroke="#FFF6E0" strokeWidth="1.9" strokeLinecap="round" fill="none" opacity="0.55" />
              <path d="M1060,560 Q938,420 858,368" stroke="#FFF6E0" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.4" />
              <path d="M1060,560 Q1210,438 1300,392" stroke="#FFF6E0" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.4" />
            </g>
            <circle cx="1060" cy="560" r="255" fill="url(#sunHalo)" />
            <circle cx="1060" cy="560" r="96" fill="none" stroke="#FFEACB" strokeWidth="12" opacity="0.32" />
            <circle cx="1060" cy="560" r="58" fill="#FFF0C9" />
          </g>

          {/* CLOUD BANDS */}
          <g className="scroll-clouds">
            <g className="d-cloud">
              <ellipse cx="260" cy="232" rx="230" ry="26" fill="url(#cloudFill)" />
              <ellipse cx="200" cy="222" rx="130" ry="18" fill="url(#cloudFill)" />
              <ellipse cx="740" cy="164" rx="180" ry="20" fill="url(#cloudFill)" />
              <ellipse cx="1480" cy="204" rx="270" ry="28" fill="url(#cloudFill)" />
              <ellipse cx="1560" cy="192" rx="150" ry="18" fill="url(#cloudFill)" />
              <ellipse cx="2180" cy="232" rx="230" ry="26" fill="url(#cloudFill)" />
              <ellipse cx="2120" cy="222" rx="130" ry="18" fill="url(#cloudFill)" />
              <ellipse cx="2660" cy="164" rx="180" ry="20" fill="url(#cloudFill)" />
              <ellipse cx="3400" cy="204" rx="270" ry="28" fill="url(#cloudFill)" />
              <ellipse cx="3480" cy="192" rx="150" ry="18" fill="url(#cloudFill)" />
            </g>
            <g className="d-bird">
              <g transform="translate(420,300)"><use href="#bird" /></g>
              <g transform="translate(452,288) scale(0.8)"><use href="#bird" /></g>
              <g transform="translate(408,276) scale(0.7)"><use href="#bird" /></g>
              <g transform="translate(1610,246)"><use href="#bird" /></g>
              <g transform="translate(1644,236) scale(0.75)"><use href="#bird" /></g>
              <g transform="translate(2340,300)"><use href="#bird" /></g>
              <g transform="translate(2372,288) scale(0.8)"><use href="#bird" /></g>
              <g transform="translate(3530,246)"><use href="#bird" /></g>
            </g>
          </g>

          {/* HIGH ALTITUDE BEACONS */}
          <g className="sat-drift">
            <circle cx="300" cy="150" r="1.5" fill="#FF8C42" className="beacon-amber" />
            <circle cx="1600" cy="110" r="1.5" fill="var(--hud)" className="beacon" />
          </g>

          {/* LAYER 1 — FAR RANGE */}
          <g className="scroll-bg">
            <use href="#massBg" x="0" />
            <use href="#massBg" x="1920" />
            <use href="#ridgeBg" className="crest" x="0" strokeWidth="4" />
            <use href="#ridgeBg" className="crest" x="1920" strokeWidth="4" />
            <path className="terrain-facet" d="M288 458 C398 421 511 419 566 459 C626 445 675 376 704 352 C737 373 766 400 791 406 Z M1131 418 C1232 446 1307 455 1368 440 C1433 446 1481 468 1495 480 C1540 448 1591 408 1623 410 C1653 425 1683 440 1708 439 Z" />
            <path className="terrain-strata" d="M310 469 Q420 443 548 432 M1272 463 Q1408 446 1530 429" />
          </g>

          <rect className="n-haze" x="0" y="404" width="1920" height="250" fill="url(#hazeNight)" />
          <rect className="d-haze" x="0" y="404" width="1920" height="250" fill="url(#hazeDay)" />

          {/* DRONE PATROL */}
          <DronePatrol />

          {/* LAYER 2 — MID RANGE */}
          <g className="scroll-mg">
            <use href="#massMg" x="0" />
            <use href="#massMg" x="1920" />
            <use href="#ridgeMg" className="crest" x="0" strokeWidth="5" />
            <use href="#ridgeMg" className="crest" x="1920" strokeWidth="5" />
            <ellipse className="scoop" cx="640" cy="762" rx="220" ry="54" />
            <ellipse className="scoop" cx="1360" cy="762" rx="260" ry="58" />
            <ellipse className="scoop" cx="2560" cy="762" rx="220" ry="54" />
            <ellipse className="scoop" cx="3280" cy="762" rx="260" ry="58" />
            <path className="terrain-facet" d="M310 601 C377 582 450 574 489 578 C530 593 560 617 586 638 Z M1091 605 C1160 587 1241 573 1294 577 C1334 592 1367 610 1390 621 C1321 627 1253 642 1191 651 Z" />
            <path className="terrain-strata" d="M335 608 Q420 594 506 585 M1300 604 Q1390 596 1470 608" />
          </g>

          <rect className="n-haze" x="0" y="600" width="1920" height="220" fill="url(#hazeNight)" />
          <rect className="d-haze" x="0" y="600" width="1920" height="220" fill="url(#hazeDay)" />

          {/* LAYER 3 — NEAR RANGE */}
          <g className="scroll-fg">
            <use href="#massFg" x="0" />
            <use href="#massFg" x="1920" />
            <use href="#ridgeFg" className="crest" x="0" strokeWidth="6" />
            <use href="#ridgeFg" className="crest" x="1920" strokeWidth="6" />
            <ellipse className="scoop" cx="900" cy="902" rx="260" ry="58" />
            <ellipse className="scoop" cx="1600" cy="902" rx="240" ry="54" />
            <ellipse className="scoop" cx="2820" cy="902" rx="260" ry="58" />
            <ellipse className="scoop" cx="3520" cy="902" rx="240" ry="54" />
            <path className="terrain-facet" d="M278 735 C330 716 393 711 438 714 C480 728 508 752 525 780 C467 773 409 765 356 774 Z M1167 742 C1220 724 1284 721 1337 726 C1375 739 1408 757 1425 779 C1367 780 1308 784 1255 789 Z" />
            <path className="terrain-strata" d="M285 742 Q355 728 415 718 M1360 737 Q1440 725 1510 718" />
          </g>

          {/* LAKE + PINES — scenic landing-page environment */}
          <g className="creek-water" aria-hidden="true">
            <path
              className="creek-edge"
              d="M900 648 C1000 690 1024 721 902 757 C778 794 737 817 842 854 C962 897 925 928 754 963 C594 996 573 1032 650 1080 L392 1080 C342 1031 393 980 548 944 C697 910 728 880 624 847 C518 814 548 780 692 746 C836 711 834 681 790 648 Z"
            />
            <path className="n-sky" d="M900 648 C1000 690 1024 721 902 757 C778 794 737 817 842 854 C962 897 925 928 754 963 C594 996 573 1032 650 1080 L392 1080 C342 1031 393 980 548 944 C697 910 728 880 624 847 C518 814 548 780 692 746 C836 711 834 681 790 648 Z" fill="url(#lakeFill)" />
            <path className="d-sky" d="M900 648 C1000 690 1024 721 902 757 C778 794 737 817 842 854 C962 897 925 928 754 963 C594 996 573 1032 650 1080 L392 1080 C342 1031 393 980 548 944 C697 910 728 880 624 847 C518 814 548 780 692 746 C836 711 834 681 790 648 Z" fill="url(#lakeFillDay)" />
            <path className="creek-ripple" d="M852 682 C950 714 948 733 858 758 C772 782 771 804 842 834 C914 864 908 886 802 914 C697 943 666 965 670 989" />
            <path className="creek-ripple" d="M878 705 C978 738 940 753 866 777 C800 800 804 818 870 844 C936 870 920 895 820 922 C732 946 706 969 710 1001" />
            <path className="creek-ripple" d="M830 733 C904 756 896 769 836 790 C786 808 792 826 852 849 C904 870 888 895 804 916" />
            <path className="lake-glint" strokeWidth="2.2" d="M842 693 Q888 708 920 704 M816 776 Q861 762 891 766 M796 817 Q831 829 856 832 M760 881 Q806 872 832 878 M660 960 Q704 947 735 950 M584 1019 Q620 1006 650 1010" />
          </g>
          <path className="land-texture" strokeWidth="2" d="M1015 786 C1158 807 1240 849 1397 837 S1672 804 1920 823 M975 914 C1122 930 1241 958 1406 940 S1680 904 1895 922 M1025 1002 C1190 1015 1320 1041 1498 1024 S1730 990 1910 1006" />
          <path className="trail-track" d="M995 848 C1148 853 1252 883 1414 870 S1672 836 1880 854" />
          <g className="shore-grass">
            <path d="M42 855 l-8 -20 m8 20 l4 -25 m-4 25 l15 -16 M142 880 l-9 -22 m9 22 l2 -28 m-2 28 l13 -17 M460 886 l-7 -18 m7 18 l10 -27 m-10 27 l16 -16" />
            <path d="M775 872 l-8 -20 m8 20 l2 -25 m-2 25 l12 -17 M1085 870 l-6 -19 m6 19 l11 -26 m-11 26 l15 -17 M1440 875 l-9 -21 m9 21 l3 -28 m-3 28 l14 -16 M1860 854 l-8 -23 m8 23 l4 -28 m-4 28 l13 -18" />
          </g>
          <g aria-hidden="true">
            <ellipse className="shore-rock-highlight" cx="320" cy="932" rx="31" ry="5" />
            <path className="shore-rock" d="M291 929 C295 923 299 918 306 918 C313 915 320 916 326 912 C334 914 343 920 350 930 C342 935 336 937 327 935 C316 938 302 936 291 929 Z" />
            <path className="shore-rock-highlight" d="M302 921 C307 918 313 919 317 920 C322 919 325 915 327 915 C331 916 335 919 338 921 C331 923 323 923 316 923 Z" />
            <ellipse className="shore-rock-highlight" cx="1178" cy="953" rx="34" ry="5" />
            <path className="shore-rock" d="M1145 950 C1149 944 1153 937 1159 937 C1165 936 1171 941 1177 940 C1182 934 1185 930 1188 930 C1195 932 1205 939 1212 951 C1205 956 1199 959 1192 958 C1179 960 1167 959 1159 956 C1153 955 1149 953 1145 950 Z" />
            <path className="shore-rock-highlight" d="M1158 943 C1162 939 1168 941 1173 943 C1179 941 1184 934 1187 934 C1192 936 1197 939 1200 942 C1193 944 1186 944 1179 945 C1171 945 1164 944 1158 943 Z" />
            <ellipse className="shore-rock-highlight" cx="1680" cy="916" rx="22" ry="4" />
            <path className="shore-rock" d="M1658 913 C1662 907 1666 903 1670 903 C1675 902 1681 907 1685 906 C1688 902 1690 899 1693 899 C1698 901 1703 906 1705 913 C1701 918 1696 921 1689 921 C1680 923 1674 920 1668 920 C1663 918 1660 916 1658 913 Z" />
            <path className="shore-rock-highlight" d="M1668 908 C1673 904 1678 907 1683 908 C1687 906 1690 902 1693 903 C1696 904 1699 907 1701 909 C1696 911 1689 911 1683 912 Z" />
          </g>
          <g aria-hidden="true">
            <circle className="firefly" cx="220" cy="864" r="3" />
            <circle className="firefly" cx="570" cy="914" r="2.4" />
            <circle className="firefly" cx="930" cy="858" r="2.6" />
            <circle className="firefly" cx="1320" cy="921" r="3" />
            <circle className="firefly" cx="1760" cy="864" r="2.5" />
          </g>
          <g className="pine-far" opacity="0.86">
            <use href="#pine" transform="translate(18 649) scale(.29)" />
            <use href="#pine" transform="translate(62 630) scale(.46)" />
            <use href="#pine" transform="translate(104 620) scale(.55)" />
            <use href="#pine" transform="translate(151 649) scale(.30)" />
            <use href="#pine" transform="translate(197 636) scale(.41)" />
            <use href="#pine" transform="translate(243 657) scale(.23)" />
            <use href="#pine" transform="translate(294 623) scale(.53)" />
            <use href="#pine" transform="translate(342 647) scale(.31)" />
            <use href="#pine" transform="translate(390 632) scale(.44)" />
            <use href="#pine" transform="translate(438 657) scale(.22)" />
            <use href="#pine" transform="translate(486 624) scale(.52)" />
            <use href="#pine" transform="translate(536 643) scale(.35)" />
            <use href="#pine" transform="translate(584 617) scale(.58)" />
            <use href="#pine" transform="translate(635 650) scale(.29)" />
            <use href="#pine" transform="translate(686 627) scale(.49)" />
            <use href="#pine" transform="translate(736 655) scale(.24)" />
            <use href="#pine" transform="translate(785 622) scale(.54)" />
            <use href="#pine" transform="translate(836 650) scale(.28)" />
            <use href="#pine" transform="translate(886 621) scale(.55)" />
            <use href="#pine" transform="translate(938 654) scale(.25)" />
            <use href="#pine" transform="translate(988 622) scale(.54)" />
            <use href="#pine" transform="translate(1038 649) scale(.30)" />
            <use href="#pine" transform="translate(1088 625) scale(.50)" />
            <use href="#pine" transform="translate(1140 655) scale(.24)" />
            <use href="#pine" transform="translate(1190 622) scale(.54)" />
            <use href="#pine" transform="translate(1242 650) scale(.28)" />
            <use href="#pine" transform="translate(1294 617) scale(.58)" />
            <use href="#pine" transform="translate(1346 653) scale(.25)" />
            <use href="#pine" transform="translate(1398 623) scale(.53)" />
            <use href="#pine" transform="translate(1450 651) scale(.27)" />
            <use href="#pine" transform="translate(1502 619) scale(.56)" />
            <use href="#pine" transform="translate(1554 653) scale(.25)" />
            <use href="#pine" transform="translate(1606 623) scale(.53)" />
            <use href="#pine" transform="translate(1658 653) scale(.26)" />
            <use href="#pine" transform="translate(1710 614) scale(.61)" />
            <use href="#pine" transform="translate(1764 647) scale(.31)" />
            <use href="#pine" transform="translate(1816 617) scale(.58)" />
            <use href="#pine" transform="translate(1870 643) scale(.35)" />
          </g>
          <g className="pine-near" opacity="0.96">
            <use href="#pine" transform="translate(36 975) scale(.94)" />
            <use href="#pine" transform="translate(108 997) scale(.74)" />
            <use href="#pine" transform="translate(188 1008) scale(.64)" />
            <use href="#pine" transform="translate(268 998) scale(.73)" />
            <use href="#pine" transform="translate(1120 1000) scale(.72)" />
            <use href="#pine" transform="translate(1238 984) scale(.86)" />
            <use href="#pine" transform="translate(1406 1004) scale(.68)" />
            <use href="#pine" transform="translate(1598 995) scale(.76)" />
            <use href="#pine" transform="translate(1692 1007) scale(.65)" />
            <use href="#pine" transform="translate(1790 984) scale(.88)" />
            <use href="#pine" transform="translate(1878 975) scale(.94)" />
          </g>

          {/* DEPTH GRADE */}
          <rect className="n-grade" x="0" y="700" width="1920" height="380" fill="url(#gradeNight)" />
          <rect className="d-grade" x="0" y="700" width="1920" height="380" fill="url(#gradeDay)" />

          {/* UGV — WALRUS 2.0 */}
          <RadarReturns />
          <g className="ugv-anim" transform={reduceMotion ? "translate(1420 846)" : undefined} opacity={reduceMotion ? 1 : undefined}>
            {!reduceMotion && <animateMotion
              dur={`${ROVER_MOTION.duration.toFixed(1)}s`}
              repeatCount="indefinite"
              rotate="0"
              path="M 1010,848 C 1120,822 1260,824 1380,846 S 1620,874 1780,846"
              keyTimes={ROVER_MOTION.keyTimes}
              keyPoints={ROVER_MOTION.keyPoints}
              calcMode="linear"
            />}
            {!reduceMotion && <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.04;0.88;0.97;1" dur={`${ROVER_MOTION.duration.toFixed(1)}s`} repeatCount="indefinite" />}
            <g transform="scale(1.52)">
            <ellipse className="ugv-shadow" cx="0" cy="30" rx="78" ry="8" />
            <g transform="translate(0 14)">
              <circle className="radar-ring" cx="0" cy="0" r="38" />
              <circle className="radar-ring" cx="0" cy="0" r="70" />
            </g>
            <polygon points="45,-6 45,6 262,35 222,-16" fill="url(#ugvBeam)" className="beam" />
            <ellipse cx="192" cy="25" rx="95" ry="16" fill="url(#ugvSpot)" className="spot" />

            <g className="mote" transform="translate(-45,18)" opacity="0.6">
              <circle r="2.2" className="mote-a" />
              <circle r="1.8" className="mote-b" />
              <circle r="2.5" className="mote-c" />
            </g>

            <line className="hull-line" x1="-25" y1="-22" x2="-35" y2="-45" strokeWidth="1.4" />
            <circle cx="-35" cy="-45" r="1.5" fill="var(--ember)" className="beacon-ember" />

            <polygon className="hull-1" points="-50,5 50,5 40,15 -40,15" />
            <polygon className="hull-2" points="-50,-10 -35,-25 10,-25 35,-15 50,-5 50,5 -50,5" />
            <polygon className="hull-3" points="-35,-22 5,-22 25,-14 -30,-14" />
            <path className="rim-light" d="M-35,-22.5 L5,-22.5 L25,-14.5" strokeWidth="1.1" />

            {/* GPR emitter array — ticks with each wavefront */}
            <rect className="hull-1" x="-20" y="8" width="34" height="5" rx="1" />
            <rect className="emitter" x="-20" y="8" width="34" height="5" rx="1" fill="var(--hud)" />

            <rect className="hull-1" x="-15" y="-35" width="20" height="10" />
            <circle className="hull-3" cx="-5" cy="-35" r="7" />
            <path className="rim-light" d="M-11,-38.5 A7,7 0 0 1 -0.5,-39.5" strokeWidth="1" />
            <circle cx="-1" cy="-35" r="1.5" fill="var(--hud)" className="beacon" />
            <circle cx="-6" cy="-35" r="1.2" fill="var(--ember)" opacity="0.7" />

            {[-35, -10, 15, 40].map((x) => (
              <g key={x} transform={`translate(${x},12)`}>
                <g className="wheel">
                  <circle cx="0" cy="0" r="10" className="hull-1" />
                  <circle cx="0" cy="0" r="5" className="hull-3" />
                  <line className="hull-line" x1="-9" y1="0" x2="9" y2="0" strokeWidth="1.4" />
                  <line className="hull-line" x1="0" y1="-9" x2="0" y2="9" strokeWidth="1.4" />
                </g>
              </g>
            ))}

            <text className="hud" x="-40" y="-56">WALRUS 2.0 · GPR SWEEP</text>

            </g>
          </g>

          {/* DAY BLOOM — final warm light wash */}
          <rect className="d-bloom" x="0" y="0" width="1920" height="1080" fill="url(#dayBloom)" />
        </svg>

      </div>
    </div>
  );
}
