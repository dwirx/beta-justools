import { memo } from 'react';
import { UnifiedItem } from '@/lib/unifiedRegistry';
import { UnifiedCard } from './UnifiedCard';

interface UnifiedGridProps {
  items: UnifiedItem[];
  title?: string;
  emptyMessage?: string;
}

export const UnifiedGrid = memo(({ items, title, emptyMessage = 'No items found.' }: UnifiedGridProps) => {
  return (
    <section className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-8">
      <div className="max-w-6xl mx-auto">
        {title && (
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold">{title}</h3>
            <span className="text-[10px] sm:text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              {items.length} items
            </span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {items.map((item, index) => (
              <UnifiedCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

UnifiedGrid.displayName = 'UnifiedGrid';
