export function SpecStrip({ points }: { points: string[] }) {
  return (
    <ul className="mt-8 grid grid-cols-1 list-none gap-px border-y border-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--blue-accent)_22%,transparent)] p-0 sm:grid-cols-2 lg:grid-cols-5">
      {points.map((point, index) => (
        <li
          key={point}
          className="bg-[color-mix(in_srgb,var(--surface)_72%,var(--page))] px-4 py-4"
        >
          <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-[var(--field-accent)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="mt-2 text-[12px] leading-6 text-[var(--ink)]">{point}</p>
        </li>
      ))}
    </ul>
  );
}
