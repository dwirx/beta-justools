import { motion } from 'framer-motion';
import { UnifiedItem } from '@/lib/unifiedRegistry';
import { UnifiedCard } from './UnifiedCard';

interface UnifiedGridProps {
  items: UnifiedItem[];
  title?: string;
  emptyMessage?: string;
}

export const UnifiedGrid = ({ items, title, emptyMessage = 'No items found.' }: UnifiedGridProps) => {
  return (
    <section className="px-3 sm:px-6 pb-6 sm:pb-12">
      <div className="max-w-6xl mx-auto">
        {title && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-3 sm:mb-6"
          >
            <h3 className="text-base sm:text-xl font-semibold">{title}</h3>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {items.length} items
            </span>
          </motion.div>
        )}

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground text-sm sm:text-base">{emptyMessage}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
            {items.map((item, index) => (
              <UnifiedCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
