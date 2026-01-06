import { motion } from 'framer-motion';
import { Github, Zap } from 'lucide-react';

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-4 border-b border-border/50"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-border bg-secondary">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">DevTools</h1>
          <p className="text-xs text-muted-foreground">Lightweight HTML Tools</p>
        </div>
      </div>

      <nav className="flex items-center gap-4">
        <a
          href="https://github.com/justhtmls/html-tools"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </nav>
    </motion.header>
  );
};
