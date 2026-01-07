import { useState, useMemo, useEffect, useRef, memo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, WifiOff, Globe, Wrench, Atom } from 'lucide-react';
import { Header } from '@/components/Header';
import { UnifiedGrid } from '@/components/UnifiedGrid';
import { GridSkeleton } from '@/components/Skeleton';
import { useDebounce, useNetworkStatus, useIsMobile } from '@/hooks/usePerformance';
import {
  getAllItems,
  getTools,
  getTsxApps,
  getHtmlApps,
  getStats,
  type SectionId,
} from '@/lib/unifiedRegistry';

// Storage keys for state persistence
const STORAGE_KEYS = {
  TAB: 'devtools_active_tab',
  SCROLL: 'devtools_scroll_position',
  SEARCH: 'devtools_search_query',
};

// ─────────────────────────────────────────────────────────────────────────────
// TABS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const TABS: { id: SectionId | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Semua', icon: <Globe className="w-4 h-4" /> },
  { id: 'tools', label: 'Tools', icon: <Wrench className="w-4 h-4" /> },
  { id: 'apps', label: 'React Apps', icon: <Atom className="w-4 h-4" /> },
  { id: 'html', label: 'HTML Apps', icon: <Globe className="w-4 h-4" /> },
];

// ─────────────────────────────────────────────────────────────────────────────
// HERO COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Hero = memo(() => {
  const stats = getStats();

  return (
    <section className="py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-lg sm:text-2xl font-bold mb-1">
          <span className="gradient-text">All-in-One</span> Dev Hub
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3">
          100% lokal & privat
        </p>
        <div className="flex justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <span className="text-emerald-400">🛠️ {stats.tools}</span>
          <span className="text-cyan-400">⚛️ {stats.tsxApps}</span>
          <span className="text-orange-400">🌐 {stats.htmlApps}</span>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN INDEX PAGE
// ─────────────────────────────────────────────────────────────────────────────

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isInitialMount = useRef(true);
  
  // Get saved state from sessionStorage (persists during browser session)
  const getSavedTab = (): SectionId | 'all' => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.TAB);
    if (saved && ['all', 'tools', 'apps', 'html'].includes(saved)) {
      return saved as SectionId | 'all';
    }
    return 'all';
  };

  const getSavedSearch = (): string => {
    return sessionStorage.getItem(STORAGE_KEYS.SEARCH) || '';
  };
  
  // Initialize state from URL params first, then sessionStorage
  const tabFromUrl = searchParams.get('tab') as SectionId | 'all' | null;
  const initialTab = tabFromUrl && ['all', 'tools', 'apps', 'html'].includes(tabFromUrl) 
    ? tabFromUrl 
    : getSavedTab();

  const [activeTab, setActiveTabState] = useState<SectionId | 'all'>(initialTab);
  const [searchQuery, setSearchQuery] = useState(getSavedSearch());

  // Update tab and save to storage
  const setActiveTab = useCallback((tab: SectionId | 'all') => {
    setActiveTabState(tab);
    sessionStorage.setItem(STORAGE_KEYS.TAB, tab);
    const params = new URLSearchParams(searchParams);
    if (tab === 'all') params.delete('tab');
    else params.set('tab', tab);
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  // Save state on unmount/tab change only
  useEffect(() => {
    const saveState = () => {
      sessionStorage.setItem(STORAGE_KEYS.SEARCH, searchQuery);
      sessionStorage.setItem(STORAGE_KEYS.SCROLL, String(window.scrollY));
    };
    window.addEventListener('beforeunload', saveState);
    return () => {
      saveState();
      window.removeEventListener('beforeunload', saveState);
    };
  }, [searchQuery]);

  // Restore scroll on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const s = sessionStorage.getItem(STORAGE_KEYS.SCROLL);
      if (s) requestAnimationFrame(() => window.scrollTo(0, +s));
    }
  }, []);

  // Debounce search untuk performance
  const debouncedSearch = useDebounce(searchQuery, 150);
  const { isOnline } = useNetworkStatus();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearchClear = useCallback(() => setSearchQuery(''), []);

  // Quick initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    // Get items based on active tab
    let items = activeTab === 'all' ? getAllItems() :
                activeTab === 'tools' ? getTools() :
                activeTab === 'apps' ? getTsxApps() :
                getHtmlApps();

    // Apply search filter with debounced query
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return items;
  }, [activeTab, debouncedSearch]);

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-3 py-1.5 text-center">
          <span className="text-amber-400 text-xs flex items-center justify-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            Offline - Semua tetap berfungsi
          </span>
        </div>
      )}

      <Hero />

      {/* Search & Tabs */}
      <div className="px-3 sm:px-4 md:px-6 mb-3 sm:mb-4 sticky top-[45px] sm:top-[52px] z-40 bg-background/98 backdrop-blur-lg py-2 sm:py-2.5 border-b border-border/30">
        <div className="max-w-4xl mx-auto space-y-2 sm:space-y-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Cari tools, apps..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-secondary/50 border border-border rounded-lg pl-8 sm:pl-10 pr-8 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            {searchQuery && (
              <button
                onClick={handleSearchClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-3 px-3 sm:mx-0 sm:px-0 sm:justify-center scrollbar-hide">
            {TABS.map((tab) => {
              const count = tab.id === 'all' ? stats.total :
                           tab.id === 'tools' ? stats.tools :
                           tab.id === 'apps' ? stats.tsxApps :
                           stats.htmlApps;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <span className="hidden xs:inline">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <section className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
          <div className="max-w-6xl mx-auto">
            <GridSkeleton count={isMobile ? 4 : 8} />
          </div>
        </section>
      ) : (
        <UnifiedGrid
          items={filteredItems}
          emptyMessage="Tidak ada item yang cocok dengan pencarian."
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-3 sm:py-4 px-3 sm:px-4 text-center text-[10px] sm:text-xs text-muted-foreground">
        <p>Made with ❤️ — 100% lokal & privat</p>
        <p className="mt-1">
          <span className="text-primary font-medium">{stats.total}</span> items
        </p>
      </footer>
    </div>
  );
};

export default Index;
