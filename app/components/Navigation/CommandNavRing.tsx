"use client";

import React from "react";
import { NavDestination } from "../../types/agent";
import { NavNode } from "./NavNode";

interface CommandNavRingProps {
  destinations: NavDestination[];
  hoveredDestination: NavDestination | null;
  lockedDestination: NavDestination | null;
  activeDestination: NavDestination | null;
  onHover: (dest: NavDestination, rect: DOMRect) => void;
  onLeave: () => void;
  onSelect: (dest: NavDestination, rect: DOMRect) => void;
  reducedMotion?: boolean;
  centerContent?: React.ReactNode;
}

export const CommandNavRing: React.FC<CommandNavRingProps> = ({
  destinations,
  hoveredDestination,
  lockedDestination,
  activeDestination,
  onHover,
  onLeave,
  onSelect,
  reducedMotion = false,
  centerContent,
}) => {
  // Categorize destinations into Tactical Wings
  const leftWing = destinations.filter((d) =>
    ["about", "projects", "skills", "experience"].includes(d.id)
  );

  const rightWing = destinations.filter((d) =>
    ["education", "achievements", "certifications", "github"].includes(d.id)
  );

  const bottomDock = destinations.filter((d) =>
    ["resume", "contact", "assistant"].includes(d.id)
  );

  return (
    <div className="w-full relative z-20 flex flex-col justify-between h-full pointer-events-none">
      {/* Upper Wings & Central Staging Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full items-center">
        {/* Left Wing (4 items) */}
        <div className="lg:col-span-3 flex flex-col gap-3 pointer-events-auto">
          <div className="hidden lg:flex items-center gap-2 px-2 pb-1 border-b border-cyan-500/20 text-[10px] font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-sm bg-cyan-400 animate-pulse" />
            <span>PRIMARY TELEMETRY WING</span>
          </div>
          {leftWing.map((dest) => (
            <NavNode
              key={dest.id}
              destination={dest}
              isHovered={hoveredDestination?.id === dest.id}
              isLocked={lockedDestination?.id === dest.id}
              isActive={activeDestination?.id === dest.id}
              onHover={onHover}
              onLeave={onLeave}
              onSelect={onSelect}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Central 3D AI Robot & Telemetry Stage */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center pointer-events-auto my-2 lg:my-0">
          {centerContent}
        </div>

        {/* Right Wing (4 items) */}
        <div className="lg:col-span-3 flex flex-col gap-3 pointer-events-auto">
          <div className="hidden lg:flex items-center gap-2 px-2 pb-1 border-b border-cyan-500/20 text-[10px] font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-sm bg-cyan-400 animate-pulse" />
            <span>SECONDARY VECTOR WING</span>
          </div>
          {rightWing.map((dest) => (
            <NavNode
              key={dest.id}
              destination={dest}
              isHovered={hoveredDestination?.id === dest.id}
              isLocked={lockedDestination?.id === dest.id}
              isActive={activeDestination?.id === dest.id}
              onHover={onHover}
              onLeave={onLeave}
              onSelect={onSelect}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>

      {/* Bottom Command Dock (3 items) */}
      <div className="mt-6 sm:mt-8 w-full max-w-4xl mx-auto pointer-events-auto">
        <div className="flex items-center justify-center gap-2 mb-3 text-[10px] font-mono text-slate-400">
          <span className="h-[1px] w-12 bg-slate-800" />
          <span>AUTONOMOUS COMMAND DOCK</span>
          <span className="h-[1px] w-12 bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {bottomDock.map((dest) => (
            <NavNode
              key={dest.id}
              destination={dest}
              isHovered={hoveredDestination?.id === dest.id}
              isLocked={lockedDestination?.id === dest.id}
              isActive={activeDestination?.id === dest.id}
              onHover={onHover}
              onLeave={onLeave}
              onSelect={onSelect}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
