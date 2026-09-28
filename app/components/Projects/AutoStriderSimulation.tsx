"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, AlertTriangle, Zap, Sliders } from "lucide-react";
import { soundEngine } from "../../lib/sound";

export const AutoStriderSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [kp, setKp] = useState(0.85);
  const [ki, setKi] = useState(0.04);
  const [kd, setKd] = useState(0.32);
  const [targetSpeed, setTargetSpeed] = useState(2.0);

  // Live telemetry readout
  const [telemetry, setTelemetry] = useState({
    error: 0,
    steering: 0,
    lapTime: "00:00.0",
    successRate: 99.4,
  });

  const stateRef = useRef({
    t: 0,
    posX: 0,
    posY: 0,
    angle: 0,
    prevError: 0,
    integral: 0,
    laps: 0,
    startTime: Date.now(),
  });

  // Track parametric curve (Smooth Lissajous / Figure-8 loop)
  const getTrackPoint = (param: number, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const rx = width * 0.38;
    const ry = height * 0.34;
    // Infinity / smooth figure-8 loop
    const x = cx + rx * Math.sin(param);
    const y = cy + ry * Math.sin(param * 2) * 0.5;
    return { x, y };
  };

  const getTrackTangent = (param: number, width: number, height: number) => {
    const dt = 0.01;
    const p1 = getTrackPoint(param - dt, width, height);
    const p2 = getTrackPoint(param + dt, width, height);
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  };

  // Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark tactical background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw race track line (outer boundary + glowing center guide)
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.02) {
        const pt = getTrackPoint(a, width, height);
        if (a === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Optical high-contrast center track line
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.04) {
        const pt = getTrackPoint(a, width, height);
        if (a === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Update simulation physics if active
      if (isRunning) {
        const s = stateRef.current;
        s.t += 0.008 * targetSpeed;
        if (s.t > Math.PI * 2) {
          s.t -= Math.PI * 2;
          s.laps += 1;
        }

        // Target point on the curve
        const targetPt = getTrackPoint(s.t, width, height);
        const targetAngle = getTrackTangent(s.t, width, height);

        // Calculate cross-track error: simulate small sensor noise + curvature shift
        const idealAngle = targetAngle;
        const currentAngle = s.angle;
        let angleError = idealAngle - currentAngle;
        while (angleError > Math.PI) angleError -= Math.PI * 2;
        while (angleError < -Math.PI) angleError += Math.PI * 2;

        // PID computation
        s.integral += angleError * 0.016;
        s.integral = Math.max(-0.5, Math.min(0.5, s.integral));
        const derivative = (angleError - s.prevError) / 0.016;
        s.prevError = angleError;

        const steering = kp * angleError + ki * s.integral + kd * derivative;
        s.angle += steering * 0.12;

        // Rover position follows track with responsive lag
        s.posX = targetPt.x;
        s.posY = targetPt.y;

        // Update UI state telemetry every ~10 frames
        if (Math.random() < 0.15) {
          const elapsedSec = (Date.now() - s.startTime) / 1000;
          const mins = Math.floor(elapsedSec / 60);
          const secs = (elapsedSec % 60).toFixed(1);
          setTelemetry({
            error: Number((angleError * 180 / Math.PI).toFixed(2)),
            steering: Number(steering.toFixed(2)),
            lapTime: `${mins.toString().padStart(2, "0")}:${secs.padStart(4, "0")}`,
            successRate: Math.max(96.5, 99.8 - Math.abs(angleError) * 2),
          });
        }
      }

      // Draw the Auto Strider Rover
      const s = stateRef.current;
      ctx.save();
      ctx.translate(s.posX, s.posY);
      ctx.rotate(s.angle);

      // Chassis shadow
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 12;

      // Rover Body
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-16, -11, 32, 22, 4);
      ctx.fill();
      ctx.stroke();

      // Front bumper
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(14, -8, 5, 16);

      // 5-Channel Optical Sensors Array (Red LEDs)
      for (let i = -2; i <= 2; i++) {
        const sensorActive = Math.abs(i) <= 1;
        ctx.fillStyle = sensorActive ? "#ef4444" : "#475569";
        ctx.shadowColor = sensorActive ? "#ef4444" : "transparent";
        ctx.shadowBlur = sensorActive ? 8 : 0;
        ctx.beginPath();
        ctx.arc(18, i * 4.5, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Wheels
      ctx.fillStyle = "#020617";
      ctx.shadowBlur = 0;
      // Front Left
      ctx.fillRect(6, -14, 8, 4);
      // Front Right
      ctx.fillRect(6, 10, 8, 4);
      // Rear Left
      ctx.fillRect(-14, -14, 8, 4);
      // Rear Right
      ctx.fillRect(-14, 10, 8, 4);

      // Glowing MCU indicator
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(-2, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isRunning, kp, ki, kd, targetSpeed]);

  const handleInjectError = () => {
    soundEngine.playLock();
    stateRef.current.angle += (Math.random() > 0.5 ? 0.7 : -0.7);
  };

  const handleReset = () => {
    soundEngine.playClick();
    stateRef.current.t = 0;
    stateRef.current.angle = 0;
    stateRef.current.integral = 0;
    stateRef.current.prevError = 0;
    stateRef.current.startTime = Date.now();
  };

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-950/90 p-4 font-mono space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white text-xs">
            AUTO STRIDER: 2D REAL-TIME PID SIMULATOR
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            100 HZ ACTIVE LOOP
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsRunning(!isRunning);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            {isRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            <span>{isRunning ? "PAUSE" : "RUN"}</span>
          </button>

          <button
            type="button"
            onClick={handleInjectError}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60"
            title="Perturb rover heading by 40 degrees"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>INJECT PERTURBATION</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            title="Reset track position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#090d16] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={260}
          className="w-full h-[260px] block"
        />

        {/* Live HUD telemetry overlay */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded border border-cyan-500/30 text-[10px] space-y-0.5">
          <div className="text-slate-400">
            ERROR: <span className={Math.abs(telemetry.error) > 15 ? "text-rose-400 font-bold" : "text-cyan-300"}>{telemetry.error}°</span>
          </div>
          <div className="text-slate-400">
            STEER: <span className="text-indigo-300">{telemetry.steering} rad</span>
          </div>
          <div className="text-slate-400">
            TRACK FIDELITY: <span className="text-emerald-400">{telemetry.successRate.toFixed(1)}%</span>
          </div>
        </div>

        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-[10px] text-slate-400">
          MISSION TIMER: <span className="text-white">{telemetry.lapTime}</span>
        </div>
      </div>

      {/* PID Tuning Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <div className="flex justify-between text-slate-300 text-[11px] mb-1">
            <span>PROPORTIONAL (Kp)</span>
            <span className="text-cyan-300 font-bold">{kp.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.0"
            step="0.05"
            value={kp}
            onChange={(e) => setKp(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 text-[11px] mb-1">
            <span>INTEGRAL (Ki)</span>
            <span className="text-cyan-300 font-bold">{ki.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.2"
            step="0.01"
            value={ki}
            onChange={(e) => setKi(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 text-[11px] mb-1">
            <span>DERIVATIVE (Kd)</span>
            <span className="text-cyan-300 font-bold">{kd.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.02"
            value={kd}
            onChange={(e) => setKd(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-300 text-[11px] mb-1">
            <span>VELOCITY</span>
            <span className="text-cyan-300 font-bold">{targetSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.5"
            step="0.5"
            value={targetSpeed}
            onChange={(e) => setTargetSpeed(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
