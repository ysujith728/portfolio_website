"use client";

import React from "react";
import { motion } from "framer-motion";
import { AgentState, ToolInfo } from "../../types/agent";

interface AgentFallbackProps {
  state: AgentState;
  activeTool: ToolInfo | null;
  targetLabel: string | null;
  reducedMotion?: boolean;
}

export const AgentFallback: React.FC<AgentFallbackProps> = ({
  state,
  activeTool,
  targetLabel,
  reducedMotion = false,
}) => {
  const isThrowing = state === "THROW" || state === "AIM" || state === "TOOL_EQUIP";
  const glowColor = activeTool?.color || "#00f0ff";

  return (
    <div className="relative w-72 h-96 flex flex-col items-center justify-center select-none">
      {/* Background Holographic Rings */}
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                rotate: 360,
              }
        }
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-cyan-500/20 pointer-events-none"
        style={{
          boxShadow: `0 0 30px ${glowColor}22`,
        }}
      />
      <motion.div
        animate={
          reducedMotion
            ? {}
            : {
                rotate: -360,
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 rounded-full border border-dashed border-cyan-400/30 pointer-events-none"
      />

      {/* Cybernetic Robot SVG Silhouette */}
      <svg
        viewBox="0 0 200 260"
        className="w-56 h-72 drop-shadow-[0_0_20px_rgba(0,240,255,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pedestal / Ground Discs */}
        <ellipse cx="100" cy="245" rx="70" ry="10" fill="#00f0ff" fillOpacity="0.1" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 2" />
        <ellipse cx="100" cy="245" rx="45" ry="6" fill="#00f0ff" fillOpacity="0.15" />

        {/* Legs / Chassis Pillar */}
        <path d="M80 180 L75 240 L90 240 L92 180 Z" fill="#334155" stroke="#38bdf8" strokeWidth="2" />
        <path d="M120 180 L125 240 L110 240 L108 180 Z" fill="#334155" stroke="#38bdf8" strokeWidth="2" />

        {/* Torso Carapace (Titanium White with Cyan Outlines) */}
        <path
          d="M60 85 L140 85 L125 175 L75 175 Z"
          fill="#f8fafc"
          stroke="#00f0ff"
          strokeWidth="2.5"
          className="transition-all duration-300 shadow-[0_0_15px_#00f0ff]"
        />

        {/* Chest Reactor Core */}
        <circle cx="100" cy="120" r="17" fill="#0284c7" fillOpacity="0.5" stroke={glowColor} strokeWidth="2.5" />
        <motion.circle
          cx="100"
          cy="120"
          r="10"
          fill={glowColor}
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, 1.25, 1],
                  opacity: [0.8, 1, 0.8],
                }
          }
          transition={{ duration: 1.8, repeat: Infinity }}
        />

        {/* Torso Detail Accent Lines */}
        <line x1="75" y1="100" x2="90" y2="110" stroke="#0284c7" strokeWidth="2" />
        <line x1="125" y1="100" x2="110" y2="110" stroke="#0284c7" strokeWidth="2" />
        <line x1="80" y1="150" x2="120" y2="150" stroke="#0284c7" strokeWidth="2" />

        {/* Neck */}
        <rect x="92" y="68" width="16" height="18" rx="2" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Head / Helmet (Titanium White) */}
        <motion.g
          animate={
            reducedMotion
              ? {}
              : {
                  y: [0, -3, 0],
                  rotate: state === "AIM" ? [0, 5, 0] : [0, 0, 0],
                }
          }
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M72 45 L100 25 L128 45 L124 72 L76 72 Z"
            fill="#f8fafc"
            stroke="#00f0ff"
            strokeWidth="2.5"
          />

          {/* Visor Area (Vibrant Neon Visor) */}
          <rect x="78" y="43" width="44" height="14" rx="3" fill="#00f0ff" stroke="#38bdf8" strokeWidth="1.5" />
          
          {/* Scanning Eye Beam */}
          <motion.rect
            x="84"
            y="46"
            width="14"
            height="8"
            rx="2"
            fill="#ffffff"
            animate={
              reducedMotion
                ? {}
                : {
                    x: [82, 104, 82],
                  }
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Antenna */}
          <line x1="120" y1="28" x2="135" y2="12" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="135" cy="12" r="3" fill="#00f0ff" />
        </motion.g>

        {/* Left Arm (Titanium White) */}
        <path d="M58 88 L35 130 L45 180" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="58" cy="88" r="8" fill="#f8fafc" stroke="#00f0ff" strokeWidth="2" />

        {/* Right Arm (Articulated Aim/Throw) */}
        <motion.g
          animate={
            isThrowing
              ? {
                  rotate: [-15, 35, -20, 0],
                  originX: "142px",
                  originY: "88px",
                }
              : {
                  rotate: [0, -4, 0],
                  originX: "142px",
                  originY: "88px",
                }
          }
          transition={{ duration: isThrowing ? 0.6 : 3, repeat: isThrowing ? 0 : Infinity }}
        >
          <path d="M142 88 L165 125 L160 170" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="142" cy="88" r="8" fill="#f8fafc" stroke="#00f0ff" strokeWidth="2" />

          {/* Hand Tool Emitter */}
          <circle cx="160" cy="170" r="8" fill="#1e293b" stroke={glowColor} strokeWidth="1.5" />
          {activeTool && (
            <motion.circle
              cx="160"
              cy="170"
              r="12"
              fill={activeTool.color}
              fillOpacity="0.4"
              stroke={activeTool.color}
              strokeWidth="2"
              animate={{ scale: [0.8, 1.4, 0.8] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.g>
      </svg>

      {/* State Telemetry Tag */}
      <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-black/60 border border-cyan-500/30 rounded-full font-mono text-[10px] text-cyan-400">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>AGENT: {state}</span>
        {targetLabel && (
          <span className="text-gray-400">| TARGET: {targetLabel.toUpperCase()}</span>
        )}
      </div>
    </div>
  );
};
