"use client";

import React, { useState } from "react";
import { FileText, Download, Printer, CheckCircle, ExternalLink, Code } from "lucide-react";
import { soundEngine } from "../../lib/sound";

export const ResumeSection: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    soundEngine.playClick();
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownload = () => {
    soundEngine.playSuccess();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);

    // Provide clean markdown/text resume export
    const resumeText = `===========================================================
Y SUJITH - CURRICULUM VITAE
AI Engineer & Autonomous Systems Researcher
GitHub: https://github.com/ysujith728
Location: India
===========================================================

EDUCATION:
- B.Tech in Computer Science & Engineering (2023 - 2027, 2nd Year)
  Specialization: Autonomous Systems & Machine Learning

CORE COMPETENCIES:
- Languages: Python, C++, C, TypeScript, JavaScript, SQL
- AI & ML: PyTorch, OpenCV, Scikit-Learn, NLP, Agentic Architectures
- Robotics & Embedded: Arduino, Webots, ROS, PID Control, Sensor Fusion
- Full Stack: React, Next.js, Node.js, FastAPI, Tailwind CSS, Three.js
- Tools: Git, Docker, Linux, Wireshark, Microcontrollers

KEY PROJECTS:
1. SciVerify (AI Claim Verification & Citation Grounding Engine)
2. LP-SLAM-TECC (Low-Power Embedded Visual SLAM for Robotics)
3. NetGuard-QoS-IDS (Network Intrusion Detection & QoS Optimization)
4. Auto Strider (Autonomous Line-Following Rover in Webots & Arduino)
5. Smart Home Safety (Multi-Hazard Gas, Flame & Intrusion Alert System)
6. GlobeRadio (3D Interactive Worldwide Radio Streaming App)
===========================================================`;

    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Y_Sujith_Resume_Dossier.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <FileText className="w-4 h-4 text-pink-400" />
          <span>DECRYPTED DOCUMENT DOSSIER // CURRICULUM VITAE</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-pink-500/40 bg-pink-950/40 hover:bg-pink-900/60 text-pink-300 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? "DOWNLOADED!" : "DOWNLOAD DOSSIER"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT DOSSIER</span>
          </button>
        </div>
      </div>

      {/* Styled Printable Resume Document */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-300">
        {/* Document Header */}
        <div className="border-b border-slate-700 pb-4 flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">
              Y SUJITH
            </h1>
            <p className="text-pink-400 font-semibold mt-1">
              AI Engineer & Autonomous Systems Researcher
            </p>
          </div>

          <div className="text-right text-[11px] space-y-0.5 text-slate-400">
            <div>GitHub: github.com/ysujith728</div>
            <div>Focus: Robotics, Embedded & Autonomous AI</div>
            <div>B.Tech Computer Science (2nd Year)</div>
          </div>
        </div>

        {/* Technical Competencies Matrix */}
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2.5 text-cyan-300 border-b border-slate-800 pb-1">
            01 // TECHNICAL CAPABILITIES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-400 block font-semibold">LANGUAGES:</span>
              <span>Python, C++, C, TypeScript, JavaScript, SQL, HTML/CSS</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">AI & MACHINE LEARNING:</span>
              <span>PyTorch, OpenCV, Scikit-Learn, Semantic Embeddings, RAG</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">ROBOTICS & EMBEDDED:</span>
              <span>Arduino, Webots Simulation, ROS, Microcontrollers, PID</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">SYSTEMS & WEB:</span>
              <span>Next.js, React, Node.js, FastAPI, Three.js, Docker, Linux</span>
            </div>
          </div>
        </div>

        {/* Selected Project Highlights */}
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 text-cyan-300 border-b border-slate-800 pb-1">
            02 // MISSION ARCHITECTURE & NOTABLE BUILDS
          </h2>
          <div className="space-y-3 text-[11px]">
            <div>
              <div className="flex justify-between font-bold text-white">
                <span>SciVerify — AI Scientific Claim Verification System</span>
                <span className="text-cyan-400">ONLINE</span>
              </div>
              <p className="text-slate-400 mt-0.5">
                Multi-step retrieval and semantic verification pipeline cross-referencing research literature with claim statements.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-white">
                <span>LP-SLAM-TECC — Low-Power Embedded Visual SLAM</span>
                <span className="text-cyan-400">DEPLOYED</span>
              </div>
              <p className="text-slate-400 mt-0.5">
                Edge robotics navigation system reducing power draw by 38% while sustaining sub-centimeter localization fidelity.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-white">
                <span>Auto Strider — Autonomous Line Tracking Rover</span>
                <span className="text-cyan-400">VERIFIED</span>
              </div>
              <p className="text-slate-400 mt-0.5">
                5-channel optical sensor array with PID calibration validated across Arduino C++ hardware and Webots physics simulation.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-white">
                <span>NetGuard-QoS-IDS — Real-Time Intrusion Detection System</span>
                <span className="text-cyan-400">ONLINE</span>
              </div>
              <p className="text-slate-400 mt-0.5">
                Dual-engine packet inspection fusing machine learning threat classification with active QoS dynamic bandwidth shaping.
              </p>
            </div>
          </div>
        </div>

        {/* Academic Records */}
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-cyan-300 border-b border-slate-800 pb-1">
            03 // ACADEMIC RECORD
          </h2>
          <div className="flex justify-between text-[11px] font-bold text-white">
            <span>B.Tech in Computer Science & Engineering</span>
            <span className="text-slate-400">2023 – 2027 (2nd Year)</span>
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Focus: Autonomous Systems, Operating Systems, Algorithm Optimization, Embedded Robotics.
          </p>
        </div>
      </div>
    </div>
  );
};
