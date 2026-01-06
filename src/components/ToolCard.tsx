import { motion } from 'framer-motion';
import { Tool, Category } from '@/data/tools';
import { Star } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  index: number;
  onClick: () => void;
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

export const ToolCard = ({ tool, index, onClick }: ToolCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.03 }}
      className="tool-card group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{tool.icon}</span>
        {tool.featured && (
          <span className="flex items-center gap-1 text-xs text-primary">
            <Star className="w-3 h-3 fill-primary" />
            Featured
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {tool.name}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {tool.description}
      </p>

      <div className="flex items-center justify-between">
        <span className={`category-badge ${getCategoryClass(tool.category)}`}>
          {getCategoryLabel(tool.category)}
        </span>
        <div className="flex gap-1">
          {tool.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
