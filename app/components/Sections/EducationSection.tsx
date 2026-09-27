"use client";

import React from "react";
import { PORTFOLIO_EDUCATION } from "../../data/education";
import { GraduationCap, BookOpen, CheckCircle, Award } from "lucide-react";

export const EducationSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {PORTFOLIO_EDUCATION.map((edu, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  {edu.degree}
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">
                  {edu.institution}
                </p>
              </div>
            </div>

            <div className="font-mono text-xs text-right">
              <div className="text-slate-300">{edu.period}</div>
              {edu.score && (
                <div className="text-emerald-400 font-semibold">{edu.score}</div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>ACADEMIC FOCUS & SPECIALIZATION</span>
            </h4>
            <ul className="space-y-2">
              {edu.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coursework Matrix */}
          <div>
            <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>FOUNDATIONAL COURSEWORK</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {edu.coursework.map((course, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-slate-800 bg-black/40 font-mono text-[11px] text-slate-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
