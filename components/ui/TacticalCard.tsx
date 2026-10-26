"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TacticalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  badge?: string;
  glowColor?: string;
  laserSweep?: boolean;
}

export const TacticalCard: React.FC<TacticalCardProps> = ({
  children,
  className,
  badge,
  glowColor = "rgba(119, 221, 164, 0.12)",
  laserSweep = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
    active: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({
      ...prev,
      active: false,
    }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "tactical-card group relative",
        "before:pointer-events-none before:absolute before:left-0 before:top-4 before:bottom-4 before:w-px",
        "transition-colors duration-300",

        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: mousePos.active
            ? `radial-gradient(
                400px circle at ${mousePos.x}px ${mousePos.y}px,
                ${glowColor},
                transparent 70%
              )`
            : "none",
        }}
      />

      {/* Laser Sweep Scanline */}
      {laserSweep && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-[var(--field-accent)]/[0.05] to-transparent animate-laser-sweep" />
      )}

      {/* Optional Top Right Tactical Badge */}
      {badge && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-[var(--muted-ink)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--field-accent)] shadow-[0_0_8px_var(--field-accent)]" />
          <span>{badge}</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default TacticalCard;
