import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconBrain,
  IconCircuitCapacitor,
  IconRobot,
  IconSettings,
  IconShieldCheck,
} from "@tabler/icons-react";
import { SectionAtmosphere } from "@/components/section-atmosphere";
import { getSubsystem, SUBSYSTEMS } from "@/lib/subsystem-data";

const ICONS = {
  management: IconSettings,
  robotics: IconRobot,
  electronics: IconCircuitCapacitor,
  mechanical: IconShieldCheck,
  research: IconBrain,
};

export function generateStaticParams() {
  return SUBSYSTEMS.map((subsystem) => ({ slug: subsystem.slug }));
}

export default async function SubsystemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subsystem = getSubsystem(slug);
  if (!subsystem) notFound();

  const Icon = ICONS[subsystem.icon];

  return (
    <main
      data-background-slot="subsystems"
      className="relative isolate mx-auto min-h-screen max-w-[1360px] px-5 pb-24 pt-8 md:px-10 md:pt-12"
    >
      <SectionAtmosphere variant="subsystems" />

      <Link
        href="/subsystems"
        className="relative z-10 inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.17em] text-[var(--muted-ink)] transition-colors hover:text-[var(--field-accent)]"
      >
        <IconArrowLeft className="h-4 w-4" /> ALL SUBSYSTEMS
      </Link>

      <section
        style={{ animationDelay: "0ms" }}
        className="subsystem-detail-reveal relative z-10 mt-8 border-y border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] py-7 md:mt-12 md:py-10"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-commissioner text-4xl font-bold tracking-tight text-[var(--ink)] md:text-6xl">
              {subsystem.title}
            </h1>
          </div>
          <div className="flex max-w-[31rem] items-center gap-4 border-l-2 border-[var(--field-accent)] pl-4">
            <Icon className="h-9 w-9 shrink-0 text-[var(--blue-accent)]" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[var(--ink)]">{subsystem.leadRole}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{ animationDelay: "90ms" }}
        className="subsystem-detail-reveal relative z-10 grid gap-8 py-8 md:py-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14"
      >
        <aside className="relative flex min-h-64 flex-col justify-between overflow-hidden border border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-raised)_84%,transparent),var(--page))] p-6 md:min-h-80 md:p-8">
          <span className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--blue-accent)_12%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--blue-accent)_12%,transparent)_1px,transparent_1px)] [background-size:28px_28px]" aria-hidden="true" />
          <div className="relative flex h-full min-h-64 flex-col items-center justify-center text-center">
            <span className="grid h-20 w-20 place-items-center border border-[color-mix(in_srgb,var(--field-accent)_48%,transparent)] bg-[color-mix(in_srgb,var(--field-accent)_8%,transparent)] text-[var(--field-accent)] shadow-[0_0_42px_color-mix(in_srgb,var(--field-accent)_12%,transparent)]">
              <Icon className="h-10 w-10" aria-hidden="true" />
            </span>
            <p className="mt-5 max-w-[30ch] text-sm leading-6 text-[var(--muted-ink)]">
              {subsystem.category}
            </p>
          </div>
        </aside>

        <div className="flex flex-col justify-center gap-7">
          <div className="border-t border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] pt-6">
            <p className="text-base leading-8 text-[var(--ink)]">{subsystem.overview}</p>
          </div>
        </div>
      </section>

      <div className="relative z-10 grid gap-8 border-t border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pt-8 md:grid-cols-2 md:gap-12 md:pt-10">
        <section
          style={{ animationDelay: "170ms" }}
          className="subsystem-detail-reveal"
          aria-labelledby="deliverables-heading"
        >
          <h2 id="deliverables-heading" className="font-commissioner text-2xl font-bold text-[var(--ink)] md:text-3xl">Key deliverables</h2>
          <ul className="mt-6 grid gap-3">
            {subsystem.deliverables.map((deliverable) => (
              <li key={deliverable} className="flex items-start gap-3 border-b border-[color-mix(in_srgb,var(--blue-accent)_16%,transparent)] pb-3 text-sm leading-6 text-[var(--muted-ink)]">
                {deliverable}
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{ animationDelay: "240ms" }}
          className="subsystem-detail-reveal"
          aria-labelledby="focus-heading"
        >
          <h2 id="focus-heading" className="font-commissioner text-2xl font-bold text-[var(--ink)] md:text-3xl">Focus areas</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {subsystem.focus.map((focus) => (
              <div key={focus} className="flex min-h-20 items-center gap-3 border border-[color-mix(in_srgb,var(--blue-accent)_20%,transparent)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] p-4">
                <span className="text-sm font-medium text-[var(--ink)]">{focus}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pt-6">
        <Link href="/subsystems" className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.15em] text-[var(--muted-ink)] transition-colors hover:text-[var(--field-accent)]">
          <IconArrowLeft className="h-4 w-4" /> BACK TO SUBSYSTEMS
        </Link>
        <Link href="/contact" className="inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.15em] text-[var(--field-accent)] transition-colors hover:text-[var(--signal-accent)]">
          CONTACT THE TEAM <IconArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
