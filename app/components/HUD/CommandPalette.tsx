"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { NAVIGATION_DESTINATIONS } from "../../data/navigation";
import { PORTFOLIO_PROJECTS } from "../../data/projects";
import { NavDestination } from "../../types/agent";
import {
  Search,
  Command,
  CornerDownLeft,
  X,
  Compass,
  Cpu,
  Layers,
  Sparkles,
  Volume2,
  Eye,
} from "lucide-react";
import { soundEngine } from "../../lib/sound";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (dest: NavDestination) => void;
  onToggleReducedMotion: () => void;
  onToggleSound: () => void;
  onQuickDispatch: () => void;
  reducedMotion: boolean;
  soundMuted: boolean;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: "NAVIGATION" | "PROJECTS" | "SYSTEM";
  icon: React.ReactNode;
  badge?: string;
  color?: string;
  onSelect: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectDestination,
  onToggleReducedMotion,
  onToggleSound,
  onQuickDispatch,
  reducedMotion,
  soundMuted,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Construct command list
  const commands: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [];

    // 1. Navigation destinations
    NAVIGATION_DESTINATIONS.forEach((dest) => {
      list.push({
        id: `nav-${dest.id}`,
        title: dest.label,
        subtitle: `Deploy [${dest.tool.name}] • Tool: ${dest.tool.glyph} • Code: ${dest.code}`,
        category: "NAVIGATION",
        icon: <Compass className="w-4 h-4" style={{ color: dest.tool.color }} />,
        badge: dest.code,
        color: dest.tool.color,
        onSelect: () => {
          onSelectDestination(dest);
          onClose();
        },
      });
    });

    // 2. Specific Projects (jumps straight into Projects modal)
    const projectsDest = NAVIGATION_DESTINATIONS.find((d) => d.id === "projects");
    if (projectsDest) {
      PORTFOLIO_PROJECTS.forEach((prj) => {
        list.push({
          id: `prj-${prj.id}`,
          title: prj.title,
          subtitle: `${prj.codename} • ${prj.category} • ${prj.description.slice(0, 60)}...`,
          category: "PROJECTS",
          icon: <Layers className="w-4 h-4 text-cyan-400" />,
          badge: prj.status,
          color: "#00f0ff",
          onSelect: () => {
            onSelectDestination(projectsDest);
            onClose();
          },
        });
      });
    }

    // 3. System Actions
    list.push({
      id: "sys-dispatch",
      title: "Autonomous Mission Scan",
      subtitle: "Execute random orbital module scan and tool deployment",
      category: "SYSTEM",
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      badge: "AUTO",
      color: "#10b981",
      onSelect: () => {
        onQuickDispatch();
        onClose();
      },
    });

    list.push({
      id: "sys-3d",
      title: reducedMotion ? "Enable 3D Full FX" : "Toggle 2D Reduced Motion",
      subtitle: reducedMotion
        ? "Restore Three.js WebGL spatial engine"
        : "Switch to low-resource 2D canvas radar",
      category: "SYSTEM",
      icon: <Eye className="w-4 h-4 text-indigo-400" />,
      badge: reducedMotion ? "2D ACTIVE" : "3D ACTIVE",
      color: "#6366f1",
      onSelect: () => {
        onToggleReducedMotion();
        onClose();
      },
    });

    list.push({
      id: "sys-sound",
      title: soundMuted ? "Unmute Audio Engine" : "Mute Audio Engine",
      subtitle: "Toggle Web Audio synthesis telemetry sound effects",
      category: "SYSTEM",
      icon: <Volume2 className="w-4 h-4 text-amber-400" />,
      badge: soundMuted ? "MUTED" : "SYNTH ONLINE",
      color: "#f59e0b",
      onSelect: () => {
        onToggleSound();
        onClose();
      },
    });

    return list;
  }, [
    onSelectDestination,
    onClose,
    onQuickDispatch,
    onToggleReducedMotion,
    onToggleSound,
    reducedMotion,
    soundMuted,
  ]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.subtitle.toLowerCase().includes(lower) ||
        c.category.toLowerCase().includes(lower)
    );
  }, [commands, query]);

  // Keyboard navigation within the list
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        soundEngine.playHover();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        soundEngine.playHover();
        setSelectedIndex((prev) =>
          prev <= 0 ? Math.max(0, filteredCommands.length - 1) : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          soundEngine.playLock();
          filteredCommands[selectedIndex].onSelect();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type command, destination, skill, or project codename..."
            className="w-full bg-transparent font-mono text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 font-mono text-[10px] text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar"
        >
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center font-mono text-sm text-slate-400">
              <p>NO DIRECTIVES FOUND FOR &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for &quot;Projects&quot;, &quot;SLAM&quot;, &quot;GitHub&quot;, or &quot;Skills&quot;
              </p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    soundEngine.playLock();
                    cmd.onSelect();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer font-mono transition-all ${
                    isSelected
                      ? "bg-cyan-950/60 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.15)] text-white"
                      : "border border-transparent hover:bg-slate-900/50 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-700/60 bg-black/40 shrink-0"
                      style={cmd.color ? { borderColor: `${cmd.color}55` } : {}}
                    >
                      {cmd.icon}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold truncate ${
                            isSelected ? "text-cyan-300" : "text-slate-100"
                          }`}
                        >
                          {cmd.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {cmd.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {cmd.badge}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-black/60 flex items-center justify-between font-mono text-[10px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↑↓</kbd>
              <span>NAVIGATE</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">↵</kbd>
              <span>EXECUTE</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">ESC</kbd>
              <span>DISMISS</span>
            </span>
          </div>

          <span className="text-cyan-400/80">
            {filteredCommands.length} DIRECTIVES ONLINE
          </span>
        </div>
      </div>
    </div>
  );
};
