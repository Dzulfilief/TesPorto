import { Project, Profile, Experience } from "./types";

export const DEFAULT_PROFILE: Profile = {
  name: "Alief",
  title: "Futuristic Full-Stack Engineer & Interaction Architect",
  aboutMe: "I craft immersive, ultra-high-performance digital spaces and next-generation web platforms. Combining high-end design sensibilities with robust cloud architectures, I bridge the gap between creative storytelling and advanced computer systems.",
  avatarUrl: "/assets/foto.jpg",
  skills: [
    "TypeScript / React / Next.js",
    "Creative Development (WebGL, Three.js, Motion)",
    "Cloud Native Arch (Node.js, Docker, Cloud Run)",
    "Serverless Databases (Firestore, PostgreSQL)",
    "Holographic UI & Shader Art",
    "Generative AI Integration"
  ],
  email: "kenji@takahashi.io",
  github: "https://github.com/kenji-takahashi",
  linkedin: "https://linkedin.com/in/kenji-takahashi",
  twitter: "https://twitter.com/kenji_takahashi"
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "quantum-workspace",
    title: "Quantum Workspace",
    description: "An ultra-secure, cloud-native developer terminal featuring a unified dashboard, instant sandbox environments, and an integrated real-time debugger.",
    category: "Web App",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    demoUrl: "https://workspace.kenji.io",
    githubUrl: "https://github.com/kenji/quantum-workspace",
    tags: ["React", "TypeScript", "Tailwind CSS", "Firebase", "WebSockets"],
    createdAt: 1718000000
  },
  {
    id: "plasma-audio-synth",
    title: "Plasma Audio Synth",
    description: "Interactive browser-based modular synthesizer and visualizer using Web Audio API and canvas physics for real-time generative audio composition.",
    category: "Creative Dev",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    demoUrl: "https://synth.kenji.io",
    githubUrl: "https://github.com/kenji/plasma-synth",
    tags: ["Web Audio API", "Canvas 2D", "React", "TypeScript"],
    createdAt: 1719000000
  },
  {
    id: "nova-ai-visualizer",
    title: "Nova Generative Analytics",
    description: "Full-stack real-time analytics engine and dashboard visualizing neural network architectures, model performance metrics, and system telemetry.",
    category: "AI & ML",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    demoUrl: "https://nova.kenji.io",
    githubUrl: "https://github.com/kenji/nova-ai",
    tags: ["Next.js", "Gemini API", "D3.js", "PostgreSQL", "Tailwind CSS"],
    createdAt: 1720000000
  },
  {
    id: "helios-xr-design",
    title: "Helios XR Design Interface",
    description: "Experimental glassmorphic responsive interface system optimized for spatial computing and high-framerate multi-touch augmented reality devices.",
    category: "UI/UX Design",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
    tags: ["Figma", "Spatial UX", "Glassmorphism", "Motion Prototyping"],
    createdAt: 1721000000
  }
];

export const DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: "exp1",
    role: "Lead Creative Technologist",
    company: "Hexa Systems (Tokyo)",
    period: "2024 - Present",
    description: "Designing responsive interactive platforms, full-stack tools, and WebGL modules for global enterprise portfolios. Driving high-fidelity visual standard guidelines across multidisciplinary teams."
  },
  {
    id: "exp2",
    role: "Full-Stack Web Architect",
    company: "Omni Labs Corp",
    period: "2021 - 2024",
    description: "Led development of robust serverless cloud infrastructures and reactive browser dashboards. Maintained secure OAuth configurations and Firebase/Firestore integrations for 100k+ active users."
  },
  {
    id: "exp3",
    role: "UI Engineer & Interactive Developer",
    company: "Zenith Studio",
    period: "2019 - 2021",
    description: "Designed complex micro-interactions, responsive layouts, and spatial physics canvases. Collaborated closely with creative directors to construct sleek digital experiences."
  }
];
