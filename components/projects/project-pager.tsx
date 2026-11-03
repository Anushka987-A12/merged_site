import Link from "next/link";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import type { Project } from "@/lib/project-data";

export function ProjectPager({
  previous,
  next,
}: {
  previous: Project;
  next: Project;
}) {
  return (
    <nav
      aria-label="Project pagination"
      className="mt-16 grid grid-cols-1 gap-px border-y border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] sm:grid-cols-2"
    >
      <Link
        href={`/projects/${previous.slug}`}
        className="group flex flex-col gap-3 bg-[color-mix(in_srgb,var(--surface)_72%,var(--page))] p-5 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--signal-accent)] md:p-6"
      >
        <span className="inline-flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.18em] text-[var(--muted-ink)]">
          <IconArrowLeft className="h-3.5 w-3.5" />
          PREVIOUS
        </span>
        <span className="font-commissioner text-xl font-bold tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--field-accent)] md:text-2xl">
          {previous.title}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted-ink)]">
          {previous.code} · {previous.category}
        </span>
      </Link>

      <Link
        href={`/projects/${next.slug}`}
        className="group flex flex-col items-end gap-3 bg-[color-mix(in_srgb,var(--surface)_72%,var(--page))] p-5 text-right focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--signal-accent)] md:p-6"
      >
        <span className="inline-flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.18em] text-[var(--muted-ink)]">
          NEXT
          <IconArrowRight className="h-3.5 w-3.5" />
        </span>
        <span className="font-commissioner text-xl font-bold tracking-tight text-[var(--ink)] transition-colors group-hover:text-[var(--field-accent)] md:text-2xl">
          {next.title}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted-ink)]">
          {next.code} · {next.category}
        </span>
      </Link>
    </nav>
  );
}
