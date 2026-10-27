"use client";

import React, { useState } from "react";
import TacticalCard from "@/components/ui/TacticalCard";
import {
  IconUserCheck,
  IconArrowUpRight,
  IconShieldCheck,
  IconSettings,
  IconCircuitCapacitor,
  IconSearch,
  IconRobot,
  IconCpu,
  IconCamera,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { SectionAtmosphere } from "@/components/section-atmosphere";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA: SUBSYSTEM DIVISIONS (Folded in from Rugved Website Subsystems Tab)
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
      "Coordinates team strategy, technical roadmaps, competitions and faculty collaboration across all divisions.",
    deliverables: ["Annual Strategic Roadmap", "Defence Expo Dossiers", "System Architecture Specs"],
  },
  {
    code: "S-04",
    title: "Research",
    category: "Science & Innovation",
    icon: IconSearch,
    leadRole: "Research Director & Paper Authors",
    summary:
      "Studies robotic perception, terrain mapping and sensor fusion, turning results into peer-reviewed research papers and patents.",
    deliverables: ["Peer-Reviewed Papers", "Patent Filings", "Simulation Benchmarks"],
  },
  {
    code: "S-05",
    title: "AI & Robotics",
    category: "Software & Autonomy",
    icon: IconRobot,
    leadRole: "Autonomy & Computer Vision Leads",
    summary:
      "Builds vehicle autonomy with real-time 3D SLAM, edge AI inference, obstacle avoidance and adaptive path planning algorithms.",
    deliverables: ["Autonomous Nav Stack", "Real-Time 3D SLAM", "Computer Vision Models"],
  },
  {
    code: "S-02",
    title: "Management",
    category: "Operations & Logistics",
    icon: IconSettings,
    leadRole: "Operations & PR Leads",
    summary:
      "Plans project schedules, budgets, procurement, industry sponsorships and outreach initiatives for the engineering team.",
    deliverables: ["Sponsorship Pitches", "Budget Audits", "Media Campaigns"],
  },
  {
    code: "S-03",
    title: "Electronics",
    category: "Hardware & Embedded",
    icon: IconCircuitCapacitor,
    leadRole: "Electronics Head & Firmware Engineers",
    summary:
      "Designs custom circuit boards, redundant power delivery systems, sensor telemetry buses and embedded microcontroller firmware.",
    deliverables: ["Custom Motor Drivers", "FPGA Acoustic Board", "Redundant BMS Module"],
  },
  {
    code: "S-06",
    title: "Mechanical",
    category: "Engineering & Chassis",
    icon: IconCpu,
    leadRole: "Mechanical Lead & CAD Specialists",
    summary:
      "Designs rugged tracked chassis, modular payload mounts, suspension dynamics and sealed hardware assemblies for demanding terrain.",
    deliverables: ["All-Terrain Track Assembly", "Armored Chassis", "Modular Payload Bays"],
  },
];

const ORDERED_DIVISIONS = [...DIVISIONS].sort((a, b) =>
  a.code.localeCompare(b.code),
);

export default function TeamPage() {
  const [activeCode, setActiveCode] = useState<string>("S-01");
  const activeDiv = DIVISIONS.find((d) => d.code === activeCode) || DIVISIONS[0];
  const ActiveIcon = activeDiv.icon;

  return (
    <main
      data-background-slot="team"
      className="relative isolate mx-auto max-w-[1360px] min-h-screen px-4 pt-8 pb-24 md:px-8 space-y-8"
    >
      {/* BACKGROUND MOTIF: grid coordinates and scanning beacon */}
      <SectionAtmosphere variant="team" />

      {/* ── HEADER (Centered & Styled) ── */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-4 pb-2 text-center">
        <div className="flex items-center gap-3 tracking-[0.2em] uppercase font-mono text-[11px]">
          <span className="font-bold text-[var(--signal-accent)]">
            {String(DIVISIONS.length).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)]" />
          <span className="font-semibold tracking-widest text-[var(--muted-ink)]">
            Organization Structure
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-commissioner text-[38px] md:text-[54px] font-bold leading-tight tracking-tight text-[var(--ink)]">
            Team &amp; Subsystems
          </h1>
        </motion.div>

        <p className="max-w-[65ch] text-[14px] md:text-[15px] leading-relaxed text-[var(--muted-ink)]">
          Explore RUGVED’s multidisciplinary student engineering divisions, technical leads, and core project deliverables at MIT Manipal.
        </p>
      </div>

      {/* ── HORIZONTAL TAB ROW (Centered on Desktop) ── */}
      <div className="relative">
        <div className="theme-rule flex overflow-x-auto hide-scrollbar gap-2 pb-3 border-b border-[color-mix(in_srgb,var(--blue-accent)_20%,transparent)] md:justify-center">
          {ORDERED_DIVISIONS.map((d) => {
            const isSelected = d.code === activeCode;
            return (
              <button
                key={d.code}
                onClick={() => setActiveCode(d.code)}
                className={`section-tab flex shrink-0 items-center gap-2.5 px-4 py-2.5 transition-all duration-300 text-[14px] font-medium tracking-wide rounded ${
                  isSelected
                    ? "is-active bg-[color-mix(in_srgb,var(--surface-raised)_70%,transparent)] text-[var(--ink)] border-b-2 border-[var(--field-accent)]"
                    : "text-[var(--muted-ink)] hover:text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--surface)_50%,transparent)]"
                }`}
              >
                <span>{d.title}</span>
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
          className="rounded-xl border border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] p-6 md:p-8"
        >
          <div className="flex flex-col">
            {/* Header block */}
            <div className="pb-6 md:pb-8 border-b border-[color-mix(in_srgb,var(--blue-accent)_18%,transparent)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--blue-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--blue-accent)_10%,transparent)] text-[var(--blue-accent)]">
                  <ActiveIcon className="h-7 w-7 opacity-90" />
                </div>
                <div>
                  <div className="text-[12px] tracking-widest uppercase mb-1 font-semibold text-[var(--muted-ink)]">
                    {activeDiv.code} &bull; {activeDiv.leadRole}
                  </div>
                  <h2 className="font-commissioner text-[28px] md:text-[36px] font-bold leading-tight text-[var(--ink)]">
                    {activeDiv.title}
                  </h2>
                </div>
              </div>
              <div className="text-[12px] shrink-0 tracking-wide font-semibold text-[var(--signal-accent)] px-3 py-1 rounded border border-[color-mix(in_srgb,var(--signal-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--signal-accent)_10%,transparent)] w-fit">
                {activeDiv.category}
              </div>
            </div>

            {/* Grid Content: Image Left, Text Right */}
            <div className="grid items-center gap-8 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-8">
              {/* Division identity panel (photography slot designed as intentional record) */}
              <div className="group relative flex min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-lg border border-[color-mix(in_srgb,var(--blue-accent)_25%,transparent)] bg-[radial-gradient(ellipse_at_20%_0%,color-mix(in_srgb,var(--field-accent)_12%,transparent),transparent_52%),linear-gradient(145deg,color-mix(in_srgb,var(--surface-raised)_72%,transparent),var(--page))] p-5 lg:min-h-[340px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--blue-accent)_14%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--blue-accent)_14%,transparent)_1px,transparent_1px)] [background-size:32px_32px]"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[var(--field-accent)]">
                    {activeDiv.code} / FIELD RECORD
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.16em] text-[var(--muted-ink)]">
                    IMAGE PENDING
                  </span>
                </div>
                <div className="relative flex flex-1 items-center justify-center py-8">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--field-accent)_32%,transparent)] bg-[color-mix(in_srgb,var(--page)_48%,transparent)] text-[var(--field-accent)] shadow-[0_0_46px_color-mix(in_srgb,var(--field-accent)_16%,transparent)] transition-transform duration-500 group-hover:scale-105">
                    <ActiveIcon className="h-10 w-10 opacity-90" />
                  </div>
                </div>
                <div className="relative flex items-end justify-between gap-4 border-t border-[color-mix(in_srgb,var(--blue-accent)_16%,transparent)] pt-4">
                  <p className="max-w-[26ch] text-[11px] leading-5 tracking-wide text-[var(--muted-ink)]">
                    Division photography will be published here.
                  </p>
                  <IconCamera className="h-4 w-4 shrink-0 text-[var(--blue-accent)] opacity-60" />
                </div>
              </div>

              {/* Text & deliverables */}
              <div className="py-2 flex flex-col justify-center space-y-7">
                {/* Summary */}
                <div className="space-y-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--signal-accent)]">
                    Role Summary
                  </div>
                  <p className="text-[15px] md:text-[16px] leading-relaxed text-[var(--ink)] font-normal">
                    {activeDiv.summary}
                  </p>
                </div>

                {/* Deliverables (Tags) */}
                <div className="space-y-3 border-t border-[color-mix(in_srgb,var(--blue-accent)_16%,transparent)] pt-6">
                  <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--field-accent)]">
                    Key Deliverables
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {activeDiv.deliverables.map((del) => (
                      <span
                        key={del}
                        className="inline-flex items-center gap-2 rounded border border-[color-mix(in_srgb,var(--field-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--field-accent)_10%,transparent)] px-3 py-1 text-[13px] font-medium text-[var(--ink)]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--field-accent)] shadow-[0_0_6px_var(--field-accent)]" />
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

      {/* ── RECRUITMENT CALLOUT BANNER ── */}
      <TacticalCard
        glowColor="rgba(255, 173, 94, 0.12)"
        className="p-8 md:p-10 border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]"
      >
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--field-accent)]">
              <IconUserCheck className="h-4 w-4" /> Join us &bull; MIT Manipal students
            </div>
            <h2 className="mt-3 font-commissioner text-[24px] font-bold text-[var(--ink)] md:text-[30px]">
              Join the Team
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted-ink)]">
              Join our electronics, mechanical, research or computing teams and build real-world defence robotics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:justify-end gap-3 text-[13px]">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--field-accent)] px-6 py-3.5 font-bold text-[#071720] hover:bg-[color-mix(in_srgb,var(--field-accent)_85%,white)] transition-colors shadow-[0_0_20px_color-mix(in_srgb,var(--field-accent)_25%,transparent)]"
            >
APPLY TO JOIN <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </TacticalCard>
    </main>
  );
}
