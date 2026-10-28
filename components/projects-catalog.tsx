"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight, IconFileText, IconShieldLock } from "@tabler/icons-react";
import { motion } from "motion/react";
import { RUGVED_DATA } from "@/lib/rugved-data";

export function ProjectsCatalog() {
  return (
    <div className="space-y-16 md:space-y-20">
      <section aria-labelledby="platforms-heading">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-4">
          <div>
            <h2 id="platforms-heading" className="font-commissioner text-2xl font-bold text-[var(--ink)] md:text-3xl">Field systems</h2>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {RUGVED_DATA.projects.map((project, index) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group overflow-hidden border border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] transition-colors hover:border-[color-mix(in_srgb,var(--field-accent)_48%,transparent)]"
            >
              <Link href={`/projects/${project.slug}`} className="block">
                <figure className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-raised)]">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index === 0}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                  <span className="absolute left-4 top-4 border border-[color-mix(in_srgb,var(--field-accent)_42%,transparent)] bg-[color-mix(in_srgb,var(--page)_72%,transparent)] px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.14em] text-[var(--field-accent)] backdrop-blur-sm">
                    {project.code} / {project.category}
                  </span>
                </figure>
                <div className="p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--signal-accent)]">
                        {project.subtitle}
                      </p>
                      <h3 className="mt-2 font-commissioner text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">{project.title}</h3>
                    </div>
                    <IconArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--field-accent)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-3 line-clamp-3 max-w-[62ch] text-sm leading-7 text-[var(--muted-ink)]">{project.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.keyPoints.slice(0, 2).map((point) => (
                      <li key={point} className="border border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] px-2.5 py-1.5 font-mono text-[9px] text-[var(--muted-ink)]">{point}</li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.16em] text-[var(--field-accent)]">
                    VIEW PROJECT <IconArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="research" aria-labelledby="research-heading" className="scroll-mt-24">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[color-mix(in_srgb,var(--blue-accent)_24%,transparent)] pb-4">
          <div>
            <h2 id="research-heading" className="font-commissioner text-2xl font-bold text-[var(--ink)] md:text-3xl">Research &amp; patents</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {RUGVED_DATA.research.map((paper, index) => {
            return (
            <motion.article
              key={paper.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="flex flex-col border border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-5 transition-colors hover:border-[color-mix(in_srgb,var(--field-accent)_42%,transparent)]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-[color-mix(in_srgb,var(--blue-accent)_18%,transparent)] pb-3">
                <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-[var(--signal-accent)]">{paper.year}</p>
                <IconFileText className="h-5 w-5 shrink-0 text-[var(--field-accent)]" stroke={1.4} />
              </div>
              <h3 className="mt-4 font-commissioner text-lg font-semibold leading-snug text-[var(--ink)]">{paper.title}</h3>
              {paper.authors && <p className="mt-2 text-xs leading-5 text-[var(--muted-ink)]">{paper.authors}</p>}
              <p className="mt-3 line-clamp-4 text-sm leading-6 text-[var(--muted-ink)]">{paper.summary}</p>
              <div className="mt-auto pt-5">
                {paper.href ? (
                  <a href={paper.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.16em] text-[var(--field-accent)]">
                    READ MORE / {paper.publisher.toUpperCase()} <IconArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <p className="font-mono text-[9px] leading-5 tracking-[0.14em] text-[var(--muted-ink)]">
                    {paper.publisher.toUpperCase()}
                  </p>
                )}
              </div>
            </motion.article>
            );
          })}

          {RUGVED_DATA.patents.map((patent) => {
            return (
              <motion.article
                key={patent.applicationNumber}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                className="flex flex-col border border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-5 transition-colors hover:border-[color-mix(in_srgb,var(--signal-accent)_42%,transparent)]"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[color-mix(in_srgb,var(--blue-accent)_18%,transparent)] pb-3">
                  <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-[var(--signal-accent)]">
                    APPLICATION {patent.applicationNumber}
                  </p>
                  <IconShieldLock className="h-5 w-5 shrink-0 text-[var(--signal-accent)]" stroke={1.4} />
                </div>
                <h3 className="mt-4 font-commissioner text-lg font-semibold leading-snug text-[var(--ink)]">{patent.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">{patent.status}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-6 space-y-1.5 border-t border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] pt-4 text-xs leading-6 text-[var(--muted-ink)]">
          <p>{RUGVED_DATA.disclosures.research}</p>
          <p>{RUGVED_DATA.disclosures.patents}</p>
        </div>
      </section>
    </div>
  );
}
