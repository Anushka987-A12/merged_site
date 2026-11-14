// Static, reusable SVG geometry: pixel-art depth without a canvas render loop.
const TIERS = Array.from({ length: 8 }, (_, i) => {
  const y = 9 + i * 9;
  const w = 5 + i * 3;
  return `M30 ${y - 12}h2v5h2v4h3v4h3v3h${w - 2}v3h-5v3h-5v-2H${32 - w}v2h-5v-3h-5v-3h${w - 2}v-3h3v-4h3v-4h2v-5Z`;
});

export function PixelForest() {
  return (
    <svg className="pixel-forest" viewBox="0 0 640 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true" shapeRendering="crispEdges">
      <defs>
        <linearGradient id="pixel-sky" x2="0" y2="1">
          <stop stopColor="#102c3b" /><stop offset=".6" stopColor="#397b7b" /><stop offset="1" stopColor="#8db39a" />
        </linearGradient>
        <g id="pixel-pine">
          <path d="M29 50h5v45h-5z" />
          {TIERS.map((d, i) => <path key={i} d={d} />)}
        </g>
      </defs>
      <path fill="url(#pixel-sky)" d="M0 0h640v360H0z" />
      <g fill="#b2d4bf" opacity=".55">
        {[34, 97, 156, 213, 287, 344, 420, 486, 563, 609].map((x, i) => <rect key={x} x={x} y={14 + (i * 17) % 75} width={i % 3 ? 1 : 2} height="1" />)}
      </g>
      <g className="pixel-forest__far" fill="#548e8a" opacity=".55">
        {Array.from({ length: 14 }, (_, i) => <use key={i} href="#pixel-pine" transform={`translate(${i * 54 - 34} ${62 + (i * 19) % 40}) scale(${1.3 + (i % 3) * .2} 2.5)`} />)}
      </g>
      <g className="pixel-forest__middle" fill="#2b686e">
        {Array.from({ length: 18 }, (_, i) => <use key={i} href="#pixel-pine" transform={`translate(${i * 40 - 40} ${113 + (i * 23) % 42}) scale(${.9 + (i % 4) * .13} 2.1)`} />)}
      </g>
      <g className="pixel-forest__near" fill="#153e50">
        {Array.from({ length: 20 }, (_, i) => <use key={i} href="#pixel-pine" transform={`translate(${i * 36 - 26} ${174 + (i * 13) % 38}) scale(${.8 + (i % 3) * .15} 1.65)`} />)}
      </g>
      <g fill="#0b293c">
        {Array.from({ length: 24 }, (_, i) => <use key={i} href="#pixel-pine" transform={`translate(${i * 29 - 28} ${232 + (i * 11) % 27}) scale(.75 1.05)`} />)}
      </g>
      <g fill="#316a62">
        {[16, 114, 181, 300, 446, 531, 602].map((x, i) => <use key={x} href="#pixel-pine" transform={`translate(${x} ${254 + i % 3 * 6}) scale(.45 .7)`} />)}
      </g>
      <path fill="#0a2431" d="M0 328h640v32H0z" />
      <path fill="#27574b" d="M0 326h640v5H0z" />
      <g fill="#508a60">
        {Array.from({ length: 160 }, (_, i) => <path key={i} d={`M${i * 4} 328v-${3 + i * 7 % 7}h1v3h2v-2h1v${2 + i * 7 % 7}z`} />)}
      </g>
      <g fill="#8ab774" opacity=".8">
        {Array.from({ length: 80 }, (_, i) => <rect key={i} x={i * 8 + 2} y={321 + i % 3} width="1" height={3 + i % 4} />)}
      </g>
      {[52, 142, 249, 389, 480, 579].map((x, i) => (
        <g key={x} transform={`translate(${x} 319)`}>
          <path d="M0 7V2h3V0h11v2h4v5Z" fill="#366b50" />
          <path d="M2 2h12v2H2zM5 0h6v2H5z" fill="#73a76c" />
          <path d="M22 7V3h2v4" fill="#a8b28c" />
          <path d="M20 3V1h2v-1h3v1h2v2z" fill={i % 2 ? "#bd8261" : "#8a6879"} />
        </g>
      ))}
      <g fill="#244c46">
        {Array.from({ length: 50 }, (_, i) => <rect key={i} x={i * 13} y={333 + i % 4 * 3} width="3" height="2" />)}
      </g>
    </svg>
  );
}
