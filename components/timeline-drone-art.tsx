export function TimelineDroneArt() {
  return (
    <svg
      viewBox="0 0 180 220"
      className="timeline-drone-art"
      fill="none"
      aria-hidden="true"
    >
      {/* Shadow under the drone body */}
      <ellipse className="timeline-drone-shadow" cx="90" cy="104" rx="44" ry="8" />

      {/* Four arms form the X frame seen on the reference aircraft. */}
      <g className="timeline-drone-arms">
        <path className="timeline-drone-arm-outline" d="M77 61 L38 31 M103 61 L142 31 M76 73 L32 104 M104 73 L148 104" />
        <path className="timeline-drone-arm" d="M77 61 L38 31 M103 61 L142 31 M76 73 L32 104 M104 73 L148 104" />
        <path className="timeline-drone-arm-highlight" d="M75 60 L42 35 M105 60 L138 35 M74 73 L36 101 M106 73 L144 101" />
      </g>

      {/* Landing legs and skids. */}
      <g className="timeline-drone-landing-gear">
        <path d="M58 71 L53 91 M122 71 L127 91 M53 91 L46 100 M127 91 L134 100" />
        <path className="timeline-drone-skid" d="M42 101 L57 101 M123 101 L138 101" />
      </g>

      {/* Propellers spin with the timeline's scroll progress. */}
      {[
        { x: 36, y: 29 },
        { x: 144, y: 29 },
        { x: 29, y: 106 },
        { x: 151, y: 106 },
      ].map(({ x, y }) => (
        <g key={`${x}-${y}`} className="timeline-drone-motor-group" transform={`translate(${x} ${y})`}>
          <g className="timeline-drone-propeller-spin">
            <path className="timeline-drone-propeller" d="M-25 -2 Q-17 -6 -3 -2 L-2 0 Q-17 3 -25 2 Z M25 2 Q17 6 3 2 L2 0 Q17 -3 25 -2 Z" />
            <path className="timeline-drone-propeller-tip" d="M-24 -2 L-20 -3.4 M24 2 L20 3.4" />
          </g>
          <circle className="timeline-drone-motor" r="7" />
          <circle className="timeline-drone-motor-core" r="2.6" />
        </g>
      ))}

      {/* Faceted central shell with a forward camera at the nose. */}
      <g className="timeline-drone-hull">
        <path className="timeline-drone-hull-side" d="M62 55 L90 65 L90 96 L64 82 Z" />
        <path className="timeline-drone-hull-side timeline-drone-hull-side--right" d="M90 65 L118 55 L116 82 L90 96 Z" />
        <path className="timeline-drone-hull-top" d="M62 55 L80 43 Q90 38 100 43 L118 55 L90 68 Z" />
        <path className="timeline-drone-hull-panel" d="M72 54 L85 47 Q90 45 95 47 L108 54 L90 62 Z" />
        <path className="timeline-drone-hull-seam" d="M66 62 L90 72 L114 62 M67 75 L90 87 L113 75" />
        <path className="timeline-drone-hull-accent" d="M67 79 L74 83 M106 83 L113 79" />
        <rect className="timeline-drone-sensor" x="84" y="68" width="12" height="9" rx="2" />
        {/* Camera lens — spotlight source */}
        <circle className="timeline-drone-lens" cx="90" cy="89" r="4" />
        <circle className="timeline-drone-lens-glint" cx="91.2" cy="88" r="1" />
      </g>
    </svg>
  );
}
