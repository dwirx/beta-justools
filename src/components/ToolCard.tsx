import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToolMeta, Category } from '@/lib/toolRegistry';
import { Star, ExternalLink } from 'lucide-react';

interface ToolCardProps {
  tool: ToolMeta;
  index: number;
}

const getCategoryClass = (category: Category): string => {
  const classes: Record<Category, string> = {
    converter: 'category-converter',
    developer: 'category-developer',
    text: 'category-text',
    image: 'category-image',
    utility: 'category-utility',
  };
  return classes[category];
};

const getCategoryLabel = (category: Category): string => {
  const labels: Record<Category, string> = {
    converter: 'Converter',
    developer: 'Developer',
    text: 'Text',
    image: 'Image',
    utility: 'Utility',
  };
  return labels[category];
};

export const ToolCard = ({ tool, index }: ToolCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.03 }}
    >
      <Link
        to={`/${tool.id}`}
        className="tool-card group block h-full p-4 sm:p-5"
      >
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <span className="text-2xl sm:text-3xl">{tool.icon}</span>
          <div className="flex items-center gap-1 sm:gap-2">
            {tool.featured && (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs text-primary">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-primary" />
                <span className="hidden sm:inline">Featured</span>
              </span>
            )}
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {tool.name}
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
          {tool.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className={`category-badge text-[10px] sm:text-xs ${getCategoryClass(tool.category)}`}>
            {getCategoryLabel(tool.category)}
          </span>
          <div className="flex gap-1 overflow-hidden">
            {tool.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] sm:text-xs text-muted-foreground truncate">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
