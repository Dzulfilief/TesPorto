import { motion } from "motion/react";
import { Mail, Github, Linkedin, ArrowUp } from "lucide-react";

interface FooterProps {
  name: string;
  onScrollToTop: () => void;
}

export default function Footer({ name, onScrollToTop }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      className="bg-transparent border-t border-slate-200/50 dark:border-white/5 py-12 px-6 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand details */}
        <div className="text-center md:text-left">
          <span className="font-display font-bold text-base text-slate-800 dark:text-slate-100 tracking-wide">
            {name}
            <span className="text-cyan-500 font-mono">.KT</span>
          </span>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
            &copy; {currentYear} &mdash; Digital Portfolio Space. All Rights Reserved.
          </p>
        </div>

        {/* Action button: scroll to top */}
        <div className="flex items-center gap-4">
          <button
            onClick={onScrollToTop}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:border-cyan-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Return to top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
