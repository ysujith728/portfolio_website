"use client";

import React, { useEffect } from "react";
import { NavDestination } from "../../types/agent";
import { X, Sparkles, Terminal } from "lucide-react";
import { soundEngine } from "../../lib/sound";

interface SectionModalProps {
  destination: NavDestination;
  onClose: () => void;
  children: React.ReactNode;
}

export const SectionModal: React.FC<SectionModalProps> = ({
  destination,
  onClose,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        soundEngine.playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toolColor = destination.tool.color;

  return (
    <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Background cyber grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Container */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-slate-950/95 border rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 my-auto"
        style={{
          borderColor: `${toolColor}66`,
          boxShadow: `0 0 40px ${toolColor}22, inset 0 0 20px ${toolColor}11`,
        }}
      >
        {/* Holographic Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 sm:px-6 py-3.5 select-none">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center border font-mono font-bold text-sm"
              style={{
                backgroundColor: `${toolColor}22`,
                borderColor: toolColor,
                color: toolColor,
              }}
            >
              {destination.tool.glyph}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold font-mono text-sm sm:text-base tracking-wider">
                  {destination.label.toUpperCase()}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-slate-700 text-slate-400">
                  {destination.code}
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                COORDINATES: {destination.coordinates}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tool payload badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-slate-800 text-[11px] font-mono">
              <Sparkles className="w-3 h-3" style={{ color: toolColor }} />
              <span className="text-slate-400">PAYLOAD:</span>
              <span style={{ color: toolColor }}>{destination.tool.name}</span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              aria-label="Close modal"
              className="p-1.5 sm:p-2 rounded-lg border border-slate-700 hover:border-red-500 bg-slate-800/80 hover:bg-red-950/40 text-slate-300 hover:text-red-400 transition-all cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Impact Confirmation Sub-banner */}
        <div className="bg-black/50 border-b border-slate-800/60 px-4 sm:px-6 py-2 flex items-center gap-2 text-[10px] sm:text-[11px] font-mono">
          <Terminal className="w-3.5 h-3.5" style={{ color: toolColor }} />
          <span className="text-slate-400">TELEMETRY:</span>
          <span className="text-emerald-400 truncate">
            {destination.tool.impactLog}
          </span>
        </div>

        {/* Scrollable Content Deck */}
        <div className="p-4 sm:p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 bg-slate-950 px-4 sm:px-6 py-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
          <span>HOST ARCHITECTURE: NEXT.JS // REACT // THREE.JS</span>
          <span className="hidden sm:inline-block">PRESS [ESC] TO DISENGAGE MODULE</span>
        </div>
      </div>
    </div>
  );
};
