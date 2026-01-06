import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Search, Gamepad2, Wrench, CheckSquare, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import appRegistry, { getAppCategories, AppCategory, AppMeta, getAppUrl } from '@/lib/appRegistry';

const categoryIcons: Record<AppCategory, React.ReactNode> = {
  Games: <Gamepad2 className="w-4 h-4" />,
  Tools: <Wrench className="w-4 h-4" />,
  Productivity: <CheckSquare className="w-4 h-4" />,
  Education: <BookOpen className="w-4 h-4" />,
  Entertainment: <Sparkles className="w-4 h-4" />,
};

const AppCard = ({ app, index }: { app: AppMeta; index: number }) => (
  <motion.a
    href={getAppUrl(app)}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
  >
    <div className="flex items-start gap-3">
      <div className="text-3xl">{app.icon || '📦'}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
            {categoryIcons[app.category]}
            {app.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {app.type === 'project' ? '📁 Project' : '📄 Single'}
          </span>
        </div>
      </div>
    </div>
  </motion.a>
);

const MyAppsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | AppCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = getAppCategories();
  
  const filteredApps = appRegistry.filter((app) => {
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
              {appRegistry.length} apps
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
            All ({appRegistry.length})
          </button>
          {categories.map((category) => {
            const count = appRegistry.filter(a => a.category === category).length;
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
          className="bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 rounded-xl p-4"
        >
          <h3 className="font-semibold text-foreground mb-2">
            📁 Cara Menambah App Baru
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>1.</strong> Taruh file HTML di{' '}
              <code className="bg-muted px-1 rounded">public/justhtml/</code>
            </p>
            <p>
              <strong>2.</strong> Tambahkan metadata di{' '}
              <code className="bg-muted px-1 rounded">src/lib/appRegistry.ts</code>
            </p>
            <p className="text-primary/80 mt-2">
              ✨ App akan langsung muncul di sini!
            </p>
          </div>
        </motion.div>

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
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
