import React from "react";

export default function CategoryListSkeleton() {
  return (
    <ul className="space-y-2 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="flex items-center justify-between p-4 border rounded-md bg-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="w-12 h-6 bg-gray-200 rounded-full" />
        </li>
      ))}
    </ul>
  );
}
