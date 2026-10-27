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
  return (
    <div
      aria-hidden="true"
      role="presentation"
      data-background-motif={LABELS[variant]}
      className={`section-atmosphere section-atmosphere--${variant}`}
    >
      <span className="section-atmosphere__glow" />
      <span className="section-atmosphere__pattern" />
      <span className="section-atmosphere__sweep" />
      <span className="section-atmosphere__markers" />
    </div>
  );
}
