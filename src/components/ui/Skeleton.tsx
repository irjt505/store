import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-border", className)}
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-8 w-32 rounded" />
      </div>
    </div>
  );
}

function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="border-b border-border bg-bg px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 rounded" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="border-b border-border-light last:border-0 px-4 py-3"
        >
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className="h-4 rounded"
                style={{ width: `${50 + Math.random() * 40}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 w-14 rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-7 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <SkeletonStats />
      <SkeletonTable />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStats, SkeletonPage };
