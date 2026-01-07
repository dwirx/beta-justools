import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-secondary/50',
        className
      )}
    />
  );
};

// Skeleton untuk Card
export const CardSkeleton = () => {
  return (
    <div className="tool-card p-3 sm:p-5 space-y-3">
      {/* Icon & Featured */}
      <div className="flex items-start justify-between">
        <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      
      {/* Title */}
      <Skeleton className="h-5 sm:h-6 w-3/4 rounded" />
      
      {/* Description */}
      <div className="space-y-1.5">
        <Skeleton className="h-3 sm:h-4 w-full rounded" />
        <Skeleton className="h-3 sm:h-4 w-2/3 rounded" />
      </div>
      
      {/* Badge & Category */}
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
    </div>
  );
};

// Grid Skeleton
export const GridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

// Hero Stats Skeleton
export const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="stat-card py-2.5 sm:py-4 space-y-1.5">
          <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 mx-auto rounded" />
          <Skeleton className="h-6 sm:h-8 w-10 mx-auto rounded" />
          <Skeleton className="h-3 w-12 mx-auto rounded" />
        </div>
      ))}
    </div>
  );
};

// Search Skeleton
export const SearchSkeleton = () => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <Skeleton className="h-10 sm:h-12 w-full rounded-xl" />
      <div className="flex gap-1.5 sm:gap-2 justify-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 sm:h-9 w-20 sm:w-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
};

// Full Page Skeleton
export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-4 border-b border-border/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>

      {/* Hero Skeleton */}
      <div className="py-4 sm:py-8 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Skeleton className="h-8 sm:h-12 w-3/4 mx-auto rounded" />
          <Skeleton className="h-4 sm:h-5 w-1/2 mx-auto rounded" />
          <StatsSkeleton />
        </div>
      </div>

      {/* Search & Grid Skeleton */}
      <div className="px-3 sm:px-6">
        <div className="max-w-4xl mx-auto mb-4 sm:mb-6">
          <SearchSkeleton />
        </div>
        <div className="max-w-6xl mx-auto">
          <GridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
