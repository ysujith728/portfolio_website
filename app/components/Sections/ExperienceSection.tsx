"use client";

import React from "react";
import { PORTFOLIO_EXPERIENCE } from "../../data/experience";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export const ExperienceSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="relative border-l-2 border-cyan-500/30 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
        {PORTFOLIO_EXPERIENCE.map((exp, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full border-2 border-cyan-400 bg-slate-950 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Briefcase className="w-3.5 h-3.5" />
            </div>

            {/* Experience Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 hover:border-cyan-500/40 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono text-xs">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.period}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {exp.status}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                {exp.role}
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1 mb-4">
                <span className="text-indigo-300">{exp.organization}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {exp.location}
                </span>
              </div>

              {/* Highlights */}
              <ul className="space-y-2 mb-4">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-300 border border-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
