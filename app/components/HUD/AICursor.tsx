"use client";

import React, { useEffect, useState } from "react";
import { AgentState } from "../../types/agent";

interface AICursorProps {
  agentState: AgentState;
  isHoveringNode: boolean;
}

export const AICursor: React.FC<AICursorProps> = ({
  agentState,
  isHoveringNode,
}) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    ) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [visible]);

  if (isTouch || !visible) return null;

  const isTargeting =
    isHoveringNode ||
    agentState === "TARGET_LOCK" ||
    agentState === "AIM" ||
    agentState === "THROW";

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
    >
      {/* Central Targeting Reticle */}
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {/* Core Dot */}
        <div
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            isTargeting
              ? "bg-cyan-400 shadow-[0_0_12px_#00f0ff] scale-125"
              : "bg-white/80"
          }`}
        />

        {/* Outer Crosshair Ring */}
        <div
          className={`absolute -inset-3 rounded-full border border-dashed transition-all duration-300 ${
            isTargeting
              ? "border-cyan-400 scale-125 rotate-45 animate-spin"
              : "border-slate-500/50 scale-100"
          }`}
          style={{ animationDuration: "6s" }}
        />

        {/* Target Reticle Brackets on hover */}
        {isTargeting && (
          <div className="absolute -inset-5 flex items-center justify-center pointer-events-none">
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
            <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

            {/* Micro Coordinates Readout */}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono text-cyan-300 whitespace-nowrap bg-black/70 px-1 rounded border border-cyan-500/30">
              X:{Math.round(pos.x)} Y:{Math.round(pos.y)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
