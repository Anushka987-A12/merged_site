"use client";

import { useEffect, useRef } from "react";

type ParticleCanvasProps = {
  className?: string;
};

type Particle = { x: number; y: number; vx: number; vy: number; radius: number; phase: number; flare: boolean };
type Drone = {
  x: number;
  y: number;
  direction: -1 | 1;
  speed: number;
  scale: number;
  phase: number;
  rotor: number;
  lightPhase: number;
};

export function ParticleCanvas({ className }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let drones: Drone[] = [];

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(96, Math.round((width * height) / 13500)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.4 + 0.5,
        phase: Math.random() * Math.PI * 2,
        flare: Math.random() < 0.16,
      }));
      const droneCount = Math.max(4, Math.min(8, Math.round(width / 210)));
      drones = Array.from({ length: droneCount }, () => ({
        x: Math.random() * width,
        y: height * (0.08 + Math.random() * 0.5),
        direction: Math.random() < 0.5 ? -1 : 1,
        speed: 0.28 + Math.random() * 0.38,
        scale: 0.34 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        rotor: Math.random() * Math.PI * 2,
        lightPhase: Math.random() * Math.PI * 2,
      }));
      render(false);
    };

    const drawParticles = (advance: boolean) => {
      context.clearRect(0, 0, width, height);
      for (let index = 0; index < particles.length; index += 1) {
        const point = particles[index];
        if (advance) {
          point.x += point.vx;
          point.y += point.vy;
          if (point.x < 0 || point.x > width) point.vx *= -1;
          if (point.y < 0 || point.y > height) point.vy *= -1;
          point.phase += 0.018;
        }

        const twinkle = (Math.sin(point.phase) + 1) / 2;
        const alpha = 0.2 + twinkle * 0.62;
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(218, 235, 244, ${alpha})`;
        context.fill();

        if (point.flare) {
          const flareSize = point.radius * (3.4 + twinkle * 3.4);
          context.beginPath();
          context.moveTo(point.x - flareSize, point.y);
          context.lineTo(point.x + flareSize, point.y);
          context.moveTo(point.x, point.y - flareSize);
          context.lineTo(point.x, point.y + flareSize);
          context.strokeStyle = `rgba(218, 235, 244, ${alpha * 0.6})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
      }
    };

    const drawDrone = (drone: Drone, advance: boolean) => {
      if (advance) {
        drone.x += drone.speed * drone.direction;
        drone.phase += 0.014;
        drone.rotor += 0.38;
        drone.lightPhase += 0.04;
        if (drone.direction > 0 && drone.x > width + 90) {
          drone.x = -90;
          drone.y = height * (0.08 + Math.random() * 0.5);
        } else if (drone.direction < 0 && drone.x < -90) {
          drone.x = width + 90;
          drone.y = height * (0.08 + Math.random() * 0.5);
        }
      }

      const bob = Math.sin(drone.phase) * 4;
      const x = drone.x;
      const y = drone.y + bob;
      const scale = drone.scale;
      const tailX = x - drone.direction * 58 * scale;
      const trail = context.createLinearGradient(tailX, y, x, y);
      trail.addColorStop(0, "rgba(90, 167, 205, 0)");
      trail.addColorStop(1, "rgba(90, 167, 205, 0.22)");
      context.strokeStyle = trail;
      context.lineWidth = 1.3;
      context.beginPath();
      context.moveTo(tailX, y + Math.sin(drone.phase - 0.7) * 3);
      context.lineTo(x, y);
      context.stroke();

      context.save();
      context.translate(x, y);
      context.rotate(Math.sin(drone.phase) * 0.035);
      context.scale(scale * drone.direction, scale);

      const arms: Array<[number, number]> = [[-27, -15], [27, -15], [-27, 16], [27, 16]];
      context.strokeStyle = "rgba(127, 175, 205, 0.75)";
      context.lineWidth = 3.2;
      context.lineCap = "round";
      context.beginPath();
      for (const [ax, ay] of arms) {
        context.moveTo(0, 0);
        context.lineTo(ax, ay);
      }
      context.stroke();

      const body = context.createLinearGradient(0, -8, 0, 8);
      body.addColorStop(0, "#526d7a");
      body.addColorStop(0.5, "#233844");
      body.addColorStop(1, "#101d24");
      context.fillStyle = body;
      context.strokeStyle = "rgba(154, 204, 225, 0.85)";
      context.lineWidth = 1.1;
      context.beginPath();
      context.moveTo(-16, -2);
      context.quadraticCurveTo(-12, -8, 0, -7);
      context.quadraticCurveTo(13, -7, 17, 0);
      context.quadraticCurveTo(12, 8, 0, 7);
      context.quadraticCurveTo(-12, 7, -16, 2);
      context.closePath();
      context.fill();
      context.stroke();

      context.fillStyle = "rgba(130, 199, 223, 0.6)";
      context.beginPath();
      context.ellipse(-3, -3, 7, 2.7, -0.12, 0, Math.PI * 2);
      context.fill();

      for (const [index, [mx, my]] of arms.entries()) {
        context.fillStyle = "#172831";
        context.strokeStyle = "rgba(154, 204, 225, 0.7)";
        context.lineWidth = 1;
        context.beginPath();
        context.arc(mx, my, 4.8, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.save();
        context.translate(mx, my);
        context.rotate(drone.rotor + index * 0.6);
        context.fillStyle = "rgba(199, 225, 238, 0.44)";
        context.beginPath();
        context.ellipse(0, 0, 12, 1.5, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      const blink = (Math.sin(drone.lightPhase) + 1) / 2;
      context.fillStyle = `rgba(112, 221, 164, ${0.25 + blink * 0.7})`;
      context.beginPath();
      context.arc(-8, 0, 1.7, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = `rgba(255, 173, 94, ${0.25 + (1 - blink) * 0.7})`;
      context.beginPath();
      context.arc(9, 0, 1.7, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const render = (advance: boolean) => {
      drawParticles(advance);
      for (const drone of drones) drawDrone(drone, advance);
    };

    const animate = () => {
      render(true);
      frame = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => window.cancelAnimationFrame(frame);
    const startAnimation = () => {
      stopAnimation();
      if (motionPreference.matches || document.visibilityState !== "visible") {
        render(false);
        return;
      }
      animate();
    };

    const updateMotion = () => {
      startAnimation();
    };

    const updateVisibility = () => {
      if (document.visibilityState === "visible") startAnimation();
      else stopAnimation();
    };

    resize();
    updateMotion();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement ?? canvas);
    window.addEventListener("resize", resize);
    motionPreference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      motionPreference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
