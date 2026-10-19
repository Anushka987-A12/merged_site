import Link from "next/link";
import { IconArrowUpRight, IconFileText, IconMinus } from "@tabler/icons-react";
import {
  PATENTS,
  PATENT_DISCLOSURE,
  RESEARCH,
  RESEARCH_DISCLOSURE,
} from "@/lib/research-data";
import { SectionAtmosphere } from "@/components/section-atmosphere";

export default function ResearchPage() {
  return (
    <main className="research-page relative isolate mx-auto min-h-screen max-w-[1440px] space-y-12 px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <SectionAtmosphere variant="projects" />
      <header className="research-page__header relative z-10">
        <div className="section-label">
          <span className="section-label__index"><IconMinus className="h-3 w-3" />03</span>
          <span className="theme-rule hidden h-px w-12 sm:block" />
          <span className="section-label__text">RESEARCH & INTELLECTUAL PROPERTY</span>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="home-about__overline">SELECTED TEAM-MEMBER WORK</p>
            <h1 className="mt-3 max-w-[16ch] font-commissioner text-4xl font-bold leading-tight tracking-tight text-[var(--ink)] md:text-6xl">
              Research with a clear question.
            </h1>
          </div>
          <Link href="/projects" className="research-page__projects-link">
            Explore platforms <IconArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-5 max-w-[68ch] text-sm leading-7 text-[var(--muted-ink)]">
          Selected work from the RUGVED brochure and public records. Paper links are included where a public publication record could be confirmed; brochure-only titles are clearly marked.
        </p>
      </header>

      <section className="research-page__grid relative z-10" aria-label="Selected research">
        {RESEARCH.map((paper, index) => (
          <article className="research-card" key={paper.title}>
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-[var(--signal-accent)]">
                <IconFileText className="h-4 w-4" /> PAPER / {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--muted-ink)]">{paper.year}</span>
            </div>
            <h2 className="mt-6 font-commissioner text-xl font-bold leading-snug text-[var(--ink)] md:text-2xl">
              {paper.title}
            </h2>
            {paper.authors ? (
              <p className="mt-3 font-mono text-[9px] leading-relaxed text-[var(--muted-ink)]">
                {paper.authors}
              </p>
            ) : null}
            <p className="mt-5 text-sm leading-7 text-[var(--muted-ink)]">{paper.summary}</p>
            {paper.href ? (
              <a className="research-card__link" href={paper.href} target="_blank" rel="noreferrer">
                {paper.publisher} <IconArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
              <span className="research-card__link">{paper.publisher}</span>
            )}
          </article>
        ))}
      </section>

      <section className="relative z-10 space-y-5" aria-label="Patent applications">
        <header>
          <p className="home-about__overline">INTELLECTUAL PROPERTY</p>
          <h2 className="mt-3 font-commissioner text-3xl font-bold tracking-tight text-[var(--ink)] md:text-4xl">
            Selected patent filings.
          </h2>
          <p className="mt-3 max-w-[72ch] text-sm leading-7 text-[var(--muted-ink)]">
            {PATENT_DISCLOSURE}
          </p>
        </header>
        <div className="research-page__grid">
          {PATENTS.map((patent) => (
            <article className="research-card" key={patent.applicationNumber}>
              <span className="font-mono text-[9px] tracking-[0.18em] text-[var(--signal-accent)]">
                PATENT APPLICATION
              </span>
              <h3 className="mt-5 font-commissioner text-xl font-bold leading-snug text-[var(--ink)] md:text-2xl">
                {patent.title}
              </h3>
              <p className="mt-4 font-mono text-[10px] text-[var(--muted-ink)]">
                APPLICATION NO. {patent.applicationNumber}
              </p>
              <span className="mt-auto pt-6 font-mono text-[9px] leading-relaxed text-[var(--muted-ink)]">
                {patent.status}
              </span>
            </article>
          ))}
        </div>
      </section>

      <p className="research-page__note relative z-10">
        {RESEARCH_DISCLOSURE} Project capability descriptions live on the <Link href="/projects">Projects page</Link>.
      </p>
    </main>
  );
}
