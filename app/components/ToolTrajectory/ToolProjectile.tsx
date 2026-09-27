"use client";

import React, { useEffect, useRef, useState } from "react";
import { ToolInfo, TrajectoryVector } from "../../types/agent";
import { computeTrajectoryVector, evaluateBezier } from "../../lib/trajectory";
import { soundEngine } from "../../lib/sound";

interface ToolProjectileProps {
  tool: ToolInfo;
  startPos: { x: number; y: number };
  targetPos: { x: number; y: number };
  onImpact: () => void;
  reducedMotion?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const ToolProjectile: React.FC<ToolProjectileProps> = ({
  tool,
  startPos,
  targetPos,
  onImpact,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentCoord, setCurrentCoord] = useState<{ x: number; y: number; angle: number }>({
    x: startPos.x,
    y: startPos.y,
    angle: 0,
  });
  const [impactHappened, setImpactHappened] = useState(false);
  const [impactPos, setImpactPos] = useState<{ x: number; y: number }>({ x: targetPos.x, y: targetPos.y });

  const onImpactRef = useRef(onImpact);
  onImpactRef.current = onImpact;

  useEffect(() => {
    // If reduced motion is requested, immediate impact
    if (reducedMotion) {
      soundEngine.playImpact();
      onImpactRef.current();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const vector: TrajectoryVector = computeTrajectoryVector(
      startPos.x,
      startPos.y,
      targetPos.x,
      targetPos.y,
      0.35
    );

    let progress = 0;
    const durationMs = 650; // Dynamic ~650ms smooth flight
    let startTime: number | null = null;
    let animId: number;

    const trailParticles: Particle[] = [];
    const impactParticles: Particle[] = [];

    soundEngine.playThrow();

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      progress = Math.min(1, elapsed / durationMs);

      // Ease in-out quadratic for smooth propulsion
      const easedT =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      const pt = evaluateBezier(easedT, vector);
      setCurrentCoord(pt);

      // Clear trail canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Add trail particles behind the tool
      if (progress < 0.98) {
        for (let i = 0; i < 3; i++) {
          trailParticles.push({
            x: pt.x + (Math.random() - 0.5) * 10,
            y: pt.y + (Math.random() - 0.5) * 10,
            vx: -Math.cos(pt.angle) * (1 + Math.random() * 2),
            vy: -Math.sin(pt.angle) * (1 + Math.random() * 2),
            size: 2 + Math.random() * 3.5,
            alpha: 0.9,
            color: tool.color,
          });
        }
      }

      // Render and update trail particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.028;

        if (p.alpha <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Check arrival
      if (progress >= 1 && !impactHappened) {
        setImpactHappened(true);
        setImpactPos({ x: targetPos.x, y: targetPos.y });
        soundEngine.playImpact();

        // Spawn impact particle burst
        for (let i = 0; i < 35; i++) {
          const speed = 2 + Math.random() * 6;
          const theta = Math.random() * Math.PI * 2;
          impactParticles.push({
            x: targetPos.x,
            y: targetPos.y,
            vx: Math.cos(theta) * speed,
            vy: Math.sin(theta) * speed,
            size: 2 + Math.random() * 4,
            alpha: 1,
            color: i % 2 === 0 ? tool.color : "#ffffff",
          });
        }

        // Fire parent onImpact callback
        onImpactRef.current();
      }

      // Render impact shockwave burst
      if (impactParticles.length > 0) {
        for (let i = impactParticles.length - 1; i >= 0; i--) {
          const ip = impactParticles[i];
          ip.x += ip.vx;
          ip.y += ip.vy;
          ip.vx *= 0.95;
          ip.vy *= 0.95;
          ip.alpha -= 0.035;

          if (ip.alpha <= 0) {
            impactParticles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = ip.alpha;
          ctx.fillStyle = ip.color;
          ctx.shadowColor = ip.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(ip.x, ip.y, ip.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (progress < 1 || impactParticles.length > 0) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [startPos, targetPos, tool, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Particle & Trail Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Travelling 3D Tool Hologram */}
      {!impactHappened && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{
            transform: `translate3d(${currentCoord.x}px, ${currentCoord.y}px, 0) rotate(${currentCoord.angle}rad)`,
          }}
        >
          {/* Tool Mesh Hologram Representation */}
          <div
            className="relative flex items-center justify-center w-12 h-12 rounded-xl backdrop-blur-md border border-cyan-400/80 shadow-2xl animate-spin"
            style={{
              backgroundColor: `${tool.color}33`,
              boxShadow: `0 0 25px ${tool.color}, inset 0 0 15px ${tool.color}`,
              animationDuration: "2s",
            }}
          >
            <span
              className="text-xl font-mono font-bold select-none drop-shadow-[0_0_8px_white]"
              style={{ color: "#ffffff" }}
            >
              {tool.glyph}
            </span>

            {/* Orbiting data rings */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-white/60 animate-ping"
              style={{ animationDuration: "1s" }}
            />
          </div>
        </div>
      )}

      {/* Target Impact Shockwave */}
      {impactHappened && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${impactPos.x}px`,
            top: `${impactPos.y}px`,
          }}
        >
          {/* Expanding Energy Rings */}
          <div
            className="w-24 h-24 rounded-full border-2 border-cyan-300 animate-ping"
            style={{
              borderColor: tool.color,
              boxShadow: `0 0 30px ${tool.color}`,
              animationDuration: "0.6s",
              animationIterationCount: 1,
            }}
          />
        </div>
      )}
    </div>
  );
};
