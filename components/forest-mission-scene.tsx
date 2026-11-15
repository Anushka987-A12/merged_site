"use client";

import { useEffect, useRef } from "react";
import { PixelForest } from "@/components/pixel-forest";
import { AmbientDetails } from "@/components/ambient-details";
import { useAmbientActivity } from "@/lib/use-ambient-activity";

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createRandomUgvPatrol(reverse = false) {
  const duration = randomBetween(18, 32);
  const offsets = [
    0,
    randomBetween(0.2, 0.29),
    randomBetween(0.46, 0.55),
    randomBetween(0.72, 0.81),
    1,
  ];

  return {
    duration,
    facing: reverse ? -1 : 1,
    waypoints: offsets.map((offset) => ({
      offset,
      x: reverse ? 1 - offset : offset,
      y: 0,
      tilt: 0,
    })),
  };
}

function ScoutDrone({ index }: { index: number }) {
  const droneRef = useRef<HTMLDivElement>(null);
  // Pre-hydration placeholder spot (percent of the scene) so the SSR / first
  // paint doesn't stack all six drones in the top-left corner. JS flight
  // takes over with pixel transforms on mount.
  const initX = (index * .19 + .08) % .9;
  const initY = .13 + index % 3 * .10;
  useEffect(() => {
    const drone = droneRef.current;
    const scene = drone?.parentElement;
    if (!drone || !scene) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 767px)");
    let flight: Animation | null = null;
    let cancelled = false;
    let retryId = 0;
    let x = (index * .19 + .08) % .9;
    let y = .13 + index % 3 * .10;
    const scale = .48 + index % 3 * .18;
    const isParked = () => compact.matches && index >= 3;
    const fly = () => {
      if (cancelled || preference.matches || isParked()) return;
      const sceneWidth = scene.clientWidth;
      const sceneHeight = scene.clientHeight;
      // Layout isn't ready (SSR/hidden tab/font swap) — retry instead of
      // parking the drone at 0,0 with a NaN/short flight path.
      if (sceneWidth < 10 || sceneHeight < 10 || drone.offsetWidth < 1) {
        window.clearTimeout(retryId);
        retryId = window.setTimeout(() => { if (!cancelled) fly(); }, 300);
        return;
      }
      const nextX = randomBetween(.03, .9);
      const nextY = randomBetween(.06, .62);
      const width = Math.max(1, scene.clientWidth - drone.offsetWidth);
      const height = scene.clientHeight;
      const distance = Math.hypot((nextX - x) * width, (nextY - y) * height);
      const speed = randomBetween(28, 110);
      const duration = Math.max(1800, Math.min(16000, distance / speed * 1000));
      const tilt = (nextX > x ? 1 : -1) * randomBetween(3, 13);
      const arc = randomBetween(-28, 28);
      drone.style.setProperty("--scout-rotor-speed", `${randomBetween(110, 230)}ms`);
      flight = drone.animate([
        { transform: `translate3d(${x * width}px, ${y * height}px, 0) scale(${scale}) rotate(0deg)` },
        { transform: `translate3d(${(x + nextX) / 2 * width}px, ${(y + nextY) / 2 * height + arc}px, 0) scale(${scale}) rotate(${tilt}deg)`, offset: .5 },
        { transform: `translate3d(${nextX * width}px, ${nextY * height}px, 0) scale(${scale}) rotate(0deg)` }
      ], { duration, easing: "cubic-bezier(.35, 0, .65, 1)", fill: "forwards" });
      if (scene.dataset.motionPaused === "true" || document.hidden) flight.pause();
      x = nextX; y = nextY;
      flight.onfinish = () => { flight?.cancel(); fly(); };
    };
    const sync = () => {
      flight?.cancel();
      window.clearTimeout(retryId);
      // Placeholder left/top served first paint — pixel flights assume 0,0.
      drone.style.left = "0";
      drone.style.top = "0";
      // Secondary drones are parked on small screens (CSS hides them too) —
      // keep them out of the way instead of frozen mid-hero.
      if (isParked()) {
        drone.style.transform = `translate(-200px, -200px) scale(${scale})`;
        return;
      }
      if (preference.matches) {
        drone.style.transform = `translate(${x * Math.max(1, scene.clientWidth - drone.offsetWidth)}px, ${y * scene.clientHeight}px) scale(${scale})`;
        return;
      }
      drone.style.transform = `translate(${x * Math.max(1, scene.clientWidth - drone.offsetWidth)}px, ${y * scene.clientHeight}px) scale(${scale})`;
      fly();
    };
    sync();
    preference.addEventListener("change", sync);
    compact.addEventListener("change", sync);
    // Re-anchor flights when the hero resizes (e.g. fullscreen toggle);
    // without this drones keep pixel positions from the old viewport size.
    let resizeRaf = 0;
    const resize = new ResizeObserver(() => {
      window.cancelAnimationFrame(resizeRaf);
      resizeRaf = window.requestAnimationFrame(sync);
    });
    resize.observe(scene);
    return () => { cancelled = true; flight?.cancel(); window.clearTimeout(retryId); window.cancelAnimationFrame(resizeRaf); resize.disconnect(); preference.removeEventListener("change", sync); compact.removeEventListener("change", sync); };
  }, [index]);
  return (
    <div
      className="forest-scout forest-scout--roaming"
      data-secondary={index >= 3}
      ref={droneRef}
      style={{ left: `${initX * 100}%`, top: `${initY * 100}%` }}
    >
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
  const patrolCount = useRef(0);

  useEffect(() => {
    const vehicle = vehicleRef.current;
    if (!vehicle) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | null = null;
    let stopped = false;
    let retryId = 0;
    let resizeTimer = 0;

    const startPatrol = () => {
      if (stopped || reducedMotion.matches) return;
      // Layout isn't ready — retry instead of computing a zero-width patrol
      // that teleports the UGV across the hero.
      if (vehicle.offsetWidth < 10 || window.innerWidth < 10) {
        window.clearTimeout(retryId);
        retryId = window.setTimeout(() => { if (!stopped) startPatrol(); }, 300);
        return;
      }

      const patrol = createRandomUgvPatrol(patrolCount.current % 2 === 1);
      patrolCount.current += 1;
      const viewportWidth = Math.max(window.innerWidth, 1);
      const widthRatio = vehicle.offsetWidth / viewportWidth;

      vehicle.style.left = "0";
      vehicle.style.removeProperty("transform");
      vehicle.style.setProperty("--ugv-facing", String(patrol.facing));
      vehicle.style.setProperty("--ugv-wheel-duration", `${(patrol.duration * widthRatio * 0.0855).toFixed(2)}s`);
      vehicle.style.setProperty("--ugv-tread-duration", `${(patrol.duration * widthRatio * 0.0381).toFixed(2)}s`);
      vehicle.style.setProperty("--ugv-bob-duration", `${randomBetween(1.7, 2.8).toFixed(2)}s`);
      vehicle.style.setProperty("--ugv-bob-height", `${randomBetween(-1.8, -0.5).toFixed(1)}px`);
      vehicle.style.setProperty("--ugv-bob-tilt", `${randomBetween(-0.28, 0.28).toFixed(2)}deg`);

      const frames: Keyframe[] = patrol.waypoints.map((waypoint, index) => ({
        offset: waypoint.offset,
        transform: `translate3d(${((.02 + waypoint.x * Math.max(0, .96 - widthRatio)) * viewportWidth).toFixed(1)}px, ${waypoint.y.toFixed(1)}px, 0) rotate(${waypoint.tilt.toFixed(2)}deg)`,
        easing: index < patrol.waypoints.length - 1 ? "ease-in-out" : "linear",
      }));

      animation = vehicle.animate(frames, {
        duration: patrol.duration * 1000,
        fill: "forwards",
      });
      if (vehicle.parentElement?.dataset.motionPaused === "true" || document.hidden) animation.pause();
      animation.onfinish = () => {
        if (stopped) return;
        animation?.cancel();
        animation = null;
        startPatrol();
      };
    };

    const alignToGround = (retried = false) => {
      const scene = vehicle.parentElement;
      const landscape = scene?.querySelector<SVGSVGElement>(".pixel-forest");
      const matrix = landscape?.getScreenCTM();
      // SVG not laid out yet (first paint / hidden tab) — retry on next frame
      // instead of pinning the UGV to the 70% fallback forever.
      if (!scene || !matrix || vehicle.offsetWidth < 10) {
        if (!retried && !stopped) {
          window.requestAnimationFrame(() => alignToGround(true));
        }
        return;
      }
      // The grass surface is y=326; the SVG track contact is y=153.
      const groundY = matrix.d * 326 + matrix.f - scene.getBoundingClientRect().top;
      vehicle.style.setProperty("--ugv-top", `${groundY - vehicle.offsetWidth * 153 / 420}px`);
    };
    const handleMotionPreference = () => {
      alignToGround();
      animation?.cancel();
      animation = null;
      if (reducedMotion.matches) {
        vehicle.style.left = "50%";
        vehicle.style.transform = "translateX(-50%)";
      } else {
        startPatrol();
      }
    };

    const handleResize = () => {
      // Re-align + restart the patrol when the hero itself resizes (e.g.
      // fullscreen toggle), debounced so observer callbacks during a patrol
      // don't teleport the UGV every frame.
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (stopped) return;
        handleMotionPreference();
      }, 180);
    };

    alignToGround();
    if (reducedMotion.matches) handleMotionPreference();
    else startPatrol();
    reducedMotion.addEventListener("change", handleMotionPreference);
    // Recalculate the patrol bounds on rotation and responsive breakpoint changes.
    const resize = new ResizeObserver(handleResize);
    resize.observe(vehicle);
    if (vehicle.parentElement) resize.observe(vehicle.parentElement);

    return () => {
      stopped = true;
      patrolCount.current = 0;
      animation?.cancel();
      window.clearTimeout(retryId);
      window.clearTimeout(resizeTimer);
      resize.disconnect();
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <div className="forest-ugv" ref={vehicleRef}>
      <div className="forest-ugv__body">
        <svg viewBox="0 0 420 220" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="ugv-hull" x1="102" y1="48" x2="310" y2="128" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6e8878" />
            <stop offset="0.48" stopColor="#334f4b" />
            <stop offset="1" stopColor="#1d3537" />
          </linearGradient>
        </defs>

        {/* Tight contact shadow beneath the tracks keeps the rover grounded. */}
        <ellipse cx="210" cy="153" rx="160" ry="4" fill="#04120e" fillOpacity=".7" />

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

        <g className="forest-ugv__suspension">
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
        </g>
        </svg>
      </div>
    </div>
  );
}

export function ForestMissionScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  useAmbientActivity(sceneRef);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      if (scene.dataset.motionPaused === "true") { frame = 0; return; }
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      scene.style.setProperty("--scene-x", `${currentX.toFixed(2)}px`);
      scene.style.setProperty("--scene-y", `${currentY.toFixed(2)}px`);
      if (Math.abs(targetX - currentX) > 0.06 || Math.abs(targetY - currentY) > 0.06) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches || scene.dataset.motionPaused === "true") return;
      targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * -24;
      targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * -16;
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const handlePointerReset = () => {
      targetX = 0;
      targetY = 0;
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const handleMotionChange = () => {
      if (reducedMotion.matches) handlePointerReset();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", handlePointerReset);
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handlePointerReset);
      reducedMotion.removeEventListener("change", handleMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="forest-mission-scene" ref={sceneRef} aria-hidden="true">
      <div className="forest-mission-scene__drift"><PixelForest /></div>
      <div className="forest-mission-scene__vignette" />
      <AmbientDetails drones={false} />

      <div className="forest-hud">
        <div className="forest-hud__corner forest-hud__corner--tl">
          <span>13.35° N / 74.79° E</span>
          <strong>MIT Manipal · Western Ghats</strong>
        </div>
        <div className="forest-hud__corner forest-hud__corner--tr">
          <span>Forest patrol</span>
          <strong>Autonomy · Nominal</strong>
        </div>
        <div className="forest-hud__corner forest-hud__corner--bl">
          <span>Platform</span>
          <strong>Walrus MK-II / UGV</strong>
        </div>
        <div className="forest-hud__corner forest-hud__corner--br">
          <span>Airborne</span>
          <strong>Scout swarm · Active</strong>
        </div>
      </div>

      {Array.from({ length: 6 }, (_, index) => <ScoutDrone key={index} index={index} />)}
      <GroundVehicle />
    </div>
  );
}
