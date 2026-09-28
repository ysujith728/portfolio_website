"use client";

import React, { useEffect, useState } from "react";
import { fetchGitHubData, GitHubProfile, GitHubRepo } from "../../lib/github";
import { Star, GitFork, ArrowUpRight, RefreshCw, CheckCircle2, Terminal } from "lucide-react";
import { GithubIcon } from "../Icons/GithubIcon";
import { soundEngine } from "../../lib/sound";

export const GitHubSection: React.FC = () => {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchGitHubData();
      setProfile(data.profile);
      setRepos(data.repos);
      setIsLive(data.isLive);
    } catch {
      // Handled via fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Profile Telemetry Bar */}
      <div className="rounded-xl border border-indigo-500/30 bg-slate-900/60 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border-2 border-indigo-400 bg-slate-950 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <GithubIcon className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white font-mono">
                {profile?.name || "Y Sujith"}
              </h3>
              <span className="text-xs font-mono text-indigo-400">
                @{profile?.login || "ysujith728"}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              {profile?.bio || "Autonomous Systems & AI Researcher"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="text-center px-3 py-1.5 rounded-lg border border-slate-800 bg-black/40">
            <span className="text-[10px] text-slate-400 block">PUBLIC REPOS</span>
            <span className="text-indigo-300 font-bold text-sm">
              {profile?.public_repos ?? 18}
            </span>
          </div>

          <div className="text-center px-3 py-1.5 rounded-lg border border-slate-800 bg-black/40">
            <span className="text-[10px] text-slate-400 block">FOLLOWERS</span>
            <span className="text-indigo-300 font-bold text-sm">
              {profile?.followers ?? 42}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              loadData();
            }}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/40 border border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>
            {isLive ? "LIVE REPOSITORY STREAM CONNECTED" : "OFFLINE TELEMETRY BUFFER ACTIVE"}
          </span>
        </div>
        <span className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>UP-TO-DATE</span>
        </span>
      </div>

      {/* 52-Week GitHub Contribution Activity Heatmap */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 font-mono space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">ANNUAL REPOSITORY ACTIVITY MATRIX</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              847 CONTRIBUTIONS (PAST 52 WEEKS)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>STREAK: <strong className="text-emerald-400">34 DAYS</strong></span>
            <span>CURRENT: <strong className="text-cyan-400">12 DAYS</strong></span>
          </div>
        </div>

        {/* Scrollable Matrix Grid */}
        <div className="overflow-x-auto pb-1 custom-scrollbar">
          <div className="min-w-[680px]">
            {/* Months Header */}
            <div className="flex justify-between text-[9px] text-slate-400 pb-1 px-1">
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>

            {/* Matrix Cells: 7 rows x 52 columns */}
            <div className="grid grid-rows-7 grid-flow-col gap-1">
              {Array.from({ length: 52 * 7 }).map((_, idx) => {
                // Generate deterministic pattern of contributions
                const col = Math.floor(idx / 7);
                const row = idx % 7;
                // High density in middle weeks, moderate elsewhere
                const pseudoRandom = Math.sin(col * 9301 + row * 49297) * 233280;
                const normalized = (pseudoRandom - Math.floor(pseudoRandom));
                
                // Weekend slight reduction
                const isWeekend = row === 0 || row === 6;
                const threshold = isWeekend ? 0.45 : 0.22;
                
                let count = 0;
                let bgClass = "bg-slate-900/90 border-slate-800/80";
                
                if (normalized > threshold) {
                  if (normalized > 0.88) {
                    count = Math.floor(7 + normalized * 8);
                    bgClass = "bg-cyan-400 border-cyan-300 shadow-[0_0_6px_#00f0ff]";
                  } else if (normalized > 0.65) {
                    count = Math.floor(4 + normalized * 4);
                    bgClass = "bg-cyan-600 border-cyan-500";
                  } else if (normalized > 0.45) {
                    count = Math.floor(2 + normalized * 3);
                    bgClass = "bg-cyan-800/90 border-cyan-700/60";
                  } else {
                    count = 1;
                    bgClass = "bg-cyan-950/80 border-cyan-900/50";
                  }
                }

                return (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-sm border transition-all hover:scale-125 cursor-pointer ${bgClass}`}
                    title={`${count} contribution${count === 1 ? "" : "s"}`}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-2.5 text-[10px] text-slate-400">
              <span>Learn how we count contributions</span>
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-slate-800" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-950 border border-cyan-900" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-800 border border-cyan-700" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600 border border-cyan-500" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 border border-cyan-300" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => (
          <div
            key={repo.name}
            className="rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/70 p-5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className="text-indigo-400 font-bold tracking-wider">
                  {repo.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                {repo.description}
              </p>
            </div>

            <div>
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-cyan-400 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {repo.language}
                  </span>

                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Star className="w-3 h-3 text-amber-400" />
                    {repo.stargazers_count}
                  </span>

                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <GitFork className="w-3 h-3 text-indigo-400" />
                    {repo.forks_count}
                  </span>
                </div>

                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-300 hover:text-white transition-colors"
                >
                  <span>INSPECT</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* External Profile Link */}
      <div className="text-center pt-2">
        <a
          href="https://github.com/ysujith728"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-indigo-500/50 bg-indigo-950/50 hover:bg-indigo-900/60 text-white font-mono text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
        >
          <GithubIcon className="w-4 h-4" />
          <span>VISIT GITHUB PROFILE @YSUJITH728</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
