"use client";

import React, { useState } from "react";
import { PORTFOLIO_PROJECTS } from "../../data/projects";
import { ExternalLink, Layers, Zap, CheckCircle2 } from "lucide-react";
import { GithubIcon } from "../Icons/GithubIcon";
import { soundEngine } from "../../lib/sound";

export const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "AI & ML", "Robotics & IoT", "Systems & Web"];

  const filteredProjects =
    activeCategory === "All"
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
        <span className="text-slate-400 mr-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>FILTER:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setActiveCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeCategory === cat
                ? "border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                : "border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
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
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>

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
    </div>
  );
};
