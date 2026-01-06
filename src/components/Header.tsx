import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Zap, ArrowLeft, Menu, X } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  toolName?: string;
}

export const Header = ({ showBack, toolName }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-50"
    >
      <div className="flex items-center gap-2 sm:gap-3">
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center gradient-border bg-secondary">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">DevTools</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Lightweight HTML Tools</p>
            </div>
          </>
        )}
        {showBack && toolName && (
          <div className="flex items-center gap-2 ml-2 sm:ml-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center gradient-border bg-secondary">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{toolName}</span>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex items-center gap-4">
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
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm"
        >
          <Github className="w-4 h-4" />
          <span className="hidden md:inline">GitHub</span>
        </a>
      </nav>

      {/* Mobile Menu Button */}
      {!showBack && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && !showBack && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 sm:hidden"
          >
            <nav className="flex flex-col gap-2">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/myapps" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                My Apps
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
