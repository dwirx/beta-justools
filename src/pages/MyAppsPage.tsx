import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Search, Gamepad2, Wrench, CheckSquare, BookOpen, Sparkles, Atom, FileCode, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAppRegistry, getAppCategories, AppCategory, AppMeta, getAppUrl, loadTsxAppWithMeta, getTypeLabel, isTsxApp, isProjectApp } from '@/lib/appRegistry';

const categoryIcons: Record<AppCategory, React.ReactNode> = {
  Games: <Gamepad2 className="w-4 h-4" />,
  Tools: <Wrench className="w-4 h-4" />,
  Productivity: <CheckSquare className="w-4 h-4" />,
  Education: <BookOpen className="w-4 h-4" />,
  Entertainment: <Sparkles className="w-4 h-4" />,
  Other: <FolderOpen className="w-4 h-4" />,
};

const TypeBadge = ({ app }: { app: AppMeta }) => {
  const isProject = isProjectApp(app);
  const isTsx = isTsxApp(app);
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
      isTsx 
        ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' 
        : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
    }`}>
      {isTsx ? (
        <Atom className="w-3 h-3" />
      ) : (
        <FileCode className="w-3 h-3" />
      )}
      {getTypeLabel(app.type)}
      {isProject && <Folder className="w-3 h-3 ml-0.5" />}
    </span>
  );
};

const AppCard = ({ app, index }: { app: AppMeta; index: number }) => {
  const url = getAppUrl(app);
  const isTsx = isTsxApp(app);
  
  const CardContent = (
    <div className="flex items-start gap-3">
      <div className="text-3xl">{app.icon || '📦'}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-foreground truncate">{app.name}</h3>
          {app.featured && (
            <span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded">
              Featured
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {app.description}
        </p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
            {categoryIcons[app.category]}
            {app.category}
          </span>
          <TypeBadge app={app} />
        </div>
      </div>
    </div>
  );

  const className = "group bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all block";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
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
  
  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch = 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">My Apps</h1>
            </div>
            <span className="ml-auto text-sm text-muted-foreground">
              {loading ? '...' : `${apps.length} apps`}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
            }`}
          >
            All ({apps.length})
          </button>
          {categories.map((category) => {
            const count = apps.filter(a => a.category === category).length;
            if (count === 0) return null;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                }`}
              >
                {categoryIcons[category]}
                {category} ({count})
              </button>
            );
          })}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-violet-500/10 to-fuchsia-500/10 border border-primary/20 rounded-xl p-4"
        >
          <h3 className="font-semibold text-foreground mb-3">
            🚀 Auto-Detection! Tambah App Tanpa Konfigurasi
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {/* TSX Apps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-cyan-500">
                <Atom className="w-4 h-4" />
                React / TSX
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-cyan-500/20 space-y-2">
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <FileCode className="w-3 h-3" /> Single File
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    src/apps/HelloWorld.tsx
                  </code>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Folder className="w-3 h-3" /> Project Folder
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    src/apps/my-game/index.tsx
                  </code>
                </div>
              </div>
            </div>
            
            {/* HTML Apps */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-orange-500">
                <FileCode className="w-4 h-4" />
                HTML
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-orange-500/20 space-y-2">
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <FileCode className="w-3 h-3" /> Single File
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    public/justhtml/app.html
                  </code>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Folder className="w-3 h-3" /> Project Folder
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded block">
                    public/justhtml/game/index.html
                  </code>
                </div>
              </div>
            </div>
          </div>
          <p className="text-primary/80 text-sm mt-4 flex items-center gap-2">
            <span>✨</span>
            <span>File baru otomatis terdeteksi dan muncul di sini!</span>
          </p>
        </motion.div>

        {/* Apps Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg" />
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map((app, index) => (
              <AppCard key={app.id} app={app} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No apps found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Coba kata kunci lain' : 'Tambahkan app pertamamu'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAppsPage;
