import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <main className="relative isolate mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-start justify-center px-5 py-24 md:px-10">
      <p className="font-mono text-[10px] font-bold tracking-[0.22em] text-[var(--signal-accent)]">
        SIGNAL LOST / 404
      </p>
      <h1 className="mt-5 font-commissioner text-5xl font-bold tracking-tight text-[var(--ink)] md:text-7xl">
        Page not found.
      </h1>
      <p className="mt-5 max-w-[48ch] text-base leading-8 text-[var(--muted-ink)]">
        That route is outside the current mission map. Head back to the
        platforms or return home.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[var(--field-accent)] px-5 py-3.5 font-mono text-[10px] font-bold tracking-[0.14em] text-[#071720]"
        >
          <IconArrowLeft className="h-4 w-4" /> RETURN HOME
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 border border-[color-mix(in_srgb,var(--blue-accent)_40%,transparent)] px-5 py-3.5 font-mono text-[10px] font-bold tracking-[0.14em] text-[var(--ink)]"
        >
          VIEW PROJECTS
        </Link>
      </div>
    </main>
  );
}
