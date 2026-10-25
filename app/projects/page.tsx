import { SectionAtmosphere } from "@/components/section-atmosphere";
import { ProjectsCatalog } from "@/components/projects-catalog";

export default function ProjectsPage() {
  return (
    <main data-background-slot="projects" className="relative isolate mx-auto min-h-screen max-w-[1360px] space-y-10 px-5 pb-24 pt-10 md:space-y-14 md:px-10 md:pt-16">
      <SectionAtmosphere variant="projects" />
      <header className="border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-8 md:pb-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-commissioner text-5xl font-bold tracking-tight text-[var(--ink)] md:text-7xl">Projects &amp; research</h1>
            <p className="mt-4 max-w-[64ch] text-sm leading-7 text-[var(--muted-ink)] md:text-base">
              RUGVED platforms, research and intellectual property.
            </p>
          </div>
          <a href="#research" className="font-mono text-[10px] font-bold tracking-[0.18em] text-[var(--field-accent)]">JUMP TO RESEARCH ↓</a>
        </div>
      </header>
      <ProjectsCatalog />
    </main>
  );
}
