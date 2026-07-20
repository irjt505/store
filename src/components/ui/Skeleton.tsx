import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="جاري التحميل"
      className={cn("animate-shimmer rounded-lg bg-border", className)}
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div
      className="bg-surface rounded-xl border border-border p-6 space-y-4"
      role="status"
      aria-label="جاري تحميل البطاقة"
    >
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
  const widths = [
    [80, 60, 45, 70, 55],
    [55, 75, 60, 40, 80],
    [70, 50, 80, 55, 45],
    [45, 65, 55, 75, 60],
    [80, 40, 70, 65, 50],
  ];

  return (
    <div
      className="bg-surface rounded-xl border border-border overflow-hidden"
      role="status"
      aria-label="جاري تحميل الجدول"
    >
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
                style={{ width: `${widths[rowIdx % widths.length][colIdx % widths[0].length]}%` }}
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
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      role="status"
      aria-label="جاري تحميل الإحصائيات"
    >
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
    <div className="space-y-6" role="status" aria-label="جاري تحميل الصفحة">
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
