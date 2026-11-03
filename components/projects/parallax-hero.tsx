"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/lib/project-data";

export function ParallaxHero({ project }: { project: Project }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);

  return (
    <section aria-labelledby="project-title">
      <div
        ref={frameRef}
        className="relative h-[clamp(320px,50vw,560px)] overflow-hidden border border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[var(--surface-raised)]"
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={
            reduceMotion ? undefined : { y: imageY, scale: imageScale }
          }
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            preload
            sizes="(min-width: 1360px) 1360px, 100vw"
            className="object-cover"
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,var(--page)_0%,color-mix(in_srgb,var(--page)_92%,transparent)_38%,color-mix(in_srgb,var(--page)_58%,transparent)_68%,transparent_100%)]"
        />

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-9">
          <p className="font-mono text-[10px] font-bold tracking-[0.18em] text-[var(--signal-accent)]">
            {project.code} · {project.category}
          </p>
          <h1
            id="project-title"
            className="mt-2 font-commissioner text-[clamp(2.75rem,7vw,5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-[var(--ink)]"
          >
            {project.title}
          </h1>
          <p className="mt-2 max-w-[48ch] text-sm text-[var(--muted-ink)] md:text-base">
            {project.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
