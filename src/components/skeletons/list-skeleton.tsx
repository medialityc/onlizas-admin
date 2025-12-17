interface ListSkeletonProps {
  title: string;
  description: string;
  rows?: number;
  buttons?: number;
}

export function ListSkeleton({
  title,
  description,
  rows = 8,
  buttons = 2,
}: ListSkeletonProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-5 flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="h-10 w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="flex gap-2 mt-4 animate-pulse">
              {[...Array(buttons)].map((_, i) => (
                <div
                  key={i}
                  className={`h-10 rounded bg-gray-200 dark:bg-gray-700 ${
                    i === 0 ? "w-48" : "w-32"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {[...Array(rows)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
