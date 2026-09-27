"use client";

import React, { useState } from "react";
import { Bot, Send, User, Sparkles, Terminal } from "lucide-react";
import { soundEngine } from "../../lib/sound";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

const KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["project", "built", "build", "portfolio", "work"],
    answer:
      "Y Sujith has developed several notable projects across Autonomous Systems, AI, and Robotics:\n\n• SciVerify: Autonomous AI claim verification and citation grounding engine using NLP and semantic embeddings.\n• LP-SLAM-TECC: Low-power embedded visual SLAM navigation system for resource-constrained robotics.\n• NetGuard-QoS-IDS: Real-time network intrusion detection system combining machine learning classification with active QoS traffic shaping.\n• Auto Strider: Autonomous line-tracking rover simulation and hardware controller with PID feedback loop (Arduino & Webots).\n• Smart Home Safety: Multi-hazard IoT system detecting fire, combustible gas, and intrusion.\n• GlobeRadio: 3D interactive global radio streaming platform.",
  },
  {
    keywords: ["education", "degree", "college", "university", "study", "student"],
    answer:
      "Sujith is currently a 2nd year B.Tech Computer Science & Engineering student (2023–2027) with an active honors track. His coursework focuses on Operating Systems, Computer Architecture, Data Structures & Algorithms, Network Protocols, and Autonomous Embedded Systems.",
  },
  {
    keywords: ["skill", "tech", "stack", "language", "python", "c++"],
    answer:
      "Sujith's core technical capabilities span three main pillars:\n\n1. AI & Machine Learning: Python, PyTorch, OpenCV, Scikit-Learn, NLP, Agentic Workflows.\n2. Robotics & Embedded: C/C++, Arduino, Microcontrollers, Webots Simulation, ROS, PID Control.\n3. Full Stack & Systems: React, Next.js, TypeScript, Node.js, FastAPI, Three.js, Docker, Linux.",
  },
  {
    keywords: ["sciverify", "verify", "claim", "paper"],
    answer:
      "SciVerify is an AI-driven verification architecture that ingests scientific claims, retrieves academic literature, and uses semantic entailment models to cross-reference assertion validity. It achieves 94.2% claim parsing precision with sub-1.2s inference latency.",
  },
  {
    keywords: ["slam", "robot", "robotics", "auto strider"],
    answer:
      "Sujith has deep experience in robotics: LP-SLAM-TECC is an embedded visual SLAM system delivering a 38% power reduction for edge robotics, while Auto Strider is an autonomous line-following rover with a 5-sensor optical array calibrated in Webots and on Arduino hardware.",
  },
  {
    keywords: ["contact", "email", "reach", "hire", "github"],
    answer:
      "You can connect with Sujith via:\n\n• GitHub: https://github.com/ysujith728\n• Email: contact@ysujith.dev\n• Communication Beacon tab in this portfolio to dispatch an instant packet!",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    sender: "assistant",
    text: "Greetings! I am Aegis, Sujith's personal autonomous AI co-pilot. I have full telemetry access to Sujith's project repositories, robotics research, academic background, and technical skill matrix. How may I assist you today?",
    timestamp: "NOW",
  },
];

const SUGGESTIONS = [
  "What projects has Sujith built?",
  "Tell me about the SciVerify project",
  "What are Sujith's main robotics skills?",
  "What is Sujith's background and education?",
  "How can I contact Sujith?",
];

export const AIAssistantSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const generateAnswer = (query: string): string => {
    const qLower = query.toLowerCase();
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some((k) => qLower.includes(k))) {
        return item.answer;
      }
    }
    return (
      "I analyzed your query across Sujith's portfolio telemetry. Sujith specializes in Autonomous AI Agents, Embedded Robotics (SLAM, Arduino, Webots), and Full Stack Engineering. You can explore his active projects in the Projects section or inspect his code at github.com/ysujith728."
    );
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    soundEngine.playClick();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      soundEngine.playSuccess();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: generateAnswer(query),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[520px] max-h-[70vh] rounded-xl border border-purple-500/30 bg-slate-950/80 p-4 font-mono text-xs">
      {/* Terminal Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-400 flex items-center justify-center text-purple-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">AEGIS-AI // CO-PILOT TERMINAL</div>
            <div className="text-[10px] text-purple-400">KNOWLEDGE BASE: YSUJITH728</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>NEURAL REASONING ACTIVE</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                msg.sender === "user"
                  ? "bg-cyan-950 border border-cyan-400 text-cyan-300"
                  : "bg-purple-950 border border-purple-400 text-purple-300"
              }`}
            >
              {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-cyan-950/40 border border-cyan-500/40 text-cyan-100"
                  : "bg-slate-900/80 border border-purple-500/30 text-slate-200"
              }`}
            >
              {msg.text}
              <div className="text-[9px] text-slate-500 mt-1.5 text-right font-mono">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs">
            <Bot className="w-4 h-4 animate-spin" />
            <span>AEGIS IS REASONING...</span>
          </div>
        )}
      </div>

      {/* Suggested Query Chips */}
      <div className="py-2 flex flex-wrap gap-1.5 border-t border-slate-800/80 my-2">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(s)}
            className="text-[10px] px-2.5 py-1 rounded-full border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/50 text-purple-200 transition-colors cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-800"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask Aegis about Sujith's projects, skills, robotics research..."
          className="flex-1 px-3 py-2 rounded-lg border border-slate-800 bg-black/60 text-white placeholder-slate-600 focus:outline-none focus:border-purple-400 text-xs"
        />
        <button
          type="submit"
          className="p-2 rounded-lg border border-purple-500/50 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 transition-colors cursor-pointer"
          aria-label="Send query to AI Assistant"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
