"use client";

import React, { useState } from "react";
import { SKILL_CATEGORIES } from "../../data/skills";
import { Cpu, Terminal, Sparkles, CheckCircle2 } from "lucide-react";
import { soundEngine } from "../../lib/sound";

export const SkillsSection: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<number>(0);

  const activeCategory = SKILL_CATEGORIES[selectedCat];

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.code}
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setSelectedCat(idx);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedCat === idx
                ? "border-cyan-400 bg-cyan-950/50 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                : "border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>{cat.code}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  selectedCat === idx ? "bg-cyan-400 animate-ping" : "bg-slate-600"
                }`}
              />
            </div>
            <div
              className={`font-semibold text-xs ${
                selectedCat === idx ? "text-white" : "text-slate-300"
              }`}
            >
              {cat.title}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Category Skill Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">
              {activeCategory.title.toUpperCase()} // SYNAPSE CALIBRATION
            </h3>
          </div>
          <span className="text-[11px] text-cyan-400">
            {activeCategory.skills.length} MODULES ONLINE
          </span>
        </div>

        <div className="space-y-4">
          {activeCategory.skills.map((skill) => (
            <div
              key={skill.name}
              className="p-3.5 rounded-lg border border-slate-800/80 bg-black/40 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-white tracking-wide">
                    {skill.name}
                  </span>
                </div>
                <span className="text-cyan-400 font-bold">{skill.level}%</span>
              </div>

              {/* Skill meter */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hardware & Computational Summary */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 flex items-center justify-between font-mono text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>MICROCONTROLLERS & PLATFORMS: ARDUINO, ESP32, WEBOTS, ROS, NVIDIA CUDA</span>
        </div>
        <span className="text-cyan-400 font-bold hidden sm:inline-block">
          STATUS: PRODUCTION READY
        </span>
      </div>
    </div>
  );
};
