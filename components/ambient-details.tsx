"use client";

import { useRef, type CSSProperties } from "react";
import { useAmbientActivity } from "@/lib/use-ambient-activity";

export function AmbientDetails({ drones = true }: { drones?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useAmbientActivity(ref);
  return (
    <div className="ambient-details" ref={ref} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => <i key={i} className="ambient-particle" style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 9) % 100}%`, "--delay": `${-i * 3}s`, "--duration": `${17 + i % 5 * 4}s` } as CSSProperties} />)}
      {drones && [0, 1].map((i) => (
        <svg key={i} className={`ambient-drone ambient-drone--${i}`} viewBox="0 0 80 40" fill="none">
          <path d="m18 9 44 23m0-23L18 32" stroke="currentColor" strokeWidth="3" />
          <path d="m32 14 8-4 9 5-2 12-8 3-8-5z" fill="currentColor" />
          {[ [15, 8], [65, 8], [15, 32], [65, 32] ].map(([x,y]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="13" ry="3" stroke="currentColor" />)}
          <circle cx="40" cy="25" r="2" fill="var(--signal-accent)" />
        </svg>
      ))}
    </div>
  );
}
