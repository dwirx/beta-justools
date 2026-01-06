import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Zap, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  toolName?: string;
}

export const Header = ({ showBack, toolName }: HeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-4 border-b border-border/50"
    >
      <div className="flex items-center gap-3">
        {showBack ? (
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Tools</span>
          </Link>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-border bg-secondary">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DevTools</h1>
              <p className="text-xs text-muted-foreground">Lightweight HTML Tools</p>
            </div>
          </>
        )}
        {showBack && toolName && (
          <div className="flex items-center gap-2 ml-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center gradient-border bg-secondary">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold">{toolName}</span>
          </div>
        )}
      </div>

      <nav className="flex items-center gap-4">
        {!showBack && (
          <>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/myapps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              My Apps
            </Link>
          </>
        )}
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
