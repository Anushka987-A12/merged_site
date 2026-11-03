import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft, IconArrowUpRight } from "@tabler/icons-react";
import { CapabilityScroller } from "@/components/projects/capability-scroller";
import { ParallaxHero } from "@/components/projects/parallax-hero";
import { ProjectPager } from "@/components/projects/project-pager";
import { SpecStrip } from "@/components/projects/spec-strip";
import { PROJECTS, getProject } from "@/lib/project-data";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${project.subtitle}`,
      description: project.summary,
      images: [{ url: project.image, alt: project.imageAlt }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const index = PROJECTS.findIndex((entry) => entry.slug === project.slug);
  const previousProject =
    PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <main
      data-background-slot="project-detail"
      className="project-detail relative isolate mx-auto min-h-screen max-w-[1360px] px-5 pb-24 pt-8 md:px-10 md:pt-12"
    >
      <Link href="/projects" className="project-back-link">
        <IconArrowLeft className="h-4 w-4" />
        ALL PROJECTS
      </Link>

      <ParallaxHero project={project} />

      <p className="mt-6 max-w-[70ch] text-sm leading-7 text-[var(--muted-ink)] md:text-base">
        {project.summary}
      </p>

      <SpecStrip points={project.keyPoints} />

      <section
        aria-labelledby="capabilities-heading"
        className="mt-16 md:mt-24"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-4">
          <h2
            id="capabilities-heading"
            className="font-commissioner text-2xl font-bold text-[var(--ink)] md:text-3xl"
          >
            Capabilities
          </h2>
          <p className="max-w-[36ch] text-[11px] leading-6 text-[var(--muted-ink)]">
            Scroll the dossier to step through the platform&rsquo;s systems.
          </p>
        </div>

        <CapabilityScroller capabilities={project.capabilities} />
      </section>

      <ProjectPager previous={previousProject} next={nextProject} />

      <footer className="project-source mt-10">
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
