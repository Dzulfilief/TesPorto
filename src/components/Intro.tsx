import { motion } from "motion/react";
import { ArrowDown, Mail, Github, Linkedin, Twitter, Terminal, Cpu, Layers } from "lucide-react";
import { Profile } from "../types";

interface IntroProps {
  profile: Profile;
  onExploreProjects: () => void;
}

export default function Intro({ profile, onExploreProjects }: IntroProps) {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <section
      id="intro"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-transparent transition-colors duration-300"
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-30 dark:opacity-100" />

      {/* Side Labels */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 rotate-180 hidden xl:block z-10" style={{ writingMode: "vertical-rl" }}>
        <span className="text-[10px] uppercase tracking-[0.4em] text-slate-300 dark:text-white/20 font-light">Portfolio Management System v2.0</span>
      </div>

      {/* CMS & Tech Float */}
      <div className="absolute bottom-12 right-12 p-5 bg-slate-100/90 dark:bg-black/60 border border-slate-200/50 dark:border-white/10 backdrop-blur-xl rounded-2xl hidden lg:flex items-center gap-4 shadow-sm z-10">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-bold text-white">FB</div>
          <div className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-bold text-white">RE</div>
          <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-bold text-cyan-400 font-mono">JS</div>
        </div>
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10"></div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-mono">CMS Engine</span>
          <span className="text-xs font-mono text-cyan-500 dark:text-cyan-400">FIREBASE_V9_LIVE</span>
        </div>
      </div>

      {/* Scrolling Visual Cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-10">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
        <span className="text-[9px] uppercase tracking-[0.3em] text-slate-400 dark:text-white/40">Explore Transition</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Bio & Details */}
        <motion.div
          id="intro-text-panel"
          className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Futuristic Status Badge */}
          <motion.div
            id="intro-status-badge"
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 self-start px-3 py-1 bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/60 font-mono font-medium">Available for Projects</span>
          </motion.div>

          {/* Main Display Heading */}
          <motion.h1
            id="intro-heading"
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tighter mb-6 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-950 dark:from-white dark:via-white dark:to-white/40 bg-clip-text text-transparent uppercase font-display"
          >
            CRAFTING<br/>DIGITAL<br/>SENSATIONS
          </motion.h1>

          {/* Title Subheading */}
          <motion.h2
            id="intro-subheading"
            variants={itemVariants}
            className="font-display font-medium text-base sm:text-lg text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-6"
          >
            {profile.name} &mdash; {profile.title}
          </motion.h2>

          {/* Biography Text */}
          <motion.p
            id="intro-bio"
            variants={itemVariants}
            className="text-slate-650 dark:text-white/50 text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-sans font-light"
          >
            {profile.aboutMe}
          </motion.p>

          {/* Core Technical Capabilities Tags */}
          <motion.div id="intro-skills" variants={itemVariants} className="mb-8">
            <h3 className="font-display font-semibold text-xs tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4 flex items-center gap-2">
              <Cpu size={14} className="text-cyan-500" /> Core Capabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-slate-100/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interactive Actions & Socials */}
          <motion.div
            id="intro-actions"
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            {/* CTA Button */}
            <motion.button
              id="btn-explore-projects"
              onClick={onExploreProjects}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-850 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:dark:bg-cyan-400 hover:bg-cyan-600 transition-colors cursor-pointer text-sm shadow-md"
            >
              Explore Portfolio
            </motion.button>

            {/* Email Contact Button */}
            <motion.a
              id="link-contact"
              href={`mailto:${profile.email}`}
              className="px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center gap-2 text-sm font-semibold cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail size={16} />
              Contact Me
            </motion.a>

            {/* Project Count Stat block */}
            <div className="flex flex-col border-l border-slate-200 dark:border-white/10 pl-5 py-1">
              <span className="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest mb-0.5 font-mono">Project Count</span>
              <span className="text-xl font-bold font-mono text-slate-800 dark:text-white">48+ Active</span>
            </div>

            {/* Social Icons Link Row */}
            <div className="flex items-center gap-2 ml-2">
              {profile.github && (
                <a
                  id="link-github"
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                  title="GitHub Profile"
                >
                  <Github size={20} />
                </a>
              )}
              {profile.linkedin && (
                <a
                  id="link-linkedin"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {profile.twitter && (
                <a
                  id="link-twitter"
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                  title="Twitter/X Profile"
                >
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Photo with holographic glowing frame */}
        <motion.div
          id="intro-photo-panel"
          className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
        >
          <div className="relative w-72 h-72 sm:w-85 sm:h-85 md:w-96 md:h-96">
            {/* Spinning tech HUD outlines */}
            <motion.div
              className="absolute -inset-4 rounded-full border border-dashed border-cyan-500/30 dark:border-cyan-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -inset-8 rounded-full border border-dashed border-violet-500/20 dark:border-violet-500/15"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />

            {/* Glowing Backdrop Circle */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-cyan-500/10 to-violet-600/15 blur-2xl" />

            {/* Main Image Frame Container with glowing glass effect */}
            <div className="absolute inset-0 rounded-full p-2 bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/10 dark:shadow-cyan-500/20 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden relative group">
                <img
                  id="img-avatar"
                  src={profile.avatarUrl}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85 hover:opacity-100"
                />

                {/* Grid Overlay inside photo */}
                <div className="absolute inset-0 bg-grid-cyber opacity-30 mix-blend-overlay" />

                {/* Scanner line animation across avatar */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-cyan-400/80 dark:bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            {/* Float Tech Badges */}
            <motion.div
              id="floating-badge-dev"
              className="absolute -top-2 -right-2 px-3 py-1.5 rounded-lg bg-slate-900/90 dark:bg-slate-900 border border-slate-800 text-white flex items-center gap-1.5 text-[10px] font-mono shadow-md"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Terminal size={12} className="text-cyan-400" />
              <span>STABLE_NODE</span>
            </motion.div>

            <motion.div
              id="floating-badge-ui"
              className="absolute -bottom-2 -left-2 px-3 py-1.5 rounded-lg bg-slate-900/90 dark:bg-slate-900 border border-slate-800 text-white flex items-center gap-1.5 text-[10px] font-mono shadow-md"
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <Layers size={12} className="text-violet-400" />
              <span>COMPILATION_OK</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Absolute Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 dark:opacity-40 animate-pulse pointer-events-none">
        <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">Scroll to explore</span>
        <ArrowDown size={14} className="text-slate-400" />
      </div>
    </section>
  );
}
