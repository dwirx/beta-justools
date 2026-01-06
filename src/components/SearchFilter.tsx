import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { categories, Category } from '@/lib/toolRegistry';

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
      className="px-4 sm:px-6 mb-6 sm:mb-8"
    >
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input pl-10 sm:pl-12 text-sm sm:text-base py-2.5 sm:py-3"
          />
        </div>

        {/* Category filters - Scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center scrollbar-hide">
          <button
            onClick={() => onCategoryChange('all')}
            className={`filter-button whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 ${activeCategory === 'all' ? 'active' : ''}`}
          >
            🌐 All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`filter-button whitespace-nowrap text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.icon} <span className="hidden xs:inline sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
