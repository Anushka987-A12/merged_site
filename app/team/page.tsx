import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { SectionAtmosphere } from "@/components/section-atmosphere";

const TEAMS = [
  { title: "The Board", focus: "Technical leadership and project direction." },
  { title: "Electronics", focus: "Sensors, circuits, microcontrollers and system integration." },
  { title: "AI & Robotics", focus: "Autonomy, machine intelligence and robotic systems." },
  { title: "Mechanical", focus: "Vehicle design, durability and performance." },
  { title: "Research", focus: "Research, analysis and technical documentation." },
  { title: "Management", focus: "Planning, coordination and project delivery." },
];

export default function TeamPage() {
  return (
    <main data-background-slot="team" className="relative isolate mx-auto min-h-screen max-w-[1360px] space-y-10 px-5 pb-24 pt-10 md:space-y-14 md:px-10 md:pt-16">
      <SectionAtmosphere variant="team" />
      <header className="border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-8 md:pb-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-commissioner text-4xl font-bold tracking-tight text-[var(--ink)] md:text-6xl">Our team</h1>
            <p className="mt-4 max-w-[64ch] text-sm leading-7 text-[var(--muted-ink)] md:text-base">
              A multidisciplinary student team building autonomous defence systems at MIT Manipal.
            </p>
          </div>
          <Link href="/subsystems" className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.16em] text-[var(--field-accent)]">
            EXPLORE SUBSYSTEMS <IconArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <section aria-label="Team divisions">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TEAMS.map((team) => (
            <article key={team.title} className="group min-h-40 border border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-6 transition-colors hover:border-[color-mix(in_srgb,var(--field-accent)_46%,transparent)] sm:p-7">
              <h3 className="font-commissioner text-2xl font-bold text-[var(--ink)]">{team.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">{team.focus}</p>
            </article>
          ))}
        </div>
      </section>

    </main>
  );
}
