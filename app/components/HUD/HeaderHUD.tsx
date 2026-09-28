"use client";

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Eye, Zap, Shield, Terminal } from "lucide-react";
import { soundEngine } from "../../lib/sound";

interface HeaderHUDProps {
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  systemStatus: string;
  onOpenCommandPalette?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  reducedMotion,
  onToggleReducedMotion,
  soundMuted,
  onToggleSound,
  systemStatus,
  onOpenCommandPalette,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toTimeString().split(" ")[0] +
          "." +
          Math.floor(now.getMilliseconds() / 100)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b border-cyan-500/20 bg-slate-950/70 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between z-30 select-none">
      {/* Brand Identity / OS Title */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-cyan-400/60 bg-cyan-950/40 text-cyan-400 font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)]">
          <Terminal className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm tracking-widest text-white">
              YSUJITH728
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              v2.8.4
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
            AI ENGINEER & AUTONOMOUS ROBOTICS SYSTEMS
          </p>
        </div>
      </div>

      {/* Center Tactical Status */}
      <div className="hidden md:flex items-center gap-6 font-mono text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span className="text-slate-400">STATUS:</span>
          <span className="text-emerald-400 font-semibold">{systemStatus}</span>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">AGENT CORE:</span>
          <span className="text-cyan-300">ONLINE</span>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">PWR:</span>
          <span className="text-amber-300">99.8%</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>TIME:</span>
          <span className="text-white font-mono">{timeStr || "--:--:--"}</span>
        </div>
      </div>

      {/* Right Tactical Control Toggles */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Trigger */}
        {onOpenCommandPalette && (
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onOpenCommandPalette();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 text-xs font-mono transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            title="Open Command Palette (Ctrl+K or /)"
          >
            <span className="text-[11px] font-semibold hidden sm:inline">PALETTE</span>
            <kbd className="px-1.5 py-0.2 rounded bg-black/60 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Sound FX Toggle */}
        <button
          type="button"
          onClick={() => {
            onToggleSound();
            soundEngine.playClick();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            !soundMuted
              ? "border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              : "border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200"
          }`}
          title={soundMuted ? "Unmute Tactical SFX" : "Mute SFX"}
          aria-label="Toggle tactical sound effects"
        >
          {!soundMuted ? (
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className="hidden sm:inline-block text-[11px]">
            {!soundMuted ? "SFX ON" : "MUTED"}
          </span>
        </button>

        {/* Reduced Motion Toggle */}
        <button
          type="button"
          onClick={() => {
            onToggleReducedMotion();
            soundEngine.playClick();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all ${
            reducedMotion
              ? "border-amber-500/60 bg-amber-950/40 text-amber-300"
              : "border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200"
          }`}
          title="Toggle Reduced Motion"
          aria-label="Toggle reduced motion accessibility mode"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline-block text-[11px]">
            {reducedMotion ? "REDUCED MOTION" : "FULL 3D FX"}
          </span>
        </button>
      </div>
    </header>
  );
};

