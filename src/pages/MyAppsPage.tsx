import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { apps, appCategories } from '@/data/apps';
import AppCard from '@/components/AppCard';
import { Button } from '@/components/ui/button';

const MyAppsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = apps.filter((app) => {
    const matchesCategory =
      selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add App
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex gap-2 flex-wrap">
            {appCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 rounded-xl p-4 mb-8"
        >
          <h3 className="font-semibold text-foreground mb-2">
            📁 How to add your apps
          </h3>
          <p className="text-sm text-muted-foreground">
            <strong>Single File:</strong> Place your HTML file in{' '}
            <code className="bg-muted px-1 rounded">public/myapps/game.html</code>
            <br />
            <strong>Project:</strong> Create a folder like{' '}
            <code className="bg-muted px-1 rounded">
              public/myapps/tictactoe/index.html
            </code>{' '}
            with your files
          </p>
        </motion.div>

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              Add your first app to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyAppsPage;
