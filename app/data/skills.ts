import { SkillCategory } from "../types/portfolio";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Artificial Intelligence & ML",
    code: "AI_ML_01",
    skills: [
      {
        name: "Python (Scientific Stack)",
        level: 92,
        category: "AI & ML",
        description: "NumPy, Pandas, SciPy, Matplotlib, data wrangling and numerical analysis.",
      },
      {
        name: "PyTorch & Deep Learning",
        level: 86,
        category: "AI & ML",
        description: "Neural network architectures, tensor operations, model fine-tuning.",
      },
      {
        name: "Computer Vision & OpenCV",
        level: 85,
        category: "AI & ML",
        description: "Image processing, feature extraction, object detection, optical flow.",
      },
      {
        name: "Scikit-Learn & ML Algorithms",
        level: 88,
        category: "AI & ML",
        description: "Supervised & unsupervised learning, ensemble methods, clustering, regression.",
      },
      {
        name: "NLP & Agentic Pipelines",
        level: 82,
        category: "AI & ML",
        description: "Tokenization, embeddings, RAG pipelines, autonomous agent decision logic.",
      },
    ],
  },
  {
    title: "Robotics & Embedded Systems",
    code: "ROBO_EMBED_02",
    skills: [
      {
        name: "C & C++ Programming",
        level: 90,
        category: "Robotics & Embedded Systems",
        description: "Memory management, pointers, object-oriented firmware, hardware registers.",
      },
      {
        name: "Arduino & Microcontrollers",
        level: 94,
        category: "Robotics & Embedded Systems",
        description: "AVR/ESP32, GPIO, PWM, I2C/SPI protocols, analog/digital sensor integration.",
      },
      {
        name: "Webots & Simulation",
        level: 86,
        category: "Robotics & Embedded Systems",
        description: "Physics simulation, digital twin modeling, motor actuation, collision bounds.",
      },
      {
        name: "ROS (Robot Operating System)",
        level: 78,
        category: "Robotics & Embedded Systems",
        description: "Nodes, topics, publishers/subscribers, message passing, coordinate transforms.",
      },
      {
        name: "SLAM & Odometry",
        level: 76,
        category: "Robotics & Embedded Systems",
        description: "Visual odometry, state estimation, landmark tracking, pose-graph mapping.",
      },
    ],
  },
  {
    title: "Full Stack & Web Architecture",
    code: "WEB_STACK_03",
    skills: [
      {
        name: "React & Next.js",
        level: 90,
        category: "Full Stack",
        description: "App router, SSR/SSG, server actions, hooks, component lifecycle optimization.",
      },
      {
        name: "TypeScript & Modern JavaScript",
        level: 88,
        category: "Full Stack",
        description: "Strict typing, generics, interfaces, async/await, ESNext modern paradigms.",
      },
      {
        name: "Tailwind CSS & Creative UI",
        level: 92,
        category: "Full Stack",
        description: "Responsive layouts, custom design systems, animations, glassmorphism.",
      },
      {
        name: "Node.js & Express / FastAPI",
        level: 84,
        category: "Full Stack",
        description: "RESTful architecture, middleware, authentication, rate limiting, async workers.",
      },
      {
        name: "Three.js & WebGL Graphics",
        level: 80,
        category: "Full Stack",
        description: "3D scene composition, custom shaders, geometry pipelines, animation loops.",
      },
    ],
  },
  {
    title: "Systems, Tools & Infrastructure",
    code: "SYSTEMS_04",
    skills: [
      {
        name: "Linux & Shell Scripting",
        level: 86,
        category: "Systems",
        description: "Debian/Ubuntu, bash scripting, process management, network configuration.",
      },
      {
        name: "Git & GitHub Version Control",
        level: 90,
        category: "Systems",
        description: "Branching strategies, pull requests, CI/CD actions, repo maintenance.",
      },
      {
        name: "Databases (MongoDB & SQL)",
        level: 82,
        category: "Systems",
        description: "Relational schema design, NoSQL document modeling, indexing, querying.",
      },
      {
        name: "Docker & Containerization",
        level: 78,
        category: "Systems",
        description: "Dockerfile composition, image optimization, multi-container orchestration.",
      },
    ],
  },
];
