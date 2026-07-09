import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, Search, Globe, Tag, Code, Eye, X } from "lucide-react";
import { Project } from "../types";

interface PortfolioProps {
  projects: Project[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Extract unique categories dynamically from the active list
  const categories = useMemo(() => {
    const list = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(list)];
  }, [projects]);

  // Filter projects by both category and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section
      id="portfolio"
      className="relative min-h-screen py-24 bg-transparent border-t border-b border-slate-200/50 dark:border-white/5 transition-colors duration-300"
    >
      {/* Glow Orbs */}
      <div className="absolute top-1/3 right-1/20 w-80 h-80 bg-violet-400/10 dark:bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/20 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            id="portfolio-title-tag"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Code size={12} />
            <span>Digital Archive</span>
          </motion.div>

          <motion.h2
            id="portfolio-heading"
            className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Featured Installations
          </motion.h2>

          <motion.p
            id="portfolio-sub"
            className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            A curated grid of my designs, creative systems, full-stack tools, and digital solutions.
          </motion.p>
        </div>

        {/* Toolbar: Category tabs and search bar */}
        <div id="portfolio-toolbar" className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
          {/* Categories Tab Group */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                id={`btn-cat-${category.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Dynamic Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input
              id="portfolio-search-input"
              type="text"
              placeholder="Search technologies or names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-sans bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 focus:bg-white dark:focus:bg-slate-900/90 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Projects Grid Grid */}
        {filteredProjects.length === 0 ? (
          <motion.div
            id="portfolio-empty-state"
            className="text-center py-20 bg-white/25 dark:bg-slate-950/10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-slate-500 dark:text-slate-400 font-display font-medium text-base">
              No matching modules found in the archive.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 text-xs font-mono font-bold text-cyan-500 uppercase tracking-widest hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            id="portfolio-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                  className="group bg-white/85 dark:bg-white/5 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-white/10 hover:border-cyan-500/40 dark:hover:border-cyan-500/30 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col justify-between backdrop-blur-sm relative"
                >
                  {/* Image and overlay header */}
                  <div className="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />

                    {/* Dark gradient shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 dark:opacity-85" />

                    {/* Quick view overlay card button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/40 backdrop-blur-[2px]">
                      <button
                        onClick={() => setActiveProject(project)}
                        className="px-4 py-2 rounded-xl bg-white text-slate-950 text-xs font-semibold font-display shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                      >
                        <Eye size={14} />
                        Inspect Module
                      </button>
                    </div>

                    {/* Category Label Overlay */}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white font-mono text-[10px] tracking-widest uppercase">
                      {project.category}
                    </span>

                    {/* Styled Item Counter Indicator */}
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-[11px] font-mono text-white backdrop-blur-md bg-black/40">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 font-sans leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.tags.slice(0, 4).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/50 text-[11px] font-mono text-slate-600 dark:text-slate-400"
                          >
                            <Tag size={10} className="opacity-60" />
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400">
                            +{project.tags.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Action buttons footer */}
                      <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-900 pt-4">
                        <button
                          onClick={() => setActiveProject(project)}
                          className="text-xs font-display font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
                        >
                          Details
                        </button>
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-display font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            Live
                            <Globe size={12} />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-display font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 flex items-center gap-1 cursor-pointer"
                          >
                            Code
                            <Github size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Inspect Project Modal Dialog */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            id="portfolio-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
            className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              id="portfolio-modal-content"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                id="btn-close-modal"
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white hover:bg-slate-900 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Large Image */}
              <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-900">
                <img
                  src={activeProject.imageUrl}
                  alt={activeProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-75" />

                {/* Info block overlayed on bottom */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] tracking-widest uppercase inline-block mb-3">
                    {activeProject.category}
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                    {activeProject.title}
                  </h3>
                </div>
              </div>

              {/* Contents and Details */}
              <div className="p-6 sm:p-8">
                <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                  Installation Summary
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                  {activeProject.description}
                </p>

                {/* Tech specifications */}
                <div className="mb-8">
                  <h4 className="font-display font-semibold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                    Archived Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-900">
                  {activeProject.demoUrl && (
                    <a
                      id="link-modal-demo"
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:scale-[1.01] text-white text-xs font-semibold font-display tracking-wide uppercase shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Globe size={14} />
                      Launch Application
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {activeProject.githubUrl && (
                    <a
                      id="link-modal-github"
                      href={activeProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 text-xs font-semibold font-display tracking-wide uppercase flex items-center gap-2 cursor-pointer"
                    >
                      <Github size={14} />
                      Browse Repository
                    </a>
                  )}

                  <button
                    id="btn-modal-close-text"
                    onClick={() => setActiveProject(null)}
                    className="px-5 py-2.5 rounded-xl bg-transparent border border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold font-display uppercase tracking-wide ml-auto cursor-pointer"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
