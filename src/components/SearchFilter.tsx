import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { categories, Category } from '@/data/tools';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
}

export const SearchFilter = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: SearchFilterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-6 mb-8"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input pl-12"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => onCategoryChange('all')}
            className={`filter-button ${activeCategory === 'all' ? 'active' : ''}`}
          >
            🌐 All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`filter-button ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
