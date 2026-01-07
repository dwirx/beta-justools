import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Zap, ArrowLeft, Menu, X, Home, Wrench, Atom, Globe } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  toolName?: string;
}

export const Header = ({ showBack, toolName }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-xl z-50 safe-top"
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
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center gradient-border bg-secondary">
              <Zap className="w-5 h-5 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold">DevTools</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Lightweight HTML Tools</p>
            </div>
          </Link>
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border overflow-hidden sm:hidden"
          >
            <nav className="p-3 space-y-3">
              {/* Quick Navigation */}
              <div className="grid grid-cols-4 gap-2">
                <Link 
                  to="/?tab=all" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 hover:bg-secondary active:scale-95 transition-all"
                >
                  <Home className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-medium">Semua</span>
                </Link>
                <Link 
                  to="/?tab=tools" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 hover:bg-secondary active:scale-95 transition-all"
                >
                  <Wrench className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-medium">Tools</span>
                </Link>
                <Link 
                  to="/?tab=apps" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 hover:bg-secondary active:scale-95 transition-all"
                >
                  <Atom className="w-5 h-5 text-cyan-400" />
                  <span className="text-[10px] font-medium">React</span>
                </Link>
                <Link 
                  to="/?tab=html" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 hover:bg-secondary active:scale-95 transition-all"
                >
                  <Globe className="w-5 h-5 text-orange-400" />
                  <span className="text-[10px] font-medium">HTML</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50" />

              {/* Links */}
              <div className="flex gap-2">
                <Link 
                  to="/myapps" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary active:scale-95 transition-all text-sm"
                >
                  <Atom className="w-4 h-4" />
                  My Apps
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary active:scale-95 transition-all text-sm"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
