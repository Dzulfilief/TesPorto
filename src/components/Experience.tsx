import { motion } from "motion/react";
import { Briefcase, Calendar, GraduationCap, Star } from "lucide-react";
import { Experience } from "../types";

interface ExperienceProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceProps) {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section
      id="experience"
      className="relative min-h-screen py-24 bg-transparent transition-colors duration-300"
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-40 dark:opacity-100" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-8000" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            id="exp-title-tag"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Briefcase size={12} />
            <span>Chronology</span>
          </motion.div>

          <motion.h2
            id="exp-heading"
            className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-slate-100 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Chronicles of Experience
          </motion.h2>

          <motion.p
            id="exp-sub"
            className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            A cosmic trace of my career milestones, creative experiments, and cloud integration architectures.
          </motion.p>
        </div>

        {/* Timeline Path Structure */}
        <motion.div
          id="exp-timeline-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative border-l-2 border-slate-200 dark:border-slate-800/80 ml-4 md:ml-6 pl-8 md:pl-10 space-y-12"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              id={`experience-item-${exp.id}`}
              variants={cardVariants}
              className="relative"
            >
              {/* Timeline Bullet Ring with glow effect */}
              <div className="absolute -left-[41px] md:-left-[49px] top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-950 border-2 border-cyan-500 flex items-center justify-center shadow-glow-cyan z-10">
                <Star size={10} className="text-cyan-500 fill-cyan-500" />
              </div>

              {/* Holographic Glowing Connector Line */}
              <div className="absolute -left-[48px] md:-left-[58px] top-4.5 w-4 h-[1px] bg-cyan-500/40" />

              {/* Main Content card */}
              <div className="group bg-white/85 dark:bg-white/5 p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 hover:border-violet-500/40 dark:hover:border-violet-500/30 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] backdrop-blur-sm">
                {/* Meta details header line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="font-display font-semibold text-sm text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                      {exp.company}
                    </p>
                  </div>

                  {/* Period badge */}
                  <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/30 dark:border-slate-800/50 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 shadow-inner">
                    <Calendar size={11} />
                    {exp.period}
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-sans">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
