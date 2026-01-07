import { useRef, useMemo, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Link } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import { UnifiedItem, getTypeBadge } from '@/lib/unifiedRegistry';
import { CardSkeleton } from './Skeleton';

interface VirtualGridProps {
  items: UnifiedItem[];
  emptyMessage?: string;
  isLoading?: boolean;
}

// Memoized Card Component untuk performance
const VirtualCard = memo(({ item }: { item: UnifiedItem }) => {
  const badge = getTypeBadge(item.type);

  return (
    <Link
      to={item.url}
      className="tool-card group flex flex-col h-full p-3 sm:p-5 active:scale-[0.98] transition-transform"
    >
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
    </Link>
  );
});

VirtualCard.displayName = 'VirtualCard';

// Virtual Grid dengan windowing untuk performance
export const VirtualGrid = ({ items, emptyMessage = 'No items found.', isLoading }: VirtualGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate columns based on screen width
  const getColumnCount = () => {
    if (typeof window === 'undefined') return 2;
    if (window.innerWidth >= 1280) return 4; // xl
    if (window.innerWidth >= 1024) return 3; // lg
    return 2; // sm & default
  };

  const columnCount = useMemo(() => getColumnCount(), []);
  
  // Calculate row count
  const rowCount = Math.ceil(items.length / columnCount);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180, // Estimated row height
    overscan: 3, // Render 3 rows above/below visible area
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="px-3 sm:px-6 pb-6 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <section className="px-3 sm:px-6 pb-6 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12 sm:py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground text-sm sm:text-base">{emptyMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  // For small lists (< 20 items), use simple grid (no virtualization needed)
  if (items.length < 20) {
    return (
      <section className="px-3 sm:px-6 pb-6 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
            {items.map((item) => (
              <VirtualCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Virtual scrolling for large lists
  return (
    <section className="px-3 sm:px-6 pb-6 sm:pb-12">
      <div className="max-w-6xl mx-auto">
        <div
          ref={parentRef}
          className="h-[600px] overflow-auto scrollbar-styled"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const startIndex = virtualRow.index * columnCount;
              const rowItems = items.slice(startIndex, startIndex + columnCount);

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 h-full">
                    {rowItems.map((item) => (
                      <VirtualCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualGrid;
