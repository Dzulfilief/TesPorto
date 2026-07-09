export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  tags: string[];
  createdAt: number;
}

export interface Profile {
  name: string;
  title: string;
  aboutMe: string;
  avatarUrl: string;
  skills: string[];
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}
