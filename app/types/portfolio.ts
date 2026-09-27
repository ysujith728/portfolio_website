export interface ProjectItem {
  id: string;
  title: string;
  codename: string;
  category: "AI & ML" | "Robotics & IoT" | "Systems & Web";
  description: string;
  longDescription: string;
  techStack: string[];
  status: "ONLINE" | "DEPLOYED" | "RESEARCH" | "PROTOTYPE";
  githubUrl?: string;
  liveUrl?: string;
  metrics?: { label: string; value: string }[];
  featured?: boolean;
}

export interface SkillCategory {
  title: string;
  code: string;
  skills: {
    name: string;
    level: number; // 0 to 100
    category: string;
    description: string;
    icon?: string;
  }[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  organization: string;
  location: string;
  highlights: string[];
  technologies: string[];
  status: "COMPLETED" | "CURRENT";
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  score?: string;
  details: string[];
  coursework: string[];
}

export interface AchievementItem {
  title: string;
  category: string;
  date: string;
  description: string;
  credential?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
}
