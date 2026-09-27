"use client";

import React from "react";
import { AgentTelemetry } from "../../types/agent";
import { Cpu, Crosshair, Terminal, Activity } from "lucide-react";

interface AgentStatusPanelProps {
  telemetry: AgentTelemetry;
  targetLabel: string | null;
  onQuickDispatch?: () => void;
}

export const AgentStatusPanel: React.FC<AgentStatusPanelProps> = ({
  telemetry,
  targetLabel,
  onQuickDispatch,
}) => {
  const isEngaged =
    telemetry.state !== "IDLE" &&
    telemetry.state !== "SCANNING" &&
    telemetry.state !== "RETURN_IDLE";

  const toolColor = telemetry.currentTool?.color || "#38bdf8";

  return (
    <div className="w-full max-w-lg mx-auto rounded-xl border border-cyan-500/30 bg-slate-950/85 backdrop-blur-md p-3.5 sm:p-4 text-xs font-mono text-slate-300 shadow-[0_0_25px_rgba(0,240,255,0.12)] relative overflow-hidden select-none">
      {/* Top accent line with animated scanner */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

      {/* Header bar: Title & Telemetry State */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white tracking-widest text-[11px] sm:text-xs">
            AI AGENT TELEMETRY
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            AEGIS-CORE
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <span
            className={`w-2 h-2 rounded-full ${
              isEngaged
                ? "bg-amber-400 animate-ping shadow-[0_0_8px_#f59e0b]"
                : "bg-emerald-400 shadow-[0_0_8px_#10b981]"
            }`}
          />
          <span className={isEngaged ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
            {isEngaged ? "TARGETING" : "STANDBY"}
          </span>
        </div>
      </div>

      {/* 4-Column Grid Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5 bg-slate-900/60 p-2 sm:p-2.5 rounded-lg border border-slate-800/80 text-[10px] sm:text-[11px]">
        <div>
          <span className="text-[9px] text-slate-400 block uppercase">STATE</span>
          <span className="text-cyan-300 font-semibold tracking-wide truncate block">
            {telemetry.state}
          </span>
        </div>

        <div>
          <span className="text-[9px] text-slate-400 block uppercase">MODE</span>
          <span className="text-indigo-300 font-semibold truncate block">
            AUTONOMOUS
          </span>
        </div>

        <div>
          <span className="text-[9px] text-slate-400 block uppercase">TARGET</span>
          <span
            className={`font-semibold truncate flex items-center gap-1 ${
              targetLabel ? "text-white" : "text-slate-400"
            }`}
          >
            <Crosshair className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">{targetLabel ? targetLabel.toUpperCase() : "AWAITING"}</span>
          </span>
        </div>

        <div>
          <span className="text-[9px] text-slate-400 block uppercase">ARMED TOOL</span>
          <span
            className="font-semibold truncate block"
            style={{ color: toolColor }}
          >
            {telemetry.currentTool ? (
              <span className="truncate block">
                {telemetry.currentTool.glyph} {telemetry.currentTool.name}
              </span>
            ) : (
              "HOLSTERED"
            )}
          </span>
        </div>
      </div>

      {/* Directive Protocol Message */}
      <div className="flex items-center gap-2 border border-cyan-500/20 bg-cyan-950/20 px-2.5 py-1.5 rounded-lg mb-2 text-[10px] sm:text-[11px]">
        <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
        <p className="text-slate-200 italic truncate">
          &ldquo;{telemetry.statusMessage}&rdquo;
        </p>
      </div>

      {/* Latest Command Log */}
      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-emerald-400 bg-black/60 px-2.5 py-1 rounded border border-slate-900 overflow-hidden">
        <Terminal className="w-3 h-3 text-slate-500 shrink-0" />
        <span className="text-slate-400 shrink-0">&gt;</span>
        <span className="truncate">
          {telemetry.systemLogs[telemetry.systemLogs.length - 1] ||
            "SYSTEM READY. AWAITING USER INPUT."}
        </span>
      </div>
    </div>
  );
};
