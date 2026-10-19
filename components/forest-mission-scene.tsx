"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type FlightStyle = CSSProperties & { [key: `--${string}`]: string | number };

const INITIAL_FLIGHTS: FlightStyle[] = [
  { top: "18%", left: "-14%", "--scout-scale": 1, "--flight-duration": "23s", "--flight-delay": "-7s", "--flight-x-a": "32vw", "--flight-x-b": "80vw", "--flight-end-x": "145vw", "--flight-y-a": "22px", "--flight-y-b": "-14px", "--flight-y-end": "17px" },
  { top: "30%", left: "-18%", "--scout-scale": 0.62, "--flight-duration": "29s", "--flight-delay": "-13s", "--flight-x-a": "44vw", "--flight-x-b": "94vw", "--flight-end-x": "145vw", "--flight-y-a": "-28px", "--flight-y-b": "14px", "--flight-y-end": "-12px" },
  { top: "11%", left: "-15%", "--scout-scale": 0.46, "--flight-duration": "34s", "--flight-delay": "-21s", "--flight-x-a": "40vw", "--flight-x-b": "90vw", "--flight-end-x": "145vw", "--flight-y-a": "18px", "--flight-y-b": "-30px", "--flight-y-end": "13px" },
  { top: "24%", left: "116%", "--scout-scale": 0.4, "--flight-duration": "19s", "--flight-delay": "-11s", "--flight-x-a": "-35vw", "--flight-x-b": "-86vw", "--flight-end-x": "-145vw", "--flight-y-a": "-18px", "--flight-y-b": "32px", "--flight-y-end": "-12px" },
  { top: "38%", left: "-16%", "--scout-scale": 0.35, "--flight-duration": "27s", "--flight-delay": "-18s", "--flight-x-a": "28vw", "--flight-x-b": "83vw", "--flight-end-x": "145vw", "--flight-y-a": "30px", "--flight-y-b": "-25px", "--flight-y-end": "16px" },
  { top: "15%", left: "116%", "--scout-scale": 0.52, "--flight-duration": "31s", "--flight-delay": "-23s", "--flight-x-a": "-34vw", "--flight-x-b": "-92vw", "--flight-end-x": "-145vw", "--flight-y-a": "24px", "--flight-y-b": "-34px", "--flight-y-end": "20px" },
  { top: "33%", left: "-14%", "--scout-scale": 0.31, "--flight-duration": "16s", "--flight-delay": "-3s", "--flight-x-a": "38vw", "--flight-x-b": "96vw", "--flight-end-x": "145vw", "--flight-y-a": "-36px", "--flight-y-b": "23px", "--flight-y-end": "-20px" },
  { top: "22%", left: "116%", "--scout-scale": 0.44, "--flight-duration": "36s", "--flight-delay": "-29s", "--flight-x-a": "-27vw", "--flight-x-b": "-76vw", "--flight-end-x": "-145vw", "--flight-y-a": "-30px", "--flight-y-b": "37px", "--flight-y-end": "-18px" },
  { top: "27%", left: "-17%", "--scout-scale": 0.38, "--flight-duration": "25s", "--flight-delay": "-16s", "--flight-x-a": "35vw", "--flight-x-b": "88vw", "--flight-end-x": "145vw", "--flight-y-a": "26px", "--flight-y-b": "-31px", "--flight-y-end": "21px" },
  { top: "40%", left: "116%", "--scout-scale": 0.3, "--flight-duration": "32s", "--flight-delay": "-8s", "--flight-x-a": "-31vw", "--flight-x-b": "-90vw", "--flight-end-x": "-145vw", "--flight-y-a": "-25px", "--flight-y-b": "34px", "--flight-y-end": "-16px" },
  { top: "9%", left: "-15%", "--scout-scale": 0.42, "--flight-duration": "28s", "--flight-delay": "-22s", "--flight-x-a": "41vw", "--flight-x-b": "91vw", "--flight-end-x": "145vw", "--flight-y-a": "-21px", "--flight-y-b": "37px", "--flight-y-end": "-14px" },
  { top: "35%", left: "116%", "--scout-scale": 0.36, "--flight-duration": "20s", "--flight-delay": "-12s", "--flight-x-a": "-39vw", "--flight-x-b": "-81vw", "--flight-end-x": "-145vw", "--flight-y-a": "31px", "--flight-y-b": "-28px", "--flight-y-end": "18px" },
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createRandomUgvPatrol() {
  const reverse = Math.random() < 0.5;
  const duration = randomBetween(18, 32);
  const offsets = [
    0,
    randomBetween(0.2, 0.29),
    randomBetween(0.46, 0.55),
    randomBetween(0.72, 0.81),
    1,
  ];
  const heights = [
    0,
    randomBetween(-3.5, 3.5),
    randomBetween(-4.5, 4.5),
    randomBetween(-3.5, 3.5),
    0,
  ];
  const tilts = [
    0,
    randomBetween(-0.75, 0.75),
    randomBetween(-1, 1),
    randomBetween(-0.75, 0.75),
    0,
  ];

  return {
    duration,
    facing: reverse ? -1 : 1,
    waypoints: offsets.map((offset, index) => ({
      offset,
      x: (reverse ? 1 - offset : offset) * 175,
      y: heights[index],
      tilt: tilts[index] * (reverse ? -1 : 1),
    })),
  };
}

function createRandomFlights(): FlightStyle[] {
  return INITIAL_FLIGHTS.map((flight, index) => {
    const reverse = Math.random() < 0.34;
    const scale = index === 0 ? randomBetween(0.88, 1.04) : randomBetween(0.3, 0.66);
    const duration = randomBetween(12, 46);
    const firstX = randomBetween(27, 47) * (reverse ? -1 : 1);
    const secondX = randomBetween(74, 99) * (reverse ? -1 : 1);
    return {
      top: `${randomBetween(11, 42).toFixed(1)}%`,
      left: reverse ? "116%" : "-18%",
      opacity: randomBetween(0.54, 0.96),
      filter: `blur(${scale < 0.42 ? randomBetween(0.5, 1.2).toFixed(1) : 0}px)`,
      "--scout-scale": scale.toFixed(2),
      "--flight-duration": `${duration.toFixed(1)}s`,
      "--flight-delay": `${(-Math.random() * duration).toFixed(1)}s`,
      "--flight-x-a": `${firstX.toFixed(1)}vw`,
      "--flight-x-b": `${secondX.toFixed(1)}vw`,
      "--flight-end-x": reverse ? "-145vw" : "145vw",
      "--flight-y-a": `${randomBetween(-42, 42).toFixed(1)}px`,
      "--flight-y-b": `${randomBetween(-48, 48).toFixed(1)}px`,
      "--flight-y-end": `${randomBetween(-38, 38).toFixed(1)}px`,
      "--flight-tilt": `${randomBetween(-6, 6).toFixed(1)}deg`,
    };
  });
}

function ScoutDrone({ style }: { style: FlightStyle }) {
  return (
    <div className="forest-scout" style={style}>
      <svg viewBox="0 0 150 76" fill="none" aria-hidden="true">
        <g className="forest-scout__frame">
          <path d="M65 34 29 18M85 34l36-16M64 43 22 57M86 43l42 14" stroke="#172c31" strokeWidth="7" strokeLinecap="round" />
          <path d="M65 34 29 18M85 34l36-16M64 43 22 57M86 43l42 14" stroke="#567d7b" strokeWidth="3.5" strokeLinecap="round" />
          <path d="m55 35 20-10 20 10-4 17-16 8-16-8z" fill="#17272d" stroke="#07151a" strokeWidth="2" />
          <path d="m63 35 12-6 12 6-2 10-10 5-10-5z" fill="#476263" />
          <path d="m68 51-4 8m18-8 4 8" stroke="#17272d" strokeWidth="3" strokeLinecap="round" />
          <circle cx="75" cy="53" r="3.2" fill="#f8b45d" stroke="#17272d" strokeWidth="1.5" />
        </g>
        {[
          { x: 25, y: 17 },
          { x: 125, y: 17 },
          { x: 18, y: 58 },
          { x: 132, y: 58 },
        ].map(({ x, y }) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <g className="forest-scout__rotor">
              <path d="M-17 0c8-5 26-5 34 0-8 5-26 5-34 0Z" fill="#172c31" stroke="#d4e2d7" strokeWidth="1" />
              <path d="M-15 0h30" stroke="#e7b45e" strokeWidth="1.5" />
            </g>
            <circle r="4" fill="#718a83" stroke="#14252a" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function GroundVehicle() {
  const vehicleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vehicle = vehicleRef.current;
    if (!vehicle) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | null = null;
    let stopped = false;

    const startPatrol = () => {
      if (stopped || reducedMotion.matches) return;

      const patrol = createRandomUgvPatrol();
      const viewportWidth = Math.max(window.innerWidth, 1);
      const widthRatio = viewportWidth < 768
        ? 0.72
        : viewportWidth < 1024
          ? Math.min(0.68, 500 / viewportWidth)
          : Math.min(0.42, 560 / viewportWidth);

      vehicle.style.left = "-40%";
      vehicle.style.removeProperty("transform");
      vehicle.style.setProperty("--ugv-facing", String(patrol.facing));
      vehicle.style.setProperty("--ugv-wheel-duration", `${(patrol.duration * widthRatio * 0.0855).toFixed(2)}s`);
      vehicle.style.setProperty("--ugv-tread-duration", `${(patrol.duration * widthRatio * 0.0381).toFixed(2)}s`);
      vehicle.style.setProperty("--ugv-bob-duration", `${randomBetween(1.7, 2.8).toFixed(2)}s`);
      vehicle.style.setProperty("--ugv-bob-height", `${randomBetween(-1.8, -0.5).toFixed(1)}px`);
      vehicle.style.setProperty("--ugv-bob-tilt", `${randomBetween(-0.28, 0.28).toFixed(2)}deg`);

      const frames: Keyframe[] = patrol.waypoints.map((waypoint, index) => ({
        offset: waypoint.offset,
        transform: `translate3d(${waypoint.x.toFixed(1)}vw, ${waypoint.y.toFixed(1)}px, 0) rotate(${waypoint.tilt.toFixed(2)}deg)`,
        easing: index < patrol.waypoints.length - 1 ? "ease-in-out" : "linear",
      }));

      animation = vehicle.animate(frames, {
        duration: patrol.duration * 1000,
        fill: "forwards",
      });
      animation.onfinish = () => {
        if (stopped) return;
        animation?.cancel();
        animation = null;
        startPatrol();
      };
    };

    const handleMotionPreference = () => {
      animation?.cancel();
      animation = null;
      if (reducedMotion.matches) {
        vehicle.style.left = "50%";
        vehicle.style.transform = "translateX(-50%)";
      } else {
        startPatrol();
      }
    };

    if (reducedMotion.matches) handleMotionPreference();
    else startPatrol();
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      stopped = true;
      animation?.cancel();
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <div className="forest-ugv" ref={vehicleRef}>
      <div className="forest-ugv__suspension">
        <svg viewBox="0 0 420 220" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="ugv-hull" x1="102" y1="48" x2="310" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6e8878" />
            <stop offset="0.48" stopColor="#334f4b" />
            <stop offset="1" stopColor="#1d3537" />
          </linearGradient>
        </defs>

        {/* Tight contact shadow beneath the tracks keeps the rover grounded. */}
        <ellipse cx="210" cy="153" rx="160" ry="7" fill="#071714" fillOpacity=".46" />

        {/* Track belt with individual road wheels and tread blocks. */}
        <path d="M75 107h270a21 21 0 0 1 21 21v2a21 21 0 0 1-21 21H75a21 21 0 0 1-21-21v-2a21 21 0 0 1 21-21Z" fill="#16272a" stroke="#09171a" strokeWidth="5" />
        <path className="forest-ugv__treads" d="M76 113h267a15 15 0 0 1 15 15v2a15 15 0 0 1-15 15H76a15 15 0 0 1-15-15v-2a15 15 0 0 1 15-15Z" stroke="#a6b4a0" strokeWidth="2.5" strokeDasharray="8 6" />
        <g className="forest-ugv__wheels">
          {[82, 124, 166, 210, 254, 296, 338].map((x) => (
            <g key={x} transform={`translate(${x} 128)`}>
              <g className="forest-ugv__wheel">
                <circle r="10" fill="#354945" stroke="#a5b39a" strokeWidth="2" />
                <path d="M0-6v12M-5-3l10 6M5-3l-10 6" stroke="#a5b39a" strokeOpacity=".78" strokeWidth="1.2" />
              </g>
            </g>
          ))}
        </g>
        <path d="m75 107 10-18h239l20 18H75Z" fill="#253c3b" stroke="#122426" strokeWidth="4" />

        {/* Armored, faceted chassis, service panels and sensor mast. */}
        <path d="m93 88 17-30q6-10 19-12l127-7q18-1 31 10l42 39-14 20H91l2-20Z" fill="url(#ugv-hull)" stroke="#102426" strokeWidth="5" strokeLinejoin="round" />
        <path d="m123 55 125-7q16-1 27 9l-17 24H106l17-26Z" fill="#82937e" fillOpacity=".35" stroke="#abb699" strokeOpacity=".8" strokeWidth="1.5" />
        <path d="m112 85 191-1m-174 14 158 1m-133-37-11 22m117-21 16 20" stroke="#b3c0a0" strokeOpacity=".55" strokeWidth="2" />
        <path d="m267 50 19-14 18 3 12 13-13 13-22-2-14-13Z" fill="#213638" stroke="#101f22" strokeWidth="3" />
        <path d="M287 39V22m-7 0h14" stroke="#17282b" strokeWidth="4" strokeLinecap="round" />
        <rect x="276" y="16" width="22" height="12" rx="4" fill="#d4b46b" stroke="#17282b" strokeWidth="3" />
        <circle cx="294" cy="57" r="5" fill="#f4c667" stroke="#18282a" strokeWidth="2" />
        <circle cx="306" cy="61" r="3" fill="#9bd9cf" stroke="#18282a" strokeWidth="1.5" />
        <path d="M126 73h55v13h-55z" fill="#203537" stroke="#aec0a5" strokeOpacity=".7" strokeWidth="1.5" />
        <path d="M135 78h37m-37 4h26" stroke="#8eaa97" strokeWidth="1.4" strokeLinecap="round" />
        <path d="m94 87-11 13m247-7 11 7" stroke="#efb75c" strokeWidth="4" strokeLinecap="round" />
        <circle cx="112" cy="105" r="2" fill="#f2c16b" />
        </svg>
      </div>
    </div>
  );
}

export function ForestMissionScene() {
  const [flights, setFlights] = useState(INITIAL_FLIGHTS);

  useEffect(() => {
    const randomize = window.setTimeout(() => setFlights(createRandomFlights()), 0);
    return () => window.clearTimeout(randomize);
  }, []);

  return (
    <div className="forest-mission-scene" aria-hidden="true">
      <svg className="forest-mission-scene__landscape" viewBox="0 0 1440 820" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="forest-sky" x1="720" y1="0" x2="720" y2="492" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--forest-sky-top)" />
            <stop offset=".62" stopColor="var(--forest-sky-mid)" />
            <stop offset="1" stopColor="var(--forest-sky-horizon)" />
          </linearGradient>
          <linearGradient id="forest-lake" x1="720" y1="390" x2="720" y2="760" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--forest-lake-top)" />
            <stop offset="1" stopColor="var(--forest-lake-deep)" />
          </linearGradient>
          <linearGradient id="forest-foreground" x1="720" y1="610" x2="720" y2="820" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--forest-foreground-top)" />
            <stop offset="1" stopColor="var(--forest-foreground-deep)" />
          </linearGradient>
          <linearGradient id="forest-mountain" x1="720" y1="175" x2="720" y2="436" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--forest-range-near-top)" />
            <stop offset="1" stopColor="var(--forest-range-near-deep)" />
          </linearGradient>
          <radialGradient id="forest-sun-halo" cx="50%" cy="50%" r="50%">
            <stop stopColor="#fff7d6" stopOpacity=".66" />
            <stop offset=".34" stopColor="#f9e6b8" stopOpacity=".26" />
            <stop offset="1" stopColor="#f9e6b8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="forest-moon-halo" cx="50%" cy="50%" r="50%">
            <stop stopColor="#e1f1f0" stopOpacity=".58" />
            <stop offset=".45" stopColor="#a9d4d9" stopOpacity=".18" />
            <stop offset="1" stopColor="#a9d4d9" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="forest-moon-disc" x1="920" y1="210" x2="1060" y2="340" gradientUnits="userSpaceOnUse">
            <stop stopColor="#eff5e8" />
            <stop offset="1" stopColor="#b5cfce" />
          </linearGradient>
        </defs>
        <rect width="1440" height="820" fill="url(#forest-sky)" />
        <g className="forest-mission-scene__stars" fill="#d8ece8">
          <circle cx="180" cy="96" r="2" /><circle cx="435" cy="144" r="1.5" /><circle cx="688" cy="85" r="1.7" />
          <circle cx="1260" cy="108" r="1.5" /><circle cx="1360" cy="196" r="2" /><circle cx="770" cy="200" r="1.3" />
        </g>
        <g className="forest-celestial forest-moon-rig">
          <circle cx="990" cy="270" r="142" fill="url(#forest-moon-halo)" />
          <circle cx="990" cy="270" r="68" fill="url(#forest-moon-disc)" />
          <circle cx="969" cy="248" r="9" fill="#8faeb0" fillOpacity=".34" />
          <circle cx="1015" cy="284" r="12" fill="#8faeb0" fillOpacity=".28" />
          <circle cx="980" cy="299" r="6" fill="#8faeb0" fillOpacity=".24" />
          <circle cx="990" cy="270" r="86" fill="none" stroke="#dcebe2" strokeOpacity=".3" strokeWidth="1" strokeDasharray="3 14" className="forest-celestial__orbit" />
        </g>
        <g className="forest-celestial forest-sun-rig">
          <circle cx="990" cy="270" r="185" fill="url(#forest-sun-halo)" />
          <circle cx="990" cy="270" r="76" fill="none" stroke="#fff4d2" strokeOpacity=".45" strokeWidth="3" />
          <circle cx="990" cy="270" r="61" fill="#fff1c7" />
          <g className="forest-sun-rig__rays" stroke="#fff3d5" strokeLinecap="round">
            <path d="M990 174V149M990 391v-25M894 270h-25M1111 270h-25M922 202l-18-18M1076 346l-18-18M1058 202l18-18M922 338l-18 18" strokeWidth="3" />
          </g>
        </g>
        
        <path d="m0 392 105-89 72 36 95-98 83 83 108-119 121 146 77-79 117 113 89-100 103 90 104-117 105 113 90-93 171 123v107H0z" fill="var(--forest-range-far)" fillOpacity=".82" />
        <path d="m0 420 97-53 92 33 119-135 91 119 94-82 101 116 107-107 120 117 90-68 116 89 96-128 105 122 104-48 108 67v101H0z" fill="url(#forest-mountain)" />
        <path d="m213 365 95-100 91 119-55-30-37 16-35-21-26 14-20-7Zm391 53 107-107 120 117-65-35-35 17-43-20-38 14-24-6Zm446 23 96-128 105 122-61-33-32 16-36-23-34 18-20-7Z" fill="#d7dfce" fillOpacity=".52" />
        <path d="M0 418q178-16 362 4 169 18 318-3 178-25 366 0 188 24 394-3v61H0z" fill="var(--forest-range-near-deep)" />
        <rect y="520" width="1440" height="300" fill="url(#forest-lake)" />
        <path d="M0 542q155 14 316 0 202-17 400 2 224 20 430-5 166-20 294 3" stroke="#c1d9c8" strokeOpacity=".35" strokeWidth="4" />
        <path d="M84 588q180 15 299 0m136 27q177 14 322-2m195-37q106 10 180 0M187 679q93 10 166-1m379 45q168 13 294-3m173-68q94 11 166 1" stroke="#d5e3cf" strokeOpacity=".2" strokeWidth="3" strokeLinecap="round" />
        {/* Far pine line, then dark trees framing the view. */}
        <g transform="translate(0 71)" fill="#20444a" fillOpacity=".78">
          {[...Array(31)].map((_, index) => {
            const x = 35 + index * 45;
            const h = 28 + (index % 5) * 8;
            return <path key={x} d={`M${x} 453h14l-7 -${h}z M${x + 3} 453h8v8h-8z`} />;
          })}
        </g>
        <g className="forest-edge-pines" fill="var(--forest-pine-near)">
          <path d="M98 110 80 162 91 158 61 211 79 205 44 260 73 252 30 312 68 300 18 365 64 352 9 420 61 405 0 476 61 461 16 523 65 509 23 570 70 557 42 622 77 611 67 820h34l-5-209 34 11-26-65 44 13-36-63 50 14-45-66 54 15-42-66 48 14-37-62 42 12-31-56 34 7-29-53 21 5-23-52Z" />
          <path d="M98 110 80 162 91 158 61 211 79 205 44 260 73 252 30 312 68 300 18 365 64 352 9 420 61 405 0 476 61 461 16 523 65 509 23 570 70 557 42 622 77 611 67 820h34l-5-209 34 11-26-65 44 13-36-63 50 14-45-66 54 15-42-66 48 14-37-62 42 12-31-56 34 7-29-53 21 5-23-52Z" transform="translate(152 135) scale(.72)" />
          <path d="M98 110 80 162 91 158 61 211 79 205 44 260 73 252 30 312 68 300 18 365 64 352 9 420 61 405 0 476 61 461 16 523 65 509 23 570 70 557 42 622 77 611 67 820h34l-5-209 34 11-26-65 44 13-36-63 50 14-45-66 54 15-42-66 48 14-37-62 42 12-31-56 34 7-29-53 21 5-23-52Z" transform="translate(1440 0) scale(-1 1)" />
          <path d="M98 110 80 162 91 158 61 211 79 205 44 260 73 252 30 312 68 300 18 365 64 352 9 420 61 405 0 476 61 461 16 523 65 509 23 570 70 557 42 622 77 611 67 820h34l-5-209 34 11-26-65 44 13-36-63 50 14-45-66 54 15-42-66 48 14-37-62 42 12-31-56 34 7-29-53 21 5-23-52Z" transform="translate(1274 168) scale(-.62 .62)" />
          <path d="M255 360 240 331l7 1-17-35 7 1-19-39-20 41 7-1-16 35 8-1-14 29 8-1-14 29 10-2-12 30 12-2-9 29 13-1-7 34 44 0z" />
          <path d="m320 415-12-24 6 1-14-27 6 1-17-34-17 35 6-1-13 27 6-1-11 25 7-1-10 23 9-1-7 23 10-2-4 24h40z" />
        </g>
        <path d="M0 690q119-6 238 0 101 6 201-1 150-9 284 0 140 9 288-4 194-6 429 5v125H0z" fill="url(#forest-foreground)" />
        <path d="M0 714q119-6 238 0 101 6 201-1 150-9 284 0 140 9 288-4 194-6 429 5" fill="none" stroke="var(--forest-dirt-track)" strokeOpacity=".26" strokeWidth="30" />
        <path d="M0 714q119-6 238 0 101 6 201-1 150-9 284 0 140 9 288-4 194-6 429 5" fill="none" stroke="var(--forest-dirt-edge)" strokeOpacity=".32" strokeWidth="2" strokeDasharray="18 28" />
        <path d="M0 690q119-6 238 0 101 6 201-1 150-9 284 0 140 9 288-4 194-6 429 5" fill="none" stroke="#a8b68d" strokeOpacity=".48" strokeWidth="3" />
        <g fill="#18363a">
          <path d="M70 820q24-56 47-88 22 34 27 88zM1250 820q31-57 58-99 28 39 38 99zM1144 820q22-46 44-73 22 28 28 73z" />
          <path d="m0 704 91-28-52 54 97-18-60 51 111-14-71 71H0zm1440-10-92-22 56 49-94-12 62 50-111-11 83 72h96z" />
        </g>
        <path d="M0 704q143-21 260 1m945-6q122-27 235-4" stroke="#4f8172" strokeOpacity=".75" strokeWidth="3" />
      </svg>
      {flights.map((flight, index) => <ScoutDrone key={index} style={flight} />)}
      <GroundVehicle />
    </div>
  );
}
