import { ExperienceItem } from "../types/portfolio";

export const PORTFOLIO_EXPERIENCE: ExperienceItem[] = [
  {
    period: "2023 – PRESENT",
    role: "Autonomous Systems & AI Engineer (Undergraduate Researcher)",
    organization: "Systems & Robotics Innovation Lab",
    location: "India",
    highlights: [
      "Designed and simulated autonomous robotics agents including line-following rovers (Auto Strider) and visual SLAM pipelines (LP-SLAM-TECC).",
      "Engineered full-stack interactive web dashboards and telemetry interfaces with Next.js, React, and FastAPI.",
      "Researched machine learning applications in automated verification (SciVerify) and intrusion detection (NetGuard-QoS-IDS).",
    ],
    technologies: ["C++", "Python", "ROS", "Webots", "Arduino", "Next.js", "PyTorch"],
    status: "CURRENT",
  },
  {
    period: "2023 – 2024",
    role: "Full Stack & Embedded Developer",
    organization: "Independent & Open Source Projects",
    location: "Remote",
    highlights: [
      "Engineered IoT environmental hazard detection system (Smart Home Safety) with gas, flame, and PIR sensors.",
      "Developed GlobeRadio, an interactive 3D spatial radio streaming application using Three.js and the Web Audio API.",
      "Maintained active open source repositories on GitHub (ysujith728) with structured CI pipelines and documentation.",
    ],
    technologies: ["TypeScript", "React", "Node.js", "MongoDB", "C++", "Three.js"],
    status: "COMPLETED",
  },
];
