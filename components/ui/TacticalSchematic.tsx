"use client";
import React, { useState, useEffect } from "react";
import {
  IconRadar,
  IconCpu,
  IconTarget,
  IconBolt,
  IconShield,
  IconEye,
  IconActivity,
  IconLayersLinked,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

interface SubsystemHotspot {
  id: string;
  name: string;
  code: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  coords: { x: number; y: number }; // Percentage coords on blueprint (0-100)
  status: "OPTIMAL" | "STANDBY" | "ACTIVE" | "ENGAGED";
  latency: string;
  specs: { label: string; value: string }[];
  description: string;
}

const HOTSPOTS: SubsystemHotspot[] = [
  {
    id: "lidar-optics",
    name: "360° Solid-State LiDAR & Stereo Pod",
    code: "OPT-01",
    category: "Perception and sensors",
    icon: IconEye,
    coords: { x: 50, y: 22 },
    status: "ACTIVE",
    latency: "4.2 ms",
    specs: [
      { label: "RANGE", value: "250m @ 90% Reflectivity" },
      { label: "FOV", value: "360° Horiz × 45° Vert" },
      { label: "POINT CLOUD", value: "1.2M pts/sec" },
      { label: "SPECTRAL", value: "Dual IR + RGB-D" },
    ],
    description:
      "Primary environmental perception mast. Generates real-time 3D point cloud maps fused with thermal imaging for dense fog, smoke, and zero-light obstacle segmentation.",
  },
  {
    id: "neural-compute",
    name: "AI Edge Compute & SLAM Core",
    code: "CMP-02",
    category: "Autonomy and compute",
    icon: IconCpu,
    coords: { x: 50, y: 48 },
    status: "OPTIMAL",
    latency: "1.8 ms",
    specs: [
      { label: "PROCESSOR", value: "NVIDIA Jetson AGX Orin" },
      { label: "FRAMEWORK", value: "ROS2 Humble + RTAB-Map" },
      { label: "INFERENCE", value: "275 TOPS (INT8)" },
      { label: "NAVIGATION", value: "AI Terrain Classifier" },
    ],
    description:
      "Hardened real-time compute unit. Runs edge deep learning models for autonomous waypoint navigation, terrain trafficability estimation, and self-recovery path planning.",
  },
  {
    id: "acoustic-gunshot",
    name: "FPGA Acoustic Gunshot Triangulation",
    code: "ACT-03",
    category: "Defence detection",
    icon: IconTarget,
    coords: { x: 26, y: 34 },
    status: "ENGAGED",
    latency: "0.4 ms",
    specs: [
      { label: "SAMPLING", value: "192 kHz Microsecond Sync" },
      { label: "ANGULAR ACC", value: "±1.8° Azimuth" },
      { label: "DETECTION", value: "Supersonic Shockwave" },
      { label: "CHIPSET", value: "Xilinx Artix-7 FPGA" },
    ],
    description:
      "Microsecond acoustic sensor array. Triangulates muzzle blasts and supersonic projectile shockwaves to instantly feed shooter coordinates into the mission battle-network.",
  },
  {
    id: "modular-payload",
    name: "Quick-Swap Mission Payload Bay",
    code: "PLD-04",
    category: "Mission payload",
    icon: IconLayersLinked,
    coords: { x: 50, y: 72 },
    status: "STANDBY",
    latency: "12 ms",
    specs: [
      { label: "PAYLOAD CAP", value: "45 kg Continuous" },
      { label: "INTERFACE", value: "Universal CAN / RS485 / GigE" },
      { label: "MODULES", value: "EOD Arm / Mine Array / Drone Dock" },
      { label: "SWAP TIME", value: "< 90 Seconds in Field" },
    ],
    description:
      "Universal electromechanical docking bay. Accommodates explosive ordnance disposal (EOD) manipulators, ground-penetrating radar, or tethered reconnaissance UAV scouts.",
  },
  {
    id: "track-drivetrain",
    name: "All-Terrain Dual-Track Powertrain",
    code: "DRV-05",
    category: "Mechanical propulsion",
    icon: IconBolt,
    coords: { x: 80, y: 60 },
    status: "OPTIMAL",
    latency: "2.1 ms",
    specs: [
      { label: "MOTORS", value: "Dual 2.4kW High-Torque BLDC" },
      { label: "INCLINE", value: "45° Gradient Clearance" },
      { label: "TURNING", value: "Zero-Radius Pivot Turn" },
      { label: "TOP SPEED", value: "22 km/h Off-Road" },
    ],
    description:
      "Reinforced rubber-composite track assembly with independent planetary gearboxes. Engineered for high-friction mud, loose gravel, staircase ascent, and trench crossing.",
  },
  {
    id: "power-cell",
    name: "Swappable LiFePO4 Tactical Power Pack",
    code: "PWR-06",
    category: "Electronics and power",
    icon: IconShield,
    coords: { x: 20, y: 68 },
    status: "OPTIMAL",
    latency: "0.1 ms",
    specs: [
      { label: "CAPACITY", value: "48V 1.2 kWh (Expandable)" },
      { label: "ENDURANCE", value: "6.5h Continuous Ops" },
      { label: "CHEMISTRY", value: "Military-Grade LiFePO4" },
      { label: "BMS", value: "Dual Redundant Isolated CAN" },
    ],
    description:
      "Ruggedized, IP67 sealed battery module featuring active cell balancing, thermal runaway suppression, and rapid hot-swap capabilities under combat conditions.",
  },
];

export const TacticalSchematic: React.FC = () => {
  const [activeId, setActiveId] = useState<string>("lidar-optics");
  const [simTelemetry, setSimTelemetry] = useState({
    busVoltage: 49.2,
    cpuTemp: 44.8,
    signalDbm: -58,
    imuPitch: 0.4,
  });

  const activeHotspot = HOTSPOTS.find((h) => h.id === activeId) || HOTSPOTS[0];

  useEffect(() => {
    const interval = setInterval(() => {
      setSimTelemetry({
        busVoltage: +(48.8 + Math.random() * 0.8).toFixed(1),
        cpuTemp: +(43.5 + Math.random() * 2.4).toFixed(1),
        signalDbm: -(54 + Math.floor(Math.random() * 8)),
        imuPitch: +(Math.sin(Date.now() / 1000) * 1.2).toFixed(1),
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#c2b8a3]/15 bg-[#0a0d0a]/90 backdrop-blur-2xl shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8)]">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c2b8a3]/12 bg-[#111410]/90 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c2b8a3]/25 bg-black/40 font-mono text-[11px] font-bold text-[#c2b8a3]">
            W2
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold tracking-[0.2em] text-[#e8e6dc]">
                WALRUS 2.0 Tactical Schematic
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                TELEMETRY LIVE
              </span>
            </div>
            <div className="font-mono text-[10px] tracking-[0.16em] text-[#8b8f6b]">
              INTERACTIVE SUBSYSTEM INSPECTOR • CLICK HOTSPOTS TO QUERY ARCHITECTURE
            </div>
          </div>
        </div>

        {/* Live System Diagnostics strip */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-[10px] tracking-wider text-[#8b8f6b]">
          <div className="border-r border-[#c2b8a3]/10 pr-4">
            PWR: <span className="text-[#e8e6dc] font-bold">{simTelemetry.busVoltage}V</span>
          </div>
          <div className="border-r border-[#c2b8a3]/10 pr-4">
            CORE: <span className="text-[#e8e6dc] font-bold">{simTelemetry.cpuTemp}°C</span>
          </div>
          <div className="border-r border-[#c2b8a3]/10 pr-4">
            LINK: <span className="text-[#e8e6dc] font-bold">{simTelemetry.signalDbm} dBm</span>
          </div>
          <div>
            IMU: <span className="text-[#e8e6dc] font-bold">{simTelemetry.imuPitch}°</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Schematic Left, Inspector Right */}
      <div className="grid lg:grid-cols-[1.25fr_0.95fr] divide-y lg:divide-y-0 lg:divide-x divide-[#c2b8a3]/12">
        {/* Left: Interactive Vector Schematic Blueprint */}
        <div className="relative flex flex-col items-center justify-center p-6 md:p-10 tactical-grid-bg">
          {/* Subtle Radar Sweep Ring */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
            <div className="h-[380px] w-[380px] rounded-full border border-[#8b8f6b]/30 animate-radar-ping" />
            <div className="absolute h-[240px] w-[240px] rounded-full border border-dashed border-[#8b8f6b]/40" />
            <div className="absolute h-[120px] w-[120px] rounded-full border border-[#c2b8a3]/30" />
          </div>

          {/* Blueprint SVG Representation */}
          <div className="relative w-full max-w-[480px] aspect-[4/5] flex items-center justify-center">
            <svg
              viewBox="0 0 400 500"
              className="w-full h-full select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="treadGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e241c" />
                  <stop offset="50%" stopColor="#2c3328" />
                  <stop offset="100%" stopColor="#1e241c" />
                </linearGradient>
                <linearGradient id="chassisGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a2018" />
                  <stop offset="100%" stopColor="#0f130e" />
                </linearGradient>
                <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(194,184,163,0.06)" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Grid backdrop */}
              <rect width="400" height="500" fill="url(#gridPattern)" />

              {/* Crosshair target rings */}
              <circle cx="200" cy="250" r="180" stroke="rgba(139,143,107,0.15)" strokeWidth="1" />
              <circle cx="200" cy="250" r="120" stroke="rgba(139,143,107,0.2)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="250" x2="380" y2="250" stroke="rgba(139,143,107,0.15)" strokeWidth="1" strokeDasharray="2 6" />
              <line x1="200" y1="30" x2="200" y2="470" stroke="rgba(139,143,107,0.15)" strokeWidth="1" strokeDasharray="2 6" />

              {/* Left Track Assembly */}
              <rect x="50" y="90" width="55" height="320" rx="14" fill="url(#treadGrad)" stroke="#8b8f6b" strokeWidth="1.5" />
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={`lt-${i}`} x1="50" y1={110 + i * 20} x2="105" y2={110 + i * 20} stroke="#8b8f6b" strokeWidth="1" opacity="0.4" />
              ))}
              {/* Left Bogie Wheels */}
              <circle cx="77" cy="125" r="16" fill="#111410" stroke="#c2b8a3" strokeWidth="1.2" />
              <circle cx="77" cy="190" r="14" fill="#111410" stroke="#8b8f6b" strokeWidth="1" />
              <circle cx="77" cy="250" r="14" fill="#111410" stroke="#8b8f6b" strokeWidth="1" />
              <circle cx="77" cy="310" r="14" fill="#111410" stroke="#8b8f6b" strokeWidth="1" />
              <circle cx="77" cy="375" r="16" fill="#111410" stroke="#c2b8a3" strokeWidth="1.2" />

              {/* Right Track Assembly */}
              <rect x="295" y="90" width="55" height="320" rx="14" fill="url(#treadGrad)" stroke="#8b8f6b" strokeWidth="1.5" />
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={`rt-${i}`} x1="295" y1={110 + i * 20} x2="350" y2={110 + i * 20} stroke="#8b8f6b" strokeWidth="1" opacity="0.4" />
              ))}
              {/* Right Bogie Wheels */}
              <circle cx="322" cy="125" r="16" fill="#111410" stroke="#c2b8a3" strokeWidth="1.2" />
              <circle cx="322" cy="190" r="14" fill="#111410" stroke="#8b8f6b" strokeWidth="1" />
              <circle cx="322" cy="250" r="14" fill="#111410" stroke="#8b8f6b" strokeWidth="1" />
              <circle cx="322" cy="310" r="14" fill="#111410" stroke="#8b8f6b" strokeWidth="1" />
              <circle cx="322" cy="375" r="16" fill="#111410" stroke="#c2b8a3" strokeWidth="1.2" />

              {/* Central Armored Hull Chassis */}
              <path
                d="M 120 120 L 150 70 L 250 70 L 280 120 L 275 420 L 200 440 L 125 420 Z"
                fill="url(#chassisGrad)"
                stroke="#c2b8a3"
                strokeWidth="1.8"
              />

              {/* Hull Armor Ribs */}
              <path d="M 140 140 L 260 140 L 250 380 L 150 380 Z" stroke="#8b8f6b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

              {/* Forward Sensor Pod / LiDAR Turret Base */}
              <polygon points="170,110 230,110 220,150 180,150" fill="#252d22" stroke="#c2b8a3" strokeWidth="1.5" />
              <circle cx="200" cy="110" r="22" fill="#111410" stroke="#34d399" strokeWidth="1.8" />
              <circle cx="200" cy="110" r="10" fill="#1a2e22" stroke="#34d399" strokeWidth="1" />
              <circle cx="200" cy="110" r="3" fill="#34d399" />

              {/* Compute Bay (Center) */}
              <rect x="155" y="210" width="90" height="70" rx="6" fill="#171c15" stroke="#c2b8a3" strokeWidth="1.2" />
              <rect x="165" y="222" width="70" height="46" rx="3" fill="#0f130e" stroke="#8b8f6b" strokeWidth="0.8" />
              <line x1="175" y1="235" x2="225" y2="235" stroke="#8b8f6b" strokeWidth="1" opacity="0.6" />
              <line x1="175" y1="245" x2="215" y2="245" stroke="#8b8f6b" strokeWidth="1" opacity="0.6" />
              <line x1="175" y1="255" x2="220" y2="255" stroke="#8b8f6b" strokeWidth="1" opacity="0.6" />

              {/* Rear Modular Payload / Battery Area */}
              <rect x="145" y="310" width="110" height="85" rx="6" fill="#1e241c" stroke="#c2b8a3" strokeWidth="1.2" />
              <rect x="155" y="322" width="42" height="60" rx="3" fill="#121611" stroke="#8b8f6b" strokeWidth="0.8" />
              <rect x="203" y="322" width="42" height="60" rx="3" fill="#121611" stroke="#8b8f6b" strokeWidth="0.8" />

              {/* Acoustic Sensors (Front Left / Right) */}
              <circle cx="130" cy="170" r="7" fill="#1c2419" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="270" cy="170" r="7" fill="#1c2419" stroke="#fbbf24" strokeWidth="1.5" />

              {/* Front Tow Eyes */}
              <rect x="150" y="62" width="12" height="8" rx="2" fill="#8b8f6b" />
              <rect x="238" y="62" width="12" height="8" rx="2" fill="#8b8f6b" />
            </svg>

            {/* Interactive Hotspot Buttons Overlay */}
            {HOTSPOTS.map((hotspot) => {
              const isSelected = hotspot.id === activeId;
              const Icon = hotspot.icon;
              return (
                <button
                  key={hotspot.id}
                  onClick={() => setActiveId(hotspot.id)}
                  style={{ left: `${hotspot.coords.x}%`, top: `${hotspot.coords.y}%` }}
                  className="group/hotspot absolute -translate-x-1/2 -translate-y-1/2 z-20 focus:outline-none"
                  aria-label={`Inspect ${hotspot.name}`}
                >
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    {/* Ping Wave when selected */}
                    {isSelected && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    )}
                    {/* Outer border ring */}
                    <span
                      className={`relative inline-flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 ${
                        isSelected
                          ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.8)] scale-110"
                          : "border-[#c2b8a3]/40 bg-[#111410]/90 text-[#c2b8a3] hover:border-emerald-400 hover:scale-105"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {/* Micro code pill */}
                    <span
                      className={`absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border px-1.5 py-0.2 font-mono text-[8px] font-bold transition-all ${
                        isSelected
                          ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-300"
                          : "border-[#c2b8a3]/20 bg-black/80 text-[#8b8f6b] opacity-0 group-hover/hotspot:opacity-100"
                      }`}
                    >
                      {hotspot.code}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Hotspot Select Row below blueprint */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {HOTSPOTS.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveId(h.id)}
                className={`rounded border px-2.5 py-1 font-mono text-[10px] tracking-wider transition-all ${
                  h.id === activeId
                    ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-bold"
                    : "border-[#c2b8a3]/12 bg-black/30 text-[#8b8f6b] hover:border-[#c2b8a3]/30 hover:text-[#c2b8a3]"
                }`}
              >
                {h.code} • {h.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Subsystem Telemetry & Architecture Detail */}
        <div className="flex flex-col justify-between p-6 md:p-8 bg-[#0e110e]/70">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHotspot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Category & Status Banner */}
              <div className="flex items-center justify-between">
                <div className="font-mono text-[11px] tracking-[0.22em] text-[#8b8f6b]">
                  {activeHotspot.category}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-wider text-[#8b8f6b]">
                    LATENCY: <span className="text-[#c2b8a3]">{activeHotspot.latency}</span>
                  </span>
                  <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                    ● {activeHotspot.status}
                  </span>
                </div>
              </div>

              {/* Title & Code */}
              <div>
                <div className="font-mono text-[12px] font-bold text-emerald-400/90">
                  REF: {activeHotspot.code}
                </div>
                <h3 className="mt-1 font-mono text-[22px] font-bold tracking-tight text-[#f2efe6] md:text-[24px]">
                  {activeHotspot.name}
                </h3>
              </div>

              {/* Description */}
              <p className="font-mono text-[13px] leading-relaxed text-[#c2b8a3]/90 border-l-2 border-emerald-500/30 pl-3">
                {activeHotspot.description}
              </p>

              {/* Technical Specifications Grid */}
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#8b8f6b]">
                  <IconActivity className="h-3.5 w-3.5 text-[#c2b8a3]" /> ARCHITECTURE SPECIFICATIONS
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2.5 font-mono">
                  {activeHotspot.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded border border-[#c2b8a3]/12 bg-black/40 p-3"
                    >
                      <div className="text-[10px] tracking-[0.16em] text-[#8b8f6b]">
                        {spec.label}
                      </div>
                      <div className="mt-1 text-[13px] font-bold text-[#e8e6dc]">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Live Architecture Directive */}
          <div className="mt-6 pt-5 border-t border-[#c2b8a3]/12 flex items-center justify-between font-mono text-[11px] tracking-wider text-[#8b8f6b]">
            <span className="inline-flex items-center gap-1.5">
              <IconRadar className="h-4 w-4 text-[#c2b8a3]" /> BUS: CAN 2.0B / ROS2 NODE STREAM
            </span>
            <span className="text-emerald-400 font-bold">Secure channel · AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacticalSchematic;
