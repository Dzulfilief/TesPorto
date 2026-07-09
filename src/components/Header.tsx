import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon, Lock, CheckCircle } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  isAuthenticated: boolean;
  openCMS: () => void;
  profileName: string;
}

export default function Header({
  darkMode,
  setDarkMode,
  activeSection,
  onNavigate,
  isAuthenticated,
  openCMS,
  profileName,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Intro", id: "intro" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Experience", id: "experience" },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "KT";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-black/30 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          id="btn-logo"
          onClick={() => handleNavClick("intro")}
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center font-display font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] text-base">
            {getInitials(profileName)[0]}
          </div>
          <span className="font-display font-medium text-xl text-slate-800 dark:text-white tracking-tighter uppercase">
            {profileName.replace(/\s+/g, ".")}
          </span>
        </motion.button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-white/5 p-1 rounded-full border border-slate-200/50 dark:border-white/10 backdrop-blur-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`relative px-5 py-1.5 rounded-full font-display text-sm font-medium transition-colors cursor-pointer ${
                activeSection === item.id
                  ? "text-slate-900 dark:text-cyan-400 font-semibold"
                  : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white dark:bg-white/10 border border-slate-200/80 dark:border-white/10 shadow-sm rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div id="desktop-controls" className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            id="btn-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          {/* CMS Admin Button */}
          <motion.button
            id="btn-cms-toggle"
            onClick={openCMS}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-semibold tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
              isAuthenticated
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
                : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:text-cyan-500"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAuthenticated ? (
              <>
                <CheckCircle size={14} className="animate-pulse" />
                CMS Active
              </>
            ) : (
              <>
                <Lock size={14} />
                Portal CMS
              </>
            )}
          </motion.button>
        </div>

        {/* Mobile Nav Button */}
        <div id="mobile-controls" className="flex md:hidden items-center gap-2">
          <button
            id="btn-mobile-theme"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            id="btn-mobile-menu"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2 font-display font-medium text-base ${
                    activeSection === item.id
                      ? "text-cyan-500 dark:text-cyan-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <hr className="border-slate-100 dark:border-slate-900" />

              <button
                id="btn-mobile-cms"
                onClick={() => {
                  openCMS();
                  setIsOpen(false);
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg font-display text-sm font-semibold tracking-wider uppercase border ${
                  isAuthenticated
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                    : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {isAuthenticated ? (
                  <>
                    <CheckCircle size={16} />
                    CMS Panel Active
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Open Admin CMS Portal
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
