"use client";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-border rounded" />
      <div className="h-4 w-64 bg-border rounded" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-border rounded-xl" />
        ))}
      </div>
      <div className="h-10 w-80 bg-border rounded" />
      <div className="h-96 bg-border rounded-xl" />
    </div>
  );
}
