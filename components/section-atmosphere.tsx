"use client";

import { useRef } from "react";
import { useAmbientActivity } from "@/lib/use-ambient-activity";
import { AmbientDetails } from "@/components/ambient-details";

type SectionAtmosphereProps = {
  variant: "projects" | "subsystems" | "contact" | "team" | "accomplishments";
};

const LABELS = {
  projects: "Arsenal background: orbital scan and field markers",
  subsystems: "Subsystems background: circuit paths and signal pulses",
  contact: "Communications background: signal rings and transmission sweep",
  team: "Personnel background: grid coordinates and scanning beacon",
  accomplishments: "Awards background: tally lines and signal markers",
} as const;

export function SectionAtmosphere({ variant }: SectionAtmosphereProps) {
  const ref = useRef<HTMLDivElement>(null);
  useAmbientActivity(ref);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      role="presentation"
      data-background-motif={LABELS[variant]}
      className={`section-atmosphere section-atmosphere--${variant}`}
    >
      <span className="section-atmosphere__glow" />
      <span className="section-atmosphere__pattern" />
      <span className="section-atmosphere__sweep" />
      <span className="section-atmosphere__markers" />
      <AmbientDetails />
    </div>
  );
}
