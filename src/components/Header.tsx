import { memo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Zap, ArrowLeft, Menu, X, FolderOpen } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  toolName?: string;
}

export const Header = memo(({ showBack, toolName }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-xl z-50">
      <div className="flex items-center gap-2 sm:gap-3">
        {showBack ? (
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-bold leading-tight">DevTools</h1>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground hidden xs:block">Developer Hub</p>
            </div>
          </Link>
        )}
        {showBack && toolName && (
          <span className="font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-none ml-1">
            {toolName}
          </span>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex items-center gap-3">
        {!showBack && (
          <>
            <Link to="/myapps" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
              <FolderOpen className="w-4 h-4" />
              My Apps
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              <span className="hidden md:inline">GitHub</span>
            </a>
          </>
        )}
      </nav>

      {/* Mobile Menu Button */}
      {!showBack && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 -mr-1 hover:bg-secondary rounded-lg transition-colors"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile Navigation - Simple dropdown */}
      {mobileMenuOpen && !showBack && (
        <div 
          className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg sm:hidden z-50"
        >
          <nav className="p-2 flex flex-col gap-1">
            <Link 
              to="/myapps" 
              onClick={closeMenu}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm"
            >
              <FolderOpen className="w-4 h-4 text-primary" />
              My Apps
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
});

Header.displayName = 'Header';
