import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';
import { UnifiedItem, getTypeBadge } from '@/lib/unifiedRegistry';

interface UnifiedCardProps {
  item: UnifiedItem;
  index: number;
}

export const UnifiedCard = ({ item, index }: UnifiedCardProps) => {
  const badge = getTypeBadge(item.type);

  const CardContent = () => (
    <>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl sm:text-3xl">{item.icon}</span>
        <div className="flex items-center gap-1">
          {item.featured && (
            <span className="flex items-center gap-0.5 text-[9px] sm:text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5 fill-primary" />
              <span className="hidden sm:inline">Featured</span>
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      <h3 className="text-sm sm:text-lg font-semibold mb-0.5 sm:mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
        {item.name}
      </h3>

      <p className="text-[11px] sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
        {item.description}
      </p>

      <div className="flex items-center justify-between gap-1.5 mt-auto">
        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium ${badge.color}`}>
          {badge.label}
        </span>
        <span className="text-[9px] sm:text-xs text-muted-foreground capitalize truncate max-w-[80px] sm:max-w-none">
          {item.category}
        </span>
      </div>
    </>
  );

  // Semua items sekarang menggunakan Link internal
  // HTML apps sudah punya wrapper dengan header Back & Home
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 + index * 0.015 }}
    >
      <Link
        to={item.url}
        className="tool-card group flex flex-col h-full p-3 sm:p-5 active:scale-[0.98] transition-transform"
      >
        <CardContent />
      </Link>
    </motion.div>
  );
};
