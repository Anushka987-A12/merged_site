"use client";
import React, { useState } from "react";
import {
  IconShieldCheck,
  IconSettings,
  IconCircuitCapacitor,
  IconSearch,
  IconRobot,
  IconCpu,
  IconCamera,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionAtmosphere } from "@/components/section-atmosphere";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
interface Division {
  code: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  leadRole: string;
  summary: string;
  deliverables: string[];
}

const DIVISIONS: Division[] = [
  {
    code: "S-01",
    title: "The Board",
    category: "Command & Strategy",
    icon: IconShieldCheck,
    leadRole: "Team Lead & Technical Directors",
    summary:
      "Coordinates team strategy, technical roadmaps, competitions and faculty collaboration.",
    deliverables: ["Annual Strategic Roadmap", "Defence Expo Dossiers", "System Architecture Specs"],
  },
  {
    code: "S-04",
    title: "Research",
    category: "Science & Innovation",
    icon: IconSearch,
    leadRole: "Research Director & Paper Authors",
    summary:
      "Studies robotic perception, terrain mapping and sensor fusion, turning results into papers and patents.",
    deliverables: ["Peer-Reviewed Papers", "Patent Filings", "Simulation Benchmarks"],
  },
  {
    code: "S-05",
    title: "Ai and Robotics",
    category: "Software & Autonomy",
    icon: IconRobot,
    leadRole: "Autonomy & Computer Vision Leads",
    summary:
      "Builds vehicle autonomy with 3D SLAM, edge AI, obstacle detection and adaptive path planning.",
    deliverables: ["Autonomous Nav Stack", "Real-Time 3D SLAM", "Computer Vision Models"],
  },
  {
    code: "S-02",
    title: "Management",
    category: "Operations & Logistics",
    icon: IconSettings,
    leadRole: "Operations & PR Leads",
    summary:
      "Plans schedules, budgets, procurement, sponsorships and outreach for the engineering team.",
    deliverables: ["Sponsorship Pitches", "Budget Audits", "Media Campaigns"],
  },
  {
    code: "S-03",
    title: "Electronics",
    category: "Hardware & Embedded",
    icon: IconCircuitCapacitor,
    leadRole: "Electronics Head & Firmware Engineers",
    summary:
      "Designs circuit boards, power systems, telemetry and embedded firmware for our platforms.",
    deliverables: ["Custom Motor Drivers", "FPGA Acoustic Board", "Redundant BMS Module"],
  },
  {
    code: "S-06",
    title: "Mechanical",
    category: "Engineering & Chassis",
    icon: IconCpu,
    leadRole: "Mechanical Lead & CAD Specialists",
    summary:
      "Designs tracked chassis, modular payload mounts and sealed hardware for demanding terrain.",
    deliverables: ["All-Terrain Track Assembly", "Armored Chassis", "Modular Payload Bays"],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

export default function SubsystemsPage() {
  const [activeCode, setActiveCode] = useState<string>("S-01");
  const activeDiv = DIVISIONS.find((d) => d.code === activeCode) || DIVISIONS[0];
  const ActiveIcon = activeDiv.icon;
  
  // Keep shared colors theme-driven while tabs use a simple active underline.
  const colors = {
    textPrimary: "text-[var(--ink)]",
    textSecondary: "text-[var(--muted-ink)]",
  };

  return (
    <>
      {/* ── GLOBAL FONT OVERRIDE: IBM PLEX SERIF ── */}
      {/* BACKGROUND SLOT: subsystems page placeholder. */}
      <main data-background-slot="subsystems" className="relative isolate mx-auto max-w-[1360px] min-h-screen px-4 pt-6 pb-20 md:px-8 space-y-6">
        {/* BACKGROUND MOTIF: circuit paths and signal pulses. */}
        <SectionAtmosphere variant="subsystems" />
        
        {/* ── HEADER (Centered & Shifted Up) ── */}
        <div className="flex flex-col items-center justify-center space-y-2 pt-2 pb-2">
          <div className="flex items-center gap-3 tracking-[0.15em] uppercase text-[11px]">
            <span className="font-bold text-[var(--signal-accent)]">
              05
            </span>
            <span className={`font-semibold tracking-widest ${colors.textSecondary}`}>
              Organization Structure
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={`text-[42px] md:text-[56px] font-bold leading-none tracking-tight ${colors.textPrimary}`}>
              SubSystems
            </h1>
          </motion.div>
        </div>

        {/* ── HORIZONTAL TAB ROW (Centered on Desktop) ── */}
        <div className="relative">
          <div className="theme-rule flex overflow-x-auto hide-scrollbar gap-2 pb-3 border-b md:justify-center">
            {DIVISIONS.map((d) => {
              const isSelected = d.code === activeCode;
              return (
                <button
                  key={d.code}
                  onClick={() => setActiveCode(d.code)}
                  className={`section-tab flex shrink-0 items-center gap-2.5 px-4 py-2.5 transition-all duration-300 ${
                    isSelected
                      ? "is-active"
                      : ""
                  }`}
                >
                  <span className="text-[14px] font-medium tracking-wide">
                    {d.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ACTIVE DIVISION DOSSIER (Layered Matte Design) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDiv.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="theme-rule border-y py-5 md:py-8"
          >
            <div className="flex flex-col">
              
              {/* Header block */}
              <div className="theme-rule p-0 pb-6 md:pb-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[var(--blue-accent)]">
                    <ActiveIcon className="h-8 w-8 opacity-90" />
                  </div>
                  <div>
                    <div className={`text-[11px] tracking-widest uppercase mb-1 font-medium ${colors.textSecondary}`}>
                      {activeDiv.code} / {activeDiv.leadRole}
                    </div>
                    <h2 className={`text-[28px] md:text-[36px] font-bold leading-none ${colors.textPrimary}`}>
                      {activeDiv.title}
                    </h2>
                  </div>
                </div>
                <div className="text-[12px] shrink-0 tracking-wide font-semibold text-[var(--signal-accent)]">
                  {activeDiv.category}
                </div>
              </div>

              {/* Grid Content: Image Left, Text Right */}
              <div className="grid items-center gap-8 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-8">
                
                {/* ── PHOTO PLACEHOLDER ── */}
                <div className="w-full min-h-[220px] lg:min-h-[360px] flex flex-col items-center justify-center group transition-colors">
                  <IconCamera className="h-8 w-8 mb-3 text-[var(--blue-accent)] opacity-50 group-hover:opacity-90 transition-opacity" />
                  <p className={`text-sm tracking-wide font-light ${colors.textSecondary}`}>
                    Reserved for {activeDiv.title} Division Photos
                  </p>
                </div>

                {/* ── TEXT & DELIVERABLES ── */}
                <div className="py-4 flex flex-col justify-center space-y-8">
                  
                  {/* Summary */}
                  <div className="space-y-4">
                    <div className={`text-[11px] uppercase tracking-[0.2em] font-bold ${colors.textSecondary}`}>
                      Role Summary
                    </div>
                    <p className={`line-clamp-3 text-[15px] md:text-[16px] leading-relaxed ${colors.textPrimary}`}>
                      {activeDiv.summary}
                    </p>
                  </div>

                  {/* Deliverables (Tags) */}
                  <div className="theme-rule space-y-4 border-t pt-5">
                    <div className={`text-[11px] uppercase tracking-[0.2em] font-bold ${colors.textSecondary}`}>
                      Key Deliverables
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {activeDiv.deliverables.map((del) => (
                        <span
                          key={del}
                          className={`inline-flex items-center gap-2 text-[13px] font-medium ${colors.textPrimary}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--field-accent)]" />
                          {del}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </main>
    </>
  );
}
