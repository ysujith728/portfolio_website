"use client";

import React, { useRef } from "react";
import { NavDestination } from "../../types/agent";
import {
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  ShieldCheck,
  FileText,
  Radio,
  Bot,
  LucideIcon,
} from "lucide-react";
import { GithubIcon } from "../Icons/GithubIcon";

interface NavNodeProps {
  destination: NavDestination;
  isHovered: boolean;
  isLocked: boolean;
  isActive: boolean;
  onHover: (dest: NavDestination, rect: DOMRect) => void;
  onLeave: () => void;
  onSelect: (dest: NavDestination, rect: DOMRect) => void;
  reducedMotion?: boolean;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  ShieldCheck,
  Github: GithubIcon,
  FileText,
  Radio,
  Bot,
};

export const NavNode: React.FC<NavNodeProps> = ({
  destination,
  isHovered,
  isLocked,
  isActive,
  onHover,
  onLeave,
  onSelect,
}) => {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const IconComponent = ICON_MAP[destination.iconName] || FolderGit2;

  const handlePointerEnter = () => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      onHover(destination, rect);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      onSelect(destination, rect);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        onSelect(destination, rect);
      }
    }
  };

  const isHighlighted = isHovered || isLocked || isActive;
  const toolColor = destination.tool.color;

  return (
    <button
      ref={nodeRef}
      type="button"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={onLeave}
      onFocus={handlePointerEnter}
      onBlur={onLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`Target navigation node ${destination.label}. Tool required: ${destination.tool.name}`}
      className={`group relative text-left transition-all duration-300 outline-none select-none rounded-xl p-3 sm:p-4 backdrop-blur-md border ${
        isHighlighted
          ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_25px_rgba(0,240,255,0.35)] scale-105 z-20"
          : "border-slate-800/80 bg-slate-950/60 hover:border-slate-600/80 hover:bg-slate-900/60 z-10"
      }`}
      style={{
        borderColor: isHighlighted ? toolColor : undefined,
        boxShadow: isHighlighted ? `0 0 25px ${toolColor}44, inset 0 0 15px ${toolColor}22` : undefined,
      }}
    >
      {/* Target Reticle Corner Brackets */}
      {isHighlighted && (
        <>
          <span
            className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 transition-colors duration-300"
            style={{ borderColor: toolColor }}
          />
          <span
            className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 transition-colors duration-300"
            style={{ borderColor: toolColor }}
          />
          <span
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 transition-colors duration-300"
            style={{ borderColor: toolColor }}
          />
          <span
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 transition-colors duration-300"
            style={{ borderColor: toolColor }}
          />
        </>
      )}

      {/* Header Info: Code & Coordinates */}
      <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-slate-400 mb-1.5">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isHighlighted ? "animate-ping" : "opacity-40"
            }`}
            style={{ backgroundColor: isHighlighted ? toolColor : "#94a3b8" }}
          />
          {destination.code}
        </span>
        <span className="hidden sm:inline-block opacity-60 text-[9px]">
          {destination.coordinates}
        </span>
      </div>

      {/* Node Body: Icon + Label */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: isHighlighted ? `${toolColor}22` : "rgba(30, 41, 59, 0.5)",
            color: isHighlighted ? toolColor : "#94a3b8",
            border: `1px solid ${isHighlighted ? toolColor : "rgba(71, 85, 105, 0.4)"}`,
          }}
        >
          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div>
          <h3
            className={`font-semibold text-xs sm:text-sm tracking-wide transition-colors ${
              isHighlighted ? "text-white" : "text-slate-200"
            }`}
          >
            {destination.label}
          </h3>
          <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <span style={{ color: toolColor }}>{destination.tool.glyph}</span>
            <span>{destination.tool.name}</span>
          </p>
        </div>
      </div>

      {/* Status indicator bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono">
        <span
          className={`transition-colors uppercase ${
            isLocked ? "font-bold tracking-wider" : "text-slate-400"
          }`}
          style={{ color: isLocked ? toolColor : undefined }}
        >
          {isLocked ? "TARGET LOCKED" : isHovered ? "DIRECTING..." : "STANDBY"}
        </span>
        <span className="text-slate-400">PWR {destination.tool.energyLevel}</span>
      </div>
    </button>
  );
};
