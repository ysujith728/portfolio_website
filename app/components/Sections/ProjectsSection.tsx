"use client";

import React, { useState } from "react";
import { PORTFOLIO_PROJECTS } from "../../data/projects";
import { ExternalLink, Layers, Zap, CheckCircle2, Play, Sparkles } from "lucide-react";
import { GithubIcon } from "../Icons/GithubIcon";
import { soundEngine } from "../../lib/sound";
import { AutoStriderSimulation } from "../Projects/AutoStriderSimulation";
import { SciVerifySandbox } from "../Projects/SciVerifySandbox";

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeViewMode, setActiveViewMode] = useState<"catalog" | "strider" | "sciverify">("catalog");

  const categories = ["All", "AI & ML", "Robotics & IoT", "Systems & Web"];

  const filteredProjects =
    activeCategory === "All"
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Top Interactive Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveViewMode("catalog");
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeViewMode === "catalog"
                ? "border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white"
            }`}
          >
            PROJECT CATALOG ({PORTFOLIO_PROJECTS.length})
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playLock();
              setActiveViewMode("strider");
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeViewMode === "strider"
                ? "border-emerald-400 bg-emerald-950/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "border-slate-800 bg-slate-900/50 text-slate-400 hover:text-emerald-300"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>PID ROVER SIMULATOR</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playLock();
              setActiveViewMode("sciverify");
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeViewMode === "sciverify"
                ? "border-indigo-400 bg-indigo-950/60 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                : "border-slate-800 bg-slate-900/50 text-slate-400 hover:text-indigo-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>SCIVERIFY ENGINE</span>
          </button>
        </div>

        {activeViewMode === "catalog" && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 mr-1 text-[11px]">FILTER:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-2 py-1 rounded text-[11px] border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "border-cyan-500/50 bg-cyan-900/40 text-cyan-200"
                    : "border-slate-800 bg-black/40 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Render Selected Interactive Mode */}
      {activeViewMode === "strider" && (
        <div className="space-y-4">
          <AutoStriderSimulation />
          <button
            type="button"
            onClick={() => setActiveViewMode("catalog")}
            className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
          >
            ← RETURN TO FULL PROJECT CATALOG
          </button>
        </div>
      )}

      {activeViewMode === "sciverify" && (
        <div className="space-y-4">
          <SciVerifySandbox />
          <button
            type="button"
            onClick={() => setActiveViewMode("catalog")}
            className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
          >
            ← RETURN TO FULL PROJECT CATALOG
          </button>
        </div>
      )}

      {activeViewMode === "catalog" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group relative flex flex-col justify-between rounded-xl border border-slate-800 hover:border-cyan-500/50 bg-slate-900/50 hover:bg-slate-900/80 p-5 transition-all duration-300"
          >
            <div>
              {/* Header: Codename & Status */}
              <div className="flex items-center justify-between font-mono text-[10px] mb-2.5">
                <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {project.codename}
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {project.status}
                </span>
              </div>

              {/* Title & Category */}
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-[11px] font-mono text-indigo-400 mb-3">
                {project.category}
              </p>

              {/* Description */}
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Key Architecture Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 bg-black/40 p-2 rounded-lg border border-slate-800/80">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="font-mono text-[10px]">
                      <span className="text-slate-400 block">{m.label}</span>
                      <span className="text-cyan-300 font-semibold">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Direct Interactive Demo Launchers for Featured Projects */}
              {project.id === "auto-strider" && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playLock();
                    setActiveViewMode("strider");
                  }}
                  className="w-full mb-3 flex items-center justify-center gap-2 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 font-mono text-xs cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LAUNCH LIVE 2D PID SIMULATOR</span>
                </button>
              )}

              {project.id === "sciverify" && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playLock();
                    setActiveViewMode("sciverify");
                  }}
                  className="w-full mb-3 flex items-center justify-center gap-2 py-1.5 rounded-lg border border-indigo-500/50 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 font-mono text-xs cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>LAUNCH CITATION REASONING SANDBOX</span>
                </button>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-200 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>VIEW REPOSITORY</span>
                  </a>
                ) : (
                  <span className="text-slate-400">PROPRIETARY SOURCE</span>
                )}

                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>SYSTEM VALIDATED</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

