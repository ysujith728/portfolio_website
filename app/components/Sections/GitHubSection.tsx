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
