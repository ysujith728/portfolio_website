"use client";

import React from "react";
import { PORTFOLIO_ACHIEVEMENTS } from "../../data/achievements";
import { Award, Star, Calendar, CheckCircle2 } from "lucide-react";

export const AchievementsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PORTFOLIO_ACHIEVEMENTS.map((ach, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 hover:border-amber-500/40 bg-slate-900/60 p-5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-2.5">
                <span className="text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {ach.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {ach.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-mono mb-2">
                {ach.title}
              </h3>

              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                {ach.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>OFFICIALLY VERIFIED</span>
              </div>
              <span className="text-slate-400">RECOGNITION #{idx + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
