export function InventoryListSkeleton() {
  return (
    <div>
      <div className="mb-5">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="flex gap-4 mb-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-48 col-span-1 bg-gray-200 rounded animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}
