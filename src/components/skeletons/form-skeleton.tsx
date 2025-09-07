interface FormSkeletonProps {
  title: string;
  description: string;
  sections?: number;
  buttons?: number;
}

export function FormSkeleton({
  title,
  description,
  sections = 5,
  buttons = 2,
}: FormSkeletonProps) {
  return (
    <div className="panel space-y-6">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          {title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 animate-pulse">
        {Array.from({ length: sections }).map((_, i) => (
          <div key={i} className="col-span-1 lg:col-span-2 space-y-2">
            <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-6 mt-6 border-t justify-end animate-pulse">
        {Array.from({ length: buttons }).map((_, i) => (
          <div
            key={i}
            className={`h-10 rounded bg-gray-200 dark:bg-gray-700 ${
              i === 0 ? "w-24" : "w-36"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
