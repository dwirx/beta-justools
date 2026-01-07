import { useState, useMemo, useEffect, useRef, useCallback, memo, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Wrench, Atom, Globe, X, Wifi, WifiOff } from 'lucide-react';
import { Header } from '@/components/Header';
import { UnifiedGrid } from '@/components/UnifiedGrid';
import { GridSkeleton, StatsSkeleton } from '@/components/Skeleton';
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

const Hero = () => {
  const stats = getStats();

  const statItems = [
    { value: stats.tools, label: 'Tools', icon: '🛠️', color: 'text-emerald-400' },
    { value: stats.tsxApps, label: 'React', icon: '⚛️', color: 'text-cyan-400' },
    { value: stats.htmlApps, label: 'HTML', icon: '🌐', color: 'text-orange-400' },
    { value: stats.total, label: 'Total', icon: '📦', color: 'text-primary' },
  ];

  return (
    <section className="relative py-4 sm:py-8 md:py-12 px-3 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="hidden sm:block absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="hidden sm:block absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl sm:text-3xl md:text-5xl font-bold mb-1.5 sm:mb-3">
            <span className="gradient-text">All-in-One</span> Developer Hub
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-3 sm:mb-6 px-1">
            Tools, React Apps, dan HTML Apps — semua siap pakai.
            <span className="hidden sm:inline"><br />100% lokal, privasi terjamin.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-1.5 sm:gap-3"
        >
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className="stat-card py-2.5 sm:py-4"
            >
              <span className="text-base sm:text-2xl">{stat.icon}</span>
              <span className={`text-lg sm:text-2xl md:text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

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
  const setActiveTab = (tab: SectionId | 'all') => {
    setActiveTabState(tab);
    sessionStorage.setItem(STORAGE_KEYS.TAB, tab);
    
    // Update URL
    if (tab === 'all') {
      searchParams.delete('tab');
    } else {
      searchParams.set('tab', tab);
    }
    setSearchParams(searchParams, { replace: true });
  };

  // Save search query to storage
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.SEARCH, searchQuery);
  }, [searchQuery]);

  // Restore scroll position on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const savedScroll = sessionStorage.getItem(STORAGE_KEYS.SCROLL);
      if (savedScroll) {
        // Small delay to ensure DOM is ready
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        });
      }
    }
  }, []);

  // Save scroll position before leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(STORAGE_KEYS.SCROLL, window.scrollY.toString());
    };

    const handleScroll = () => {
      sessionStorage.setItem(STORAGE_KEYS.SCROLL, window.scrollY.toString());
    };

    // Throttled scroll save
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const throttledScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Debounce search untuk performance
  const debouncedSearch = useDebounce(searchQuery, 150);
  const { isOnline } = useNetworkStatus();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial load (will be instant after first render)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
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
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center"
          >
            <span className="text-amber-400 text-sm flex items-center justify-center gap-2">
              <WifiOff className="w-4 h-4" />
              Offline Mode - Semua masih berfungsi
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <Hero />

      {/* Search & Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-3 sm:px-6 mb-4 sm:mb-6 sticky top-[52px] sm:top-[64px] z-40 bg-background/95 backdrop-blur-xl py-3 -mt-1 border-b border-border/30"
      >
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari tools, apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-9 sm:pl-11 text-sm py-2 sm:py-3 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {/* Search Loading indicator */}
            {searchQuery !== debouncedSearch && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:justify-center scrollbar-hide snap-x snap-mandatory">
            {TABS.map((tab) => {
              const count = tab.id === 'all' ? stats.total :
                           tab.id === 'tools' ? stats.tools :
                           tab.id === 'apps' ? stats.tsxApps :
                           stats.htmlApps;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`filter-button whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2 flex items-center gap-1 sm:gap-1.5 snap-start min-w-fit active:scale-95 transition-all ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                >
                  <span className="sm:hidden">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.icon}</span>
                  <span>{tab.id === 'apps' ? <span className="sm:hidden">React</span> : null}{tab.id === 'apps' ? <span className="hidden sm:inline">{tab.label}</span> : tab.label}</span>
                  <span className="text-[10px] opacity-60 tabular-nums">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <section className="px-3 sm:px-6 pb-6 sm:pb-12">
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
      <footer className="border-t border-border/50 py-4 sm:py-8 px-4 sm:px-6 safe-bottom">
        <div className="max-w-6xl mx-auto text-center text-xs sm:text-sm text-muted-foreground">
          <p className="hidden sm:block">Made with ❤️ — Semua berjalan lokal di browser. Tidak ada data yang dikirim ke server.</p>
          <p className="sm:hidden">Made with ❤️ — 100% lokal & privat</p>
          <p className="mt-1.5 sm:mt-2">
            <span className="text-primary font-medium">{stats.total}</span> items
            <span className="hidden sm:inline"> ({stats.tools} tools, {stats.tsxApps} react apps, {stats.htmlApps} html apps)</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
