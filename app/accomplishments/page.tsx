import type { Metadata } from "next";
import { IconTrophy } from "@tabler/icons-react";
import { SectionAtmosphere } from "@/components/section-atmosphere";
import { AchievementsTimeline } from "@/components/achievements-timeline";
import { RUGVED_DATA } from "@/lib/rugved-data";

export const metadata: Metadata = {
  title: "Accomplishments",
  description:
    "RUGVED Systems competition results and milestones across robotics, AI, computer vision and defence innovation.",
};

export default function AccomplishmentsPage() {
  return (
    <main
      data-background-slot="accomplishments"
      className="relative isolate mx-auto min-h-screen max-w-[1180px] space-y-10 px-5 pb-24 pt-10 md:space-y-14 md:px-10 md:pt-16"
    >
      <SectionAtmosphere variant="accomplishments" />

      {/* ── Page header ───────────────────────────────── */}
      <header className="border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-8 md:pb-10">
        <h1 className="font-commissioner text-4xl font-bold tracking-tight text-[var(--ink)] md:text-6xl">
          Accomplishments
        </h1>
        <p className="mt-4 max-w-[64ch] text-sm leading-7 text-[var(--muted-ink)] md:text-base">
          Competition results and milestones reported by the RUGVED team across
          robotics, AI and engineering.
        </p>
      </header>

      {/* ── Timeline section ──────────────────────────── */}
      <section aria-labelledby="accomplishments-heading">
        <div className="mb-7 flex items-center gap-3">
          <IconTrophy className="h-5 w-5 text-[var(--signal-accent)]" />
          <h2
            id="accomplishments-heading"
            className="font-commissioner text-2xl font-bold text-[var(--ink)] md:text-3xl"
          >
            Project timeline
          </h2>
        </div>

        {/*
          AchievementsTimeline is a 'use client' component.
          It receives the milestones array from the server-rendered data layer
          so the content is in markup for SEO/no-JS fallback.
        */}
        <AchievementsTimeline milestones={RUGVED_DATA.milestones} />
      </section>
    </main>
  );
}
