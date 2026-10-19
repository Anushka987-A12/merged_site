import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight, IconMinus } from "@tabler/icons-react";
import { SectionAtmosphere } from "@/components/section-atmosphere";
import { PROJECTS } from "@/lib/project-data";

export default function ProjectsPage() {
  return (
    <main
      data-background-slot="projects"
      className="relative isolate mx-auto min-h-screen max-w-[1360px] space-y-10 px-5 pb-24 pt-10 md:space-y-14 md:px-10 md:pt-16"
    >
      <SectionAtmosphere variant="projects" />

      <header className="projects-heading border-b pb-8 md:pb-10">
        <div className="mb-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-[var(--muted-ink)]">
          <IconMinus className="h-3 w-3 text-[var(--signal-accent)]" />
          <span>PROJECTS / FIELD PLATFORMS</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-commissioner text-4xl font-bold tracking-tight text-[var(--ink)] md:text-6xl">
              Built for the field.
            </h1>
            <p className="mt-4 max-w-[62ch] text-sm leading-7 text-[var(--muted-ink)] md:text-base">
              Explore RUGVED’s ground and aerial platforms. Open a project for
              its capabilities, current scope and the team’s public references.
            </p>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--field-accent)]">
            02 PLATFORMS
          </span>
        </div>
      </header>

      <section aria-label="RUGVED platforms" className="grid gap-6 lg:grid-cols-2">
        {PROJECTS.map((project) => (
          <article key={project.slug} className="project-overview-card group">
            <Link
              href={"/projects/" + project.slug}
              className="project-overview-card__link"
              aria-label={"View " + project.title + " project details"}
            >
              <figure className="project-overview-card__image">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.035] group-focus-visible:scale-[1.035] sm:p-7"
                  priority={project.slug === "walrus"}
                />
                <figcaption className="project-overview-card__caption">
                  {project.code} · {project.category}
                </figcaption>
              </figure>
              <div className="project-overview-card__body">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--signal-accent)]">
                      {project.subtitle}
                    </span>
                    <h2 className="mt-2 font-commissioner text-3xl font-bold tracking-tight text-[var(--ink)] md:text-4xl">
                      {project.title}
                    </h2>
                  </div>
                  <span className="project-overview-card__arrow" aria-hidden="true">
                    <IconArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-4 max-w-[60ch] text-sm leading-7 text-[var(--muted-ink)]">
                  {project.summary}
                </p>
                <ul className="project-overview-card__points mt-5">
                  {project.keyPoints.slice(0, 3).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.18em] text-[var(--field-accent)]">
                  EXPLORE CAPABILITIES
                  <IconArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
