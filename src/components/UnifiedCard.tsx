import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import { UnifiedItem, getTypeBadge } from '@/lib/unifiedRegistry';

interface UnifiedCardProps {
  item: UnifiedItem;
  index: number;
}

export const UnifiedCard = memo(({ item }: UnifiedCardProps) => {
  const badge = getTypeBadge(item.type);

  return (
    <Link
      to={item.url}
      className="group flex flex-col h-full p-2.5 sm:p-3 md:p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-card/80 transition-colors"
    >
      {/* Top section */}
      <div className="flex items-start justify-between mb-2">
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-muted/50">
          <span className="text-lg sm:text-xl">{item.icon}</span>
        </div>
        <div className="flex items-center gap-1">
          {item.featured && (
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary fill-primary" />
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xs sm:text-sm font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
        {item.name}
      </h3>

      {/* Description */}
      <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed flex-grow">
        {item.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-1 mt-auto pt-2 border-t border-border/40">
        <span className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium ${badge.color}`}>
          {badge.label}
        </span>
        <span className="text-[9px] sm:text-[10px] text-muted-foreground capitalize truncate">
          {item.category}
        </span>
      </div>
    </Link>
  );
});

UnifiedCard.displayName = 'UnifiedCard';
