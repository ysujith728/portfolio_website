"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { NAVIGATION_DESTINATIONS } from "./data/navigation";
import { NavDestination, AgentState, AgentTelemetry, ToolInfo } from "./types/agent";
import { soundEngine } from "./lib/sound";
import { AgentCanvas } from "./components/Agent/AgentCanvas";
import { AgentFallback } from "./components/Agent/AgentFallback";
import { ToolProjectile } from "./components/ToolTrajectory/ToolProjectile";
import { CommandNavRing } from "./components/Navigation/CommandNavRing";
import { HeaderHUD } from "./components/HUD/HeaderHUD";
import { AgentStatusPanel } from "./components/HUD/AgentStatusPanel";
import { AICursor } from "./components/HUD/AICursor";
import { BootSequence } from "./components/HUD/BootSequence";
import { SectionModal } from "./components/Sections/SectionModal";

// Individual Section Components
import { AboutSection } from "./components/Sections/AboutSection";
import { ProjectsSection } from "./components/Sections/ProjectsSection";
import { SkillsSection } from "./components/Sections/SkillsSection";
import { ExperienceSection } from "./components/Sections/ExperienceSection";
import { EducationSection } from "./components/Sections/EducationSection";
import { AchievementsSection } from "./components/Sections/AchievementsSection";
import { CertificationsSection } from "./components/Sections/CertificationsSection";
import { GitHubSection } from "./components/Sections/GitHubSection";
import { ResumeSection } from "./components/Sections/ResumeSection";
import { ContactSection } from "./components/Sections/ContactSection";
import { AIAssistantSection } from "./components/Sections/AIAssistantSection";
import { CommandPalette } from "./components/HUD/CommandPalette";

interface ActiveProjectile {
  tool: ToolInfo;
  startPos: { x: number; y: number };
  targetPos: { x: number; y: number };
  destination: NavDestination;
}

export default function Home() {
  const [hasBooted, setHasBooted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Agent State Machine
  const [agentState, setAgentState] = useState<AgentState>("IDLE");
  const [hoveredDest, setHoveredDest] = useState<NavDestination | null>(null);
  const [lockedDest, setLockedDest] = useState<NavDestination | null>(null);
  const [activeModalDest, setActiveModalDest] = useState<NavDestination | null>(null);

  // Dynamic hand position reported by the 3D Robot canvas
  const [handPos, setHandPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [targetCoords, setTargetCoords] = useState<{ x: number; y: number } | null>(null);

  // Active flying tool projectile
  const [activeProjectile, setActiveProjectile] = useState<ActiveProjectile | null>(null);

  // Real-time telemetry object
  const [telemetry, setTelemetry] = useState<AgentTelemetry>({
    state: "IDLE",
    activeDestination: null,
    hoveredDestination: null,
    currentTool: null,
    statusMessage: "Autonomous portfolio AI agent standing by. Direct me to a module.",
    batteryLevel: 99.8,
    coreTemperature: 36.4,
    confidenceRate: 98.7,
    systemLogs: [
      "KERNEL INITIALIZED. QUANTUM BUS ONLINE.",
      "ALL 11 MISSION MODULES DOCKED AND READY.",
    ],
  });

  // Check reduced-motion preference on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setReducedMotion(true);
      }
    }
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an active input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        soundEngine.playClick();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        soundEngine.playClick();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addLog = useCallback((log: string) => {
    setTelemetry((prev) => ({
      ...prev,
      systemLogs: [...prev.systemLogs.slice(-8), log],
    }));
  }, []);

  // Update telemetry when agent state changes
  const updateAgentState = useCallback(
    (newState: AgentState, message?: string, tool?: ToolInfo | null) => {
      setAgentState(newState);
      setTelemetry((prev) => ({
        ...prev,
        state: newState,
        statusMessage: message || prev.statusMessage,
        currentTool: tool !== undefined ? tool : prev.currentTool,
      }));
    },
    []
  );

  // Callback from 3D robot canvas reporting exact screen coordinate of right hand
  const handleHandPosUpdate = useCallback((pos: { x: number; y: number }) => {
    setHandPos(pos);
  }, []);

  // --- HOVER HANDLER ---
  const handleNodeHover = useCallback(
    (dest: NavDestination, rect: DOMRect) => {
      if (agentState === "THROW" || agentState === "TOOL_TRAVEL") return;

      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;
      setTargetCoords({ x: targetX, y: targetY });
      setHoveredDest(dest);

      soundEngine.playHover();
      updateAgentState(
        "TARGET_LOCK",
        `Target detected: [${dest.label.toUpperCase()}]. Aiming tool: ${dest.tool.name}.`,
        dest.tool
      );
      addLog(`TARGET LOCKED: ${dest.code} [${dest.coordinates}]`);
    },
    [agentState, updateAgentState, addLog]
  );

  // --- LEAVE HOVER HANDLER ---
  const handleNodeLeave = useCallback(() => {
    if (
      agentState === "THROW" ||
      agentState === "TOOL_TRAVEL" ||
      lockedDest !== null
    ) {
      return;
    }

    setHoveredDest(null);
    setTargetCoords(null);
    updateAgentState("RETURN_IDLE", "Target disengaged. Returning to idle monitoring.", null);

    const timer = setTimeout(() => {
      setAgentState((curr) => (curr === "RETURN_IDLE" ? "IDLE" : curr));
    }, 400);

    return () => clearTimeout(timer);
  }, [agentState, lockedDest, updateAgentState]);

  // --- SIGNATURE INTERACTION: TOOL THROW TRIGGER ---
  const handleNodeSelect = useCallback(
    (dest: NavDestination, rect: DOMRect) => {
      if (agentState === "THROW" || agentState === "TOOL_TRAVEL") return;

      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;
      setTargetCoords({ x: targetX, y: targetY });
      setLockedDest(dest);

      // Phase 1: Equip & Aim
      soundEngine.playLock();
      updateAgentState("TOOL_EQUIP", `Equipping ${dest.tool.name} into right servo hand...`, dest.tool);
      addLog(`EQUIPPING TOOL: ${dest.tool.name}`);

      setTimeout(() => {
        // Phase 2: Aim
        updateAgentState("AIM", `Locking firing trajectory towards ${dest.label}...`, dest.tool);

        setTimeout(() => {
          // Phase 3: Throw
          updateAgentState("THROW", `Discharging ${dest.tool.name} payload!`, dest.tool);

          // Calculate launch origin: use real robot hand position if available, fallback to screen center
          const defaultStartX = typeof window !== "undefined" ? window.innerWidth / 2 + 60 : 300;
          const defaultStartY = typeof window !== "undefined" ? window.innerHeight / 2 - 20 : 300;

          const launchX = handPos.x > 0 ? handPos.x : defaultStartX;
          const launchY = handPos.y > 0 ? handPos.y : defaultStartY;

          // Activate physics projectile
          setActiveProjectile({
            tool: dest.tool,
            startPos: { x: launchX, y: launchY },
            targetPos: { x: targetX, y: targetY },
            destination: dest,
          });

          updateAgentState("TOOL_TRAVEL", `Projective in transit to ${dest.label}...`, dest.tool);
          addLog(`TOOL LAUNCHED: ${dest.tool.name} -> ${dest.code}`);
        }, 180);
      }, 180);
    },
    [agentState, handPos, updateAgentState, addLog]
  );

  // --- PROJECTILE IMPACT CALLBACK ---
  const handleProjectileImpact = useCallback(() => {
    if (!activeProjectile) return;
    const dest = activeProjectile.destination;

    // Cinematic screen shake on projectile impact
    if (!reducedMotion) {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 240);
    }

    updateAgentState("TARGET_RECEIVE", dest.tool.impactLog, dest.tool);
    addLog(`IMPACT REGISTERED: ${dest.tool.impactLog}`);

    setTimeout(() => {
      updateAgentState("SUCCESS", `Module ${dest.label.toUpperCase()} online. Opening viewport.`, dest.tool);
      setActiveModalDest(dest);
      setActiveProjectile(null);
      setLockedDest(null);

      setTimeout(() => {
        updateAgentState("RETURN_IDLE", "Mission completed. Awaiting next command directive.", null);
        setTimeout(() => {
          setAgentState("IDLE");
        }, 300);
      }, 350);
    }, 150);
  }, [activeProjectile, reducedMotion, updateAgentState, addLog]);

  // --- CLOSE MODAL HANDLER ---
  const handleCloseModal = useCallback(() => {
    setActiveModalDest(null);
    updateAgentState("IDLE", "Module docked. Awaiting next navigation directive.", null);
    addLog("MODULE DISENGAGED. RETURNING TO ORBITAL STAGE.");
  }, [updateAgentState, addLog]);

  // Quick autonomous scan action
  const handleQuickDispatch = useCallback(() => {
    const randomDest =
      NAVIGATION_DESTINATIONS[
        Math.floor(Math.random() * NAVIGATION_DESTINATIONS.length)
      ];
    const defaultRect = {
      left: typeof window !== "undefined" ? window.innerWidth / 2 - 100 : 200,
      top: typeof window !== "undefined" ? window.innerHeight / 2 - 100 : 200,
      width: 200,
      height: 80,
    } as DOMRect;
    handleNodeSelect(randomDest, defaultRect);
  }, [handleNodeSelect]);

  return (
    <main
      className={`relative w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-cyan-500 selection:text-black ${
        screenShake ? "animate-impact-shake" : ""
      }`}
    >
      {/* Background Cybernetic Grid & Atmospheric Glows */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-slate-950 to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="fixed inset-0 scanlines opacity-40 pointer-events-none" />

      {/* Custom AI Targeting Crosshair Cursor for Desktop */}
      <AICursor agentState={agentState} isHoveringNode={hoveredDest !== null} />

      {/* Boot Sequence Terminal on initial load */}
      {!hasBooted && (
        <BootSequence onComplete={() => setHasBooted(true)} />
      )}

      {/* Main HUD Header Bar */}
      <HeaderHUD
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        soundMuted={soundMuted}
        onToggleSound={() => {
          const next = soundEngine.toggleMute();
          setSoundMuted(next);
        }}
        systemStatus={agentState === "IDLE" ? "NOMINAL" : "ENGAGED"}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Central Operating Theater */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-between z-10">
        {/* Onboarding Directive Banner */}
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-900 font-mono text-[10px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-bold tracking-wider">
              AUTONOMOUS DIRECTIVE:
            </span>
            <span className="text-slate-300 hidden sm:inline-block">
              Hover/tap any destination node to command robot to launch tool & decrypt section.
            </span>
            <span className="text-slate-300 sm:hidden">
              Tap any node to direct robot tool.
            </span>
          </div>

          <div className="font-mono text-cyan-300 hidden md:block">
            DESTINATIONS ARMED: [11 / 11]
          </div>
        </div>

        {/* Central Stage: Central 3D AI Robot + Surrounding Command Ring */}
        <div className="relative w-full flex-1 flex flex-col justify-center">
          <CommandNavRing
            destinations={NAVIGATION_DESTINATIONS}
            hoveredDestination={hoveredDest}
            lockedDestination={lockedDest}
            activeDestination={activeModalDest}
            onHover={handleNodeHover}
            onLeave={handleNodeLeave}
            onSelect={handleNodeSelect}
            reducedMotion={reducedMotion}
            centerContent={
              <div className="w-full max-w-lg flex flex-col items-center justify-center">
                {/* The Signature 3D AI Robot Canvas or 2D Fallback */}
                <div className="w-full h-72 sm:h-80 lg:h-88 flex items-center justify-center">
                  {reducedMotion ? (
                    <AgentFallback
                      key="agent-2d-fallback"
                      state={agentState}
                      activeTool={hoveredDest?.tool || lockedDest?.tool || null}
                      targetLabel={hoveredDest?.label || lockedDest?.label || null}
                      reducedMotion={reducedMotion}
                    />
                  ) : (
                    <AgentCanvas
                      key="agent-3d-canvas"
                      state={agentState}
                      activeTool={hoveredDest?.tool || lockedDest?.tool || null}
                      targetCoords={targetCoords}
                      onHandScreenPosition={handleHandPosUpdate}
                      reducedMotion={false}
                    />
                  )}
                </div>

                {/* Tactical AI Telemetry Panel under Robot with clear spacing */}
                <div className="w-full px-1 sm:px-2 mt-6 sm:mt-8">
                  <AgentStatusPanel
                    telemetry={telemetry}
                    targetLabel={hoveredDest?.label || lockedDest?.label || null}
                    onQuickDispatch={handleQuickDispatch}
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Physics Flying Tool Projectile */}
      {activeProjectile && (
        <ToolProjectile
          tool={activeProjectile.tool}
          startPos={activeProjectile.startPos}
          targetPos={activeProjectile.targetPos}
          onImpact={handleProjectileImpact}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Cinematic Modal Window when Destination is Decrypted */}
      {activeModalDest && (
        <SectionModal destination={activeModalDest} onClose={handleCloseModal}>
          {activeModalDest.id === "about" && <AboutSection />}
          {activeModalDest.id === "projects" && <ProjectsSection />}
          {activeModalDest.id === "skills" && <SkillsSection />}
          {activeModalDest.id === "experience" && <ExperienceSection />}
          {activeModalDest.id === "education" && <EducationSection />}
          {activeModalDest.id === "achievements" && <AchievementsSection />}
          {activeModalDest.id === "certifications" && <CertificationsSection />}
          {activeModalDest.id === "github" && <GitHubSection />}
          {activeModalDest.id === "resume" && <ResumeSection />}
          {activeModalDest.id === "contact" && <ContactSection />}
          {activeModalDest.id === "assistant" && <AIAssistantSection />}
        </SectionModal>
      )}

      {/* Command Palette Quick Search Overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectDestination={(dest) => {
          const defaultRect = {
            left: typeof window !== "undefined" ? window.innerWidth / 2 - 100 : 200,
            top: typeof window !== "undefined" ? window.innerHeight / 2 - 100 : 200,
            width: 200,
            height: 80,
          } as DOMRect;
          handleNodeSelect(dest, defaultRect);
        }}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        onToggleSound={() => {
          const next = soundEngine.toggleMute();
          setSoundMuted(next);
        }}
        onQuickDispatch={handleQuickDispatch}
        reducedMotion={reducedMotion}
        soundMuted={soundMuted}
      />

      {/* Global Tactical Footer Bar */}
      <footer className="w-full border-t border-slate-900 bg-black/80 px-4 sm:px-8 py-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none z-20">
        <div className="flex items-center gap-3">
          <span>OPERATING SYSTEM: AEGIS-OS // HOST: YSUJITH728</span>
          <span className="hidden sm:inline-block">•</span>
          <span className="hidden sm:inline-block text-cyan-400">
            AUTONOMOUS AGENT ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>&copy; {new Date().getFullYear()} Y SUJITH</span>
          <span>•</span>
          <a
            href="https://github.com/ysujith728"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-white transition-colors"
          >
            GITHUB: ysujith728
          </a>
        </div>
      </footer>
    </main>
  );
}