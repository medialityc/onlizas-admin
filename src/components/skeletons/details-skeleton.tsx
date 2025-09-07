"use client";

interface DetailsSkeletonProps {
  title: string;
  rows?: number;
  rowHeight?: number;
}

export function DetailsSkeleton({
  title,
  rows = 4,
  rowHeight = 16,
}: DetailsSkeletonProps) {
  return (
    <div className="bg-gray-700 rounded-lg  p-6 space-y-4 animate-pulse">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-700 rounded"
            style={{ height: `${rowHeight}px` }}
          />
        ))}
      </div>
    </div>
  );
}
