"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Shield, Cpu, ChevronRight } from "lucide-react";
import { soundEngine } from "../../lib/sound";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING QUANTUM KERNEL v2.8.4 ...",
  "CONNECTING SUB-SURFACE NEURAL REGISTERS ...",
  "CALIBRATING ARTICULATED MECHANISMS & SERVO BUS [OK]",
  "SYNCHRONIZING REPOSITORY GRAPH FOR YSUJITH728 ...",
  "POWERING EMBEDDED KINEMATIC SIMULATOR [30 FPS EDGE CAPABLE]",
  "TOOL DISPATCH MATRIX: ALL 11 UNITS DOCKED & ARMED",
  "AUTONOMOUS AGENT ONLINE. DEPLOYING INTERFACE HUD ...",
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[currentLine]]);
        setProgress(Math.round(((currentLine + 1) / BOOT_LOGS.length) * 100));
        soundEngine.playHover();
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          soundEngine.playSuccess();
          onComplete();
        }, 350);
      }
    }, 220);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6 select-none font-mono">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="relative w-full max-w-xl border border-cyan-500/40 bg-slate-950/90 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-400 font-bold text-sm tracking-widest">
              SYSTEM BOOT SEQUENCE // YSUJITH728
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onComplete();
            }}
            className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white px-2.5 py-1 rounded border border-cyan-500/40 hover:border-cyan-400 transition-all bg-cyan-950/40 cursor-pointer"
          >
            <span>FAST BOOT</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Boot Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>CORE SUBSYSTEMS COMPILING</span>
            </span>
            <span className="text-cyan-300 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-400 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Diagnostics Output Stream */}
        <div className="bg-black/70 border border-slate-800 rounded-lg p-3.5 h-48 overflow-y-auto font-mono text-[11px] text-cyan-300 space-y-1.5 shadow-inner">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-slate-500 select-none">&gt;&gt;</span>
              <span className={idx === logs.length - 1 ? "text-white font-semibold" : "opacity-80"}>
                {log}
              </span>
            </div>
          ))}
          {progress < 100 && (
            <div className="flex items-center gap-1 text-slate-500 animate-pulse">
              <span>_</span>
            </div>
          )}
        </div>

        {/* Footer Identity Status */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>SECURITY LEVEL: AUTHORIZED</span>
          </div>
          <span className="text-cyan-400">HOST: ysujith728.portfolio</span>
        </div>
      </div>
    </div>
  );
};
