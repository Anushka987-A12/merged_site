import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft, IconArrowUpRight } from "@tabler/icons-react";
import { CapabilityAnimation } from "@/components/capability-animation";
import { PROJECTS, getProject } from "@/lib/project-data";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <main
      data-background-slot="project-detail"
      className="project-detail relative isolate mx-auto min-h-screen max-w-[1360px] px-5 pb-24 pt-8 md:px-10 md:pt-12"
    >
      <Link href="/projects" className="project-back-link">
        <IconArrowLeft className="h-4 w-4" />
        ALL PROJECTS
      </Link>

      <section className="project-detail__hero">
        <figure className="project-detail__image">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-contain p-5 sm:p-9"
            priority
          />
          <figcaption>
            {project.code} · {project.category}
          </figcaption>
        </figure>

        <div className="project-detail__intro">
          <div className="font-mono text-[10px] tracking-[0.22em] text-[var(--signal-accent)]">
            {project.category}
          </div>
          <h1 className="mt-3 font-commissioner text-5xl font-bold tracking-[-0.04em] text-[var(--ink)] md:text-7xl">
            {project.title}
          </h1>
          <p className="mt-3 font-mono text-xs tracking-[0.12em] text-[var(--field-accent)]">
            {project.subtitle}
          </p>
          <p className="mt-6 max-w-[56ch] text-base leading-8 text-[var(--muted-ink)]">
            {project.summary}
          </p>
          <ul className="project-detail__key-points mt-7">
            {project.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="project-capabilities mt-16 md:mt-24">
        <div className="project-section-heading">
          <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--signal-accent)]">
            CAPABILITIES
          </span>
          <h2 className="mt-3 font-commissioner text-3xl font-bold tracking-tight text-[var(--ink)] md:text-4xl">
            Designed around the mission.
          </h2>
          <p className="mt-3 max-w-[62ch] text-sm leading-7 text-[var(--muted-ink)]">
            Focus or hover a capability to see a short system-style animation.
            Every description stays visible without interaction.
          </p>
        </div>

        <div className="project-capabilities__grid mt-8">
          {project.capabilities.map((capability, index) => (
            <article
              key={capability.title}
              className="capability-card"
              tabIndex={0}
              aria-label={capability.title + ": " + capability.summary}
            >
              <CapabilityAnimation
                kind={capability.animation}
                label={"CAP-" + String(index + 1).padStart(2, "0")}
              />
              <div className="capability-card__copy">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--signal-accent)]">
                  CAPABILITY / {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-xl font-bold text-[var(--ink)]">
                  {capability.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">
                  {capability.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="project-source mt-14">
        <p>
          Capabilities are summarized from the RUGVED brochure. Contact the
          team for current implementation status and technical specifications.
        </p>
        <a href={project.sourceUrl} target="_blank" rel="noreferrer">
          {project.sourceLabel}
          <IconArrowUpRight className="h-4 w-4" />
        </a>
      </footer>
    </main>
  );
}
