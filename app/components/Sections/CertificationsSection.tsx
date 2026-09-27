"use client";

import React from "react";
import { PORTFOLIO_CERTIFICATIONS } from "../../data/certifications";
import { ShieldCheck, Calendar, Key, CheckCircle } from "lucide-react";

export const CertificationsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PORTFOLIO_CERTIFICATIONS.map((cert, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 hover:border-emerald-500/40 bg-slate-900/60 p-5 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-3">
                <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CRYPTOGRAPHIC SEAL
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {cert.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-mono mb-1">
                {cert.name}
              </h3>
              <p className="text-xs font-mono text-cyan-400 mb-3">
                ISSUER: {cert.issuer}
              </p>

              {cert.credentialId && (
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-black/40 p-2 rounded border border-slate-800 mb-3">
                  <Key className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">HASH: {cert.credentialId}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
                {cert.skills.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-emerald-400">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  AUTHENTICATED RECORD
                </span>
                <span className="text-slate-400">STATUS: VALID</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
