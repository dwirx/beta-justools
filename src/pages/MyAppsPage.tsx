import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Search, Gamepad2, Wrench, CheckSquare, BookOpen, Sparkles, Atom, FileCode, Folder, ChevronRight, Star, X, CalendarClock, ArrowUpDown, ListFilter } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAppRegistry, getAppCategories, AppCategory, AppMeta, getAppUrl, loadTsxAppWithMeta, getTypeLabel, isTsxApp, isProjectApp, getAppAddedAtTimestamp } from '@/lib/appRegistry';

const categoryIcons: Record<AppCategory, React.ReactNode> = {
  Games: <Gamepad2 className="w-4 h-4" />,
  Tools: <Wrench className="w-4 h-4" />,
  Productivity: <CheckSquare className="w-4 h-4" />,
  Education: <BookOpen className="w-4 h-4" />,
  Entertainment: <Sparkles className="w-4 h-4" />,
  Other: <FolderOpen className="w-4 h-4" />,
};

type TypeFilter = 'All' | 'TSX' | 'HTML';
type SortBy = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

const formatAddedAt = (addedAt?: string) => {
  if (!addedAt) return null;
  const date = new Date(addedAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const TypeBadge = ({ app }: { app: AppMeta }) => {
  const isProject = isProjectApp(app);
  const isTsx = isTsxApp(app);
  
  return (
    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 font-medium ${
      isTsx 
        ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' 
        : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
    }`}>
      {isTsx ? (
        <Atom className="w-3 h-3" />
      ) : (
        <FileCode className="w-3 h-3" />
      )}
      <span className="hidden sm:inline">{getTypeLabel(app.type)}</span>
      <span className="sm:hidden">{isTsx ? 'TSX' : 'HTML'}</span>
      {isProject && <Folder className="w-3 h-3 ml-0.5" />}
    </span>
  );
};

const AppCard = ({ app, index }: { app: AppMeta; index: number }) => {
  const url = getAppUrl(app);
  const isTsx = isTsxApp(app);
  
  const CardContent = (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 group-hover:from-primary/10 group-hover:to-accent/10 transition-colors flex-shrink-0">
        <span className="text-xl sm:text-2xl">{app.icon || '📦'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">{app.name}</h3>
          {app.featured && (
            <span className="flex items-center gap-0.5 text-[9px] sm:text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5 fill-primary" />
              <span className="hidden sm:inline">Featured</span>
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
          {app.description}
        </p>
        {formatAddedAt(app.addedAt) && (
          <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1.5">
            <CalendarClock className="w-3 h-3" />
            <span>Ditambahkan {formatAddedAt(app.addedAt)}</span>
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 sm:mt-3 flex-wrap">
          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
            {categoryIcons[app.category]}
            <span className="hidden xs:inline">{app.category}</span>
          </span>
          <TypeBadge app={app} />
        </div>
      </div>
      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );

  const className = "group bg-card border border-border rounded-xl p-3 sm:p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all block active:scale-[0.98]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      whileHover={{ y: -2 }}
    >
      {isTsx ? (
        <Link to={url} className={className}>
          {CardContent}
        </Link>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
          {CardContent}
        </a>
      )}
    </motion.div>
  );
};

const MyAppsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | AppCategory>('All');
  const [selectedType, setSelectedType] = useState<TypeFilter>('All');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [apps, setApps] = useState<AppMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      const registry = getAppRegistry();
      
      // Load TSX apps with their metadata
      const loadedApps = await Promise.all(
        registry.map(app => loadTsxAppWithMeta(app))
      );
      
      setApps(loadedApps);
      setLoading(false);
    };
    
    loadApps();
  }, []);

  const categories = getAppCategories();
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const typeFilteredApps = useMemo(() => {
    if (selectedType === 'All') return apps;
    if (selectedType === 'TSX') return apps.filter(isTsxApp);
    return apps.filter((app) => !isTsxApp(app));
  }, [apps, selectedType]);

  const compareByDate = (a: AppMeta, b: AppMeta, newestFirst: boolean) => {
    const aTimestamp = getAppAddedAtTimestamp(a);
    const bTimestamp = getAppAddedAtTimestamp(b);

    if (aTimestamp === null && bTimestamp === null) return a.name.localeCompare(b.name);
    if (aTimestamp === null) return 1;
    if (bTimestamp === null) return -1;
    return newestFirst ? bTimestamp - aTimestamp : aTimestamp - bTimestamp;
  };

  const filteredApps = useMemo(() => {
    const searched = typeFilteredApps.filter((app) => {
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      const matchesSearch =
        !normalizedQuery ||
        app.name.toLowerCase().includes(normalizedQuery) ||
        app.description.toLowerCase().includes(normalizedQuery) ||
        app.category.toLowerCase().includes(normalizedQuery) ||
        app.type.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });

    return searched.sort((a, b) => {
      if (sortBy === 'newest') return compareByDate(a, b, true);
      if (sortBy === 'oldest') return compareByDate(a, b, false);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });
  }, [normalizedQuery, selectedCategory, sortBy, typeFilteredApps]);

  const appsWithDate = useMemo(() => {
    return apps
      .map((app) => ({ app, timestamp: getAppAddedAtTimestamp(app) }))
      .filter((item): item is { app: AppMeta; timestamp: number } => item.timestamp !== null)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [apps]);

  const oldestApp = appsWithDate[0]?.app;
  const newestApp = appsWithDate[appsWithDate.length - 1]?.app;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h1 className="text-lg sm:text-xl font-bold text-foreground">My Apps</h1>
            </div>
            <span className="ml-auto text-xs sm:text-sm text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 rounded-full">
              {loading ? '...' : `${filteredApps.length}/${apps.length} apps`}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-11 pr-9 py-2.5 sm:py-3 bg-card border border-border rounded-xl text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Sort and Type Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div className="relative">
            <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value as TypeFilter)}
              className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="All">Semua tipe</option>
              <option value="TSX">React / TSX</option>
              <option value="HTML">HTML</option>
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortBy)}
              className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="newest">Urutkan: Terbaru</option>
              <option value="oldest">Urutkan: Terlama</option>
              <option value="name-asc">Urutkan: Nama A-Z</option>
              <option value="name-desc">Urutkan: Nama Z-A</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide snap-x snap-mandatory">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all snap-start active:scale-95 ${
              selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
            }`}
          >
            All ({typeFilteredApps.length})
          </button>
          {categories.map((category) => {
            const count = typeFilteredApps.filter(a => a.category === category).length;
            if (count === 0) return null;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2 snap-start active:scale-95 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                }`}
              >
                {categoryIcons[category]}
                <span className="hidden xs:inline">{category}</span>
                <span className="xs:hidden">{category.slice(0, 4)}</span>
                ({count})
              </button>
            );
          })}
        </div>

        {appsWithDate.length > 0 && (
          <div className="text-xs sm:text-sm bg-muted/40 border border-border rounded-xl px-3 py-2 text-muted-foreground">
            Contoh:
            {' '}
            terbaru <span className="text-foreground font-medium">{newestApp?.name}</span>
            {' '}
            ({formatAddedAt(newestApp?.addedAt)})
            {' '}
            • terlama <span className="text-foreground font-medium">{oldestApp?.name}</span>
            {' '}
            ({formatAddedAt(oldestApp?.addedAt)})
          </div>
        )}

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-violet-500/10 to-fuchsia-500/10 border border-primary/20 rounded-xl p-3 sm:p-4"
        >
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2 sm:mb-3">
            🚀 Auto-Detection! Tambah App Tanpa Konfigurasi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            {/* TSX Apps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-cyan-500 text-xs sm:text-sm">
                <Atom className="w-4 h-4" />
                React / TSX
              </div>
              <div className="bg-background/50 rounded-lg p-2 sm:p-3 border border-cyan-500/20 space-y-1.5 sm:space-y-2">
                <div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
                    <FileCode className="w-3 h-3" /> Single File
                  </div>
                  <code className="text-[10px] sm:text-xs bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded block truncate">
                    src/apps/HelloWorld.tsx
                  </code>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
                    <Folder className="w-3 h-3" /> Project Folder
                  </div>
                  <code className="text-[10px] sm:text-xs bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded block truncate">
                    src/apps/my-game/index.tsx
                  </code>
                </div>
              </div>
            </div>
            
            {/* HTML Apps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-orange-500 text-xs sm:text-sm">
                <FileCode className="w-4 h-4" />
                HTML
              </div>
              <div className="bg-background/50 rounded-lg p-2 sm:p-3 border border-orange-500/20 space-y-1.5 sm:space-y-2">
                <div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
                    <FileCode className="w-3 h-3" /> Single File
                  </div>
                  <code className="text-[10px] sm:text-xs bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded block truncate">
                    public/justhtml/app.html
                  </code>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground mb-1">
                    <Folder className="w-3 h-3" /> Project Folder
                  </div>
                  <code className="text-[10px] sm:text-xs bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded block truncate">
                    public/justhtml/game/index.html
                  </code>
                </div>
              </div>
            </div>
          </div>
          <p className="text-primary/80 text-xs sm:text-sm mt-3 sm:mt-4 flex items-center gap-2">
            <span>✨</span>
            <span>File baru otomatis terdeteksi dan muncul di sini!</span>
          </p>
        </motion.div>

        {/* Apps Grid */}
        {loading ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card border border-border rounded-xl p-3 sm:p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredApps.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map((app, index) => (
              <AppCard key={app.id} app={app} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-muted/30 flex items-center justify-center">
              <FolderOpen className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              No apps found
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'Coba kata kunci lain' : 'Tambahkan app pertamamu'}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MyAppsPage;
