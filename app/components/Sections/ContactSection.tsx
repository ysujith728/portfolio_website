"use client";

import React, { useState } from "react";
import { Radio, Mail, Send, CheckCircle2, Terminal } from "lucide-react";
import { GithubIcon } from "../Icons/GithubIcon";
import { soundEngine } from "../../lib/sound";

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    soundEngine.playToolEquip();
    setIsTransmitting(true);

    setTimeout(() => {
      soundEngine.playSuccess();
      setIsTransmitting(false);
      setTransmitted(true);
      setFormState({ name: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Communication Beacon Status */}
        <div className="rounded-xl border border-teal-500/30 bg-slate-900/60 p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl border border-teal-400 bg-teal-950/60 flex items-center justify-center text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.4)]">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                COMMUNICATION BEACON
              </h3>
              <p className="text-xs font-mono text-teal-400">
                DIRECT TRANSMISSION RELAY
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Have an open-source collaboration, robotics project inquiry, or autonomous AI research
            opportunity? Establish a direct transmission through this communication beacon.
          </p>

          {/* Quick Endpoints */}
          <div className="space-y-2.5 font-mono text-xs">
            <a
              href="mailto:contact@ysujith.dev"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-black/40 hover:border-teal-500/40 text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>DIRECT EMAIL DISPATCH</span>
              </div>
              <span className="text-teal-400 text-[11px]">SEND MAIL &rarr;</span>
            </a>

            <a
              href="https://github.com/ysujith728"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-black/40 hover:border-teal-500/40 text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <GithubIcon className="w-4 h-4 text-teal-400" />
                <span>GITHUB PROFILE</span>
              </div>
              <span className="text-teal-400 text-[11px]">@ysujith728 &rarr;</span>
            </a>
          </div>

          <div className="p-3 rounded-lg border border-slate-800 bg-black/50 font-mono text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5 text-teal-400 mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>BEACON METRICS</span>
            </div>
            <div>STATUS: ONLINE // CARRIER FREQUENCY: 2.45 GHz // LATENCY: NOMINAL</div>
          </div>
        </div>

        {/* Right Side: Interactive Transmission Form */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-teal-400" />
            <span>DISPATCH TRANSMISSION PACKET</span>
          </h4>

          {transmitted ? (
            <div className="p-6 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-center space-y-3 font-mono">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
              <h5 className="text-base font-bold text-white">
                TRANSMISSION DISPATCHED
              </h5>
              <p className="text-xs text-slate-300">
                Your message has been encoded into the telemetry buffer. Y Sujith will inspect your transmission shortly.
              </p>
              <button
                type="button"
                onClick={() => setTransmitted(false)}
                className="mt-2 px-4 py-2 rounded-lg border border-teal-500/40 bg-teal-950/50 text-teal-300 text-xs hover:bg-teal-900/60 cursor-pointer"
              >
                DISPATCH ANOTHER PACKET
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  CALLSIGN / YOUR NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commander Sarah / Dev Lead"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-black/60 text-white placeholder-slate-600 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  RETURN FREQUENCY / EMAIL
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@domain.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-black/60 text-white placeholder-slate-600 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  TRANSMISSION PAYLOAD / MESSAGE
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline your project, collaboration idea, or question..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-black/60 text-white placeholder-slate-600 focus:outline-none focus:border-teal-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isTransmitting}
                className="w-full py-2.5 rounded-lg border border-teal-500/50 bg-teal-950/60 hover:bg-teal-900/80 text-teal-200 font-bold transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isTransmitting ? "animate-pulse" : ""}`} />
                <span>{isTransmitting ? "BROADCASTING PACKET..." : "TRANSMIT MESSAGE"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
