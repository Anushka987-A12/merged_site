import { IconTrophy } from "@tabler/icons-react";
import { SectionAtmosphere } from "@/components/section-atmosphere";
import { RUGVED_DATA } from "@/lib/rugved-data";

export default function AccomplishmentsPage() {
  return (
    <main data-background-slot="accomplishments" className="relative isolate mx-auto min-h-screen max-w-[1180px] space-y-10 px-5 pb-24 pt-10 md:space-y-14 md:px-10 md:pt-16">
      <SectionAtmosphere variant="team" />
      <header className="border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-8 md:pb-10">
        <h1 className="font-commissioner text-5xl font-bold tracking-tight text-[var(--ink)] md:text-7xl">Accomplishments</h1>
        <p className="mt-4 max-w-[64ch] text-sm leading-7 text-[var(--muted-ink)] md:text-base">
          Competition results and milestones reported by the RUGVED team across robotics, AI and engineering.
        </p>
      </header>

      <section aria-labelledby="accomplishments-heading">
        <div className="mb-7 flex items-center gap-3">
          <IconTrophy className="h-5 w-5 text-[var(--signal-accent)]" />
          <h2 id="accomplishments-heading" className="font-commissioner text-2xl font-bold text-[var(--ink)] md:text-3xl">Project timeline</h2>
        </div>
        <ol className="relative grid max-w-4xl gap-4 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-[color-mix(in_srgb,var(--blue-accent)_26%,transparent)]">
          {RUGVED_DATA.milestones.map((milestone) => (
            <li key={milestone.id} className="relative pl-12">
              <span className="absolute left-3 top-6 z-10 h-3.5 w-3.5 rounded-full border-2 border-[var(--page)] bg-[var(--field-accent)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--field-accent)_44%,transparent)]" />
              <article className="h-full border border-[color-mix(in_srgb,var(--blue-accent)_20%,transparent)] bg-[color-mix(in_srgb,var(--surface)_84%,transparent)] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 font-mono text-[9px] tracking-[0.16em]">
                  <span className="shrink-0 text-[var(--muted-ink)]">{milestone.year}</span>
                </div>
                <h3 className="mt-3 font-commissioner text-xl font-bold text-[var(--ink)]">{milestone.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">{milestone.detail}</p>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
