export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

export interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
}

const FALLBACK_PROFILE: GitHubProfile = {
  login: "ysujith728",
  name: "Y Sujith",
  bio: "B.Tech CSE | AI & Autonomous Systems | Robotics & Full Stack Developer",
  public_repos: 18,
  followers: 42,
  following: 38,
  avatar_url: "https://avatars.githubusercontent.com/u/104278144?v=4",
  html_url: "https://github.com/ysujith728",
};

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    name: "SciVerify",
    description: "Automated AI claim verification and citation grounding engine using NLP and vector embeddings.",
    html_url: "https://github.com/ysujith728",
    stargazers_count: 24,
    forks_count: 5,
    language: "Python",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    name: "LP-SLAM-TECC",
    description: "Low-power embedded visual SLAM navigation system for resource-constrained robotics platforms.",
    html_url: "https://github.com/ysujith728",
    stargazers_count: 31,
    forks_count: 7,
    language: "C++",
    updated_at: "2024-11-20T00:00:00Z",
  },
  {
    name: "NetGuard-QoS-IDS",
    description: "Real-time network intrusion detection system combining anomaly classification with active QoS shaping.",
    html_url: "https://github.com/ysujith728",
    stargazers_count: 19,
    forks_count: 4,
    language: "Python",
    updated_at: "2024-10-12T00:00:00Z",
  },
  {
    name: "Auto-Strider-Simulation",
    description: "Webots physics simulation and Arduino PID firmware for autonomous line tracking robot.",
    html_url: "https://github.com/ysujith728",
    stargazers_count: 15,
    forks_count: 3,
    language: "C++",
    updated_at: "2024-09-05T00:00:00Z",
  },
  {
    name: "GlobeRadio",
    description: "3D interactive globe for real-time worldwide radio frequency streaming using Three.js.",
    html_url: "https://github.com/ysujith728",
    stargazers_count: 28,
    forks_count: 6,
    language: "TypeScript",
    updated_at: "2024-08-30T00:00:00Z",
  },
  {
    name: "Smart-Home-Safety-IoT",
    description: "Multi-hazard embedded environmental safety shield for fire, combustible gas, and intrusion detection.",
    html_url: "https://github.com/ysujith728",
    stargazers_count: 12,
    forks_count: 2,
    language: "C++",
    updated_at: "2024-06-18T00:00:00Z",
  },
];

let cachedProfile: GitHubProfile | null = null;
let cachedRepos: GitHubRepo[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function fetchGitHubData(): Promise<{
  profile: GitHubProfile;
  repos: GitHubRepo[];
  isLive: boolean;
}> {
  const now = Date.now();
  if (cachedProfile && cachedRepos && now - lastFetchTime < CACHE_TTL) {
    return { profile: cachedProfile, repos: cachedRepos, isLive: true };
  }

  try {
    const headers = { Accept: "application/vnd.github.v3+json" };

    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/ysujith728", { headers, next: { revalidate: 600 } }),
      fetch("https://api.github.com/users/ysujith728/repos?sort=updated&per_page=6", {
        headers,
        next: { revalidate: 600 },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return { profile: FALLBACK_PROFILE, repos: FALLBACK_REPOS, isLive: false };
    }

    const userData = await userRes.json();
    const reposData = await reposRes.json();

    const profile: GitHubProfile = {
      login: userData.login || FALLBACK_PROFILE.login,
      name: userData.name || FALLBACK_PROFILE.name,
      bio: userData.bio || FALLBACK_PROFILE.bio,
      public_repos: userData.public_repos ?? FALLBACK_PROFILE.public_repos,
      followers: userData.followers ?? FALLBACK_PROFILE.followers,
      following: userData.following ?? FALLBACK_PROFILE.following,
      avatar_url: userData.avatar_url || FALLBACK_PROFILE.avatar_url,
      html_url: userData.html_url || FALLBACK_PROFILE.html_url,
    };

    const repos: GitHubRepo[] = Array.isArray(reposData) && reposData.length > 0
      ? reposData.map((r: { name?: string; description?: string; html_url?: string; stargazers_count?: number; forks_count?: number; language?: string; updated_at?: string }) => ({
          name: r.name || "Repository",
          description: r.description || "Autonomous project repository by ysujith728",
          html_url: r.html_url || "https://github.com/ysujith728",
          stargazers_count: r.stargazers_count || 0,
          forks_count: r.forks_count || 0,
          language: r.language || "TypeScript",
          updated_at: r.updated_at || new Date().toISOString(),
        }))
      : FALLBACK_REPOS;

    cachedProfile = profile;
    cachedRepos = repos;
    lastFetchTime = now;

    return { profile, repos, isLive: true };
  } catch {
    return { profile: FALLBACK_PROFILE, repos: FALLBACK_REPOS, isLive: false };
  }
}
