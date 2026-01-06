import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { SearchFilter } from '@/components/SearchFilter';
import { ToolsGrid } from '@/components/ToolsGrid';
import { ToolModal } from '@/components/ToolModal';
import { tools, Tool, Category } from '@/data/tools';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <ToolsGrid tools={filteredTools} onToolClick={setSelectedTool} />
      <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            Made with ❤️ — All tools run locally in your browser. No data is sent to any server.
          </p>
          <p className="mt-2">
            Inspired by{' '}
            <a
              href="https://htmls.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              JustHTMLs
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
