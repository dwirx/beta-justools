import { cn } from '@/lib/utils';
import { memo } from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = memo(({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-muted/50',
        className
      )}
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Skeleton untuk Card - simplified
export const CardSkeleton = memo(() => {
  return (
    <div className="bg-card border border-border rounded-xl p-2.5 sm:p-3 space-y-2">
      <div className="flex items-start justify-between">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <Skeleton className="w-4 h-4 rounded" />
      </div>
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
      <div className="flex items-center justify-between pt-1 border-t border-border/40">
        <Skeleton className="h-4 w-10 rounded-md" />
        <Skeleton className="h-3 w-12 rounded" />
      </div>
    </div>
  );
});

CardSkeleton.displayName = 'CardSkeleton';

// Grid Skeleton
export const GridSkeleton = memo(({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
});

GridSkeleton.displayName = 'GridSkeleton';

// Hero Stats Skeleton
export const StatsSkeleton = memo(() => {
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card/50 border border-border/50 rounded-xl py-2 px-1 text-center space-y-1">
          <Skeleton className="w-5 h-5 mx-auto rounded" />
          <Skeleton className="h-5 w-8 mx-auto rounded" />
          <Skeleton className="h-2.5 w-10 mx-auto rounded" />
        </div>
      ))}
    </div>
  );
});

StatsSkeleton.displayName = 'StatsSkeleton';

// Full Page Skeleton
export const PageSkeleton = memo(() => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-xl" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
        <Skeleton className="w-6 h-6 rounded-lg" />
      </div>

      {/* Content Skeleton */}
      <div className="px-3 sm:px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <GridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
});

PageSkeleton.displayName = 'PageSkeleton';

export default Skeleton;
