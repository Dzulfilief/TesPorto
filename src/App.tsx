import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { AnimatePresence } from "motion/react";
import { db, auth } from "./firebase";
import { Project, Profile, Experience } from "./types";
import { DEFAULT_PROFILE, DEFAULT_PROJECTS, DEFAULT_EXPERIENCES } from "./data";

import Header from "./components/Header";
import Intro from "./components/Intro";
import Portfolio from "./components/Portfolio";
import ExperienceSection from "./components/Experience";
import CMSPanel from "./components/CMSPanel";
import Footer from "./components/Footer";

export default function App() {
  // Theme dark-mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Master Portfolio and Profile States
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPERIENCES);

  // Layout UI states
  const [activeSection, setActiveSection] = useState("intro");
  const [isCMSOpen, setIsCMSOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync theme with HTML root tag class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Auth Status check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Sync/Fetch Firestore Database Data
  const fetchAllData = async () => {
    try {
      // 1. Get Profile Setting
      const profileSnap = await getDoc(doc(db, "profile", "settings"));
      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as Profile);
      } else {
        setProfile(DEFAULT_PROFILE);
      }

      // 2. Get projects collection
      const projectsSnap = await getDocs(collection(db, "projects"));
      const loadedProjects: Project[] = [];
      projectsSnap.forEach((docRef) => {
        loadedProjects.push(docRef.data() as Project);
      });

      if (loadedProjects.length > 0) {
        loadedProjects.sort((a, b) => b.createdAt - a.createdAt);
        setProjects(loadedProjects);
      } else {
        setProjects(DEFAULT_PROJECTS);
      }
    } catch (error) {
      console.warn("Firestore fetch inactive or blocked, utilizing high-end local assets:", error);
      setProfile(DEFAULT_PROFILE);
      setProjects(DEFAULT_PROJECTS);
    }
  };

  // Perform initial database fetch on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Section Observer for active Navigation links
  useEffect(() => {
    const sections = ["intro", "portfolio", "experience"];
    const observers = sections.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.35 }
      );

      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.element);
      });
    };
  }, [projects]); // re-run if projects array length updates element bounds

  // Navigation Trigger Handler
  const handleNavigate = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  // Database seed callback passed to CMS Setup
  const handleSeedDatabase = async () => {
    try {
      // Seed Profile doc
      await setDoc(doc(db, "profile", "settings"), DEFAULT_PROFILE);

      // Seed each default project doc
      for (const project of DEFAULT_PROJECTS) {
        await setDoc(doc(db, "projects", project.id), project);
      }

      // Reload
      await fetchAllData();
    } catch (error) {
      console.error("Database seed execution failed:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050508] text-slate-800 dark:text-slate-100 selection:bg-cyan-500/30 selection:text-slate-950 dark:selection:text-white transition-colors duration-300 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/10 dark:bg-cyan-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 dark:bg-purple-900/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Floating Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        openCMS={() => setIsCMSOpen(true)}
        profileName={profile.name}
      />

      {/* Hero / Biography Panel */}
      <Intro
        profile={profile}
        onExploreProjects={() => handleNavigate("portfolio")}
      />

      {/* Grid Portfolio Section */}
      <Portfolio projects={projects} />

      {/* Experience Chronology Timeline */}
      <ExperienceSection experiences={experiences} />

      {/* Footer Block */}
      <Footer
        name={profile.name}
        onScrollToTop={() => handleNavigate("intro")}
      />

      {/* CMS Control Center Overlay Panel */}
      <AnimatePresence>
        {isCMSOpen && (
          <CMSPanel
            onClose={() => setIsCMSOpen(false)}
            profile={profile}
            projects={projects}
            experiences={experiences}
            onRefreshData={fetchAllData}
            onSeedDatabase={handleSeedDatabase}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
