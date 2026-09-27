"use client";

import React from "react";
import { User, Cpu, Shield, ArrowUpRight, Terminal, Award } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="md:col-span-1 rounded-xl border border-cyan-500/30 bg-slate-900/60 p-5 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 rounded-2xl border-2 border-cyan-400 p-1 mb-4 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <div className="w-full h-full rounded-xl bg-gradient-to-tr from-slate-900 via-cyan-950 to-slate-800 flex items-center justify-center font-mono font-bold text-3xl text-cyan-300">
              YS
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_#34d399]" />
          </div>

          <h3 className="text-xl font-bold text-white font-mono">Y Sujith</h3>
          <p className="text-xs font-mono text-cyan-400 mt-1">@ysujith728</p>
          <div className="mt-3 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300">
            CSE Undergrad & AI Researcher
          </div>

          <div className="w-full mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-left font-mono text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block">LOCATION</span>
              <span className="text-white">India</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">FOCUS</span>
              <span className="text-white">Autonomous AI</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">EDUCATION</span>
              <span className="text-white">B.Tech CSE (2nd Yr)</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">SYSTEM</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Narrative & Engineering Philosophy */}
        <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Terminal className="w-4 h-4" />
            <span>EXECUTIVE DOSSIER // MISSION TELEMETRY</span>
          </div>

          <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
            Bridging Autonomous Intelligence, Embedded Robotics, and High-Performance Web Systems.
          </h4>

          <p className="text-slate-300 text-sm leading-relaxed">
            I am a 2nd year B.Tech Computer Science student driven by building intelligent autonomous
            agents and hardware-integrated software solutions. From modeling physical robotics rovers
            in Webots and calibrating PID firmware on microcontrollers to architecting AI claim
            verification engines with PyTorch, my work focuses on real-world engineering impact.
          </p>

          <p className="text-slate-300 text-sm leading-relaxed">
            My engineering philosophy combines systems-level precision (C/C++, embedded sensors,
            low-power visual SLAM) with cutting-edge software paradigms (Next.js, TypeScript,
            Three.js 3D interaction design, and distributed ML pipelines).
          </p>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="p-3 rounded-lg border border-slate-800 bg-black/40">
              <Cpu className="w-4 h-4 text-cyan-400 mb-1.5" />
              <div className="font-mono font-semibold text-xs text-white">Autonomous AI</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Reasoning pipelines, verification agents, and neural architectures.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-black/40">
              <Shield className="w-4 h-4 text-indigo-400 mb-1.5" />
              <div className="font-mono font-semibold text-xs text-white">Robotics & IoT</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Embedded C++, Webots simulations, SLAM, and real-time hazard shields.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-black/40">
              <Award className="w-4 h-4 text-emerald-400 mb-1.5" />
              <div className="font-mono font-semibold text-xs text-white">Modern Full Stack</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Next.js, Three.js, REST APIs, and responsive interactive web applications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="border border-slate-800 bg-black/50 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <User className="w-4 h-4 text-cyan-400" />
          <span>PORTFOLIO AGENT READY TO NAVIGATE PROJECTS & REPOSITORIES</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ysujith728"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 transition-colors"
          >
            <span>GITHUB PROFILE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
