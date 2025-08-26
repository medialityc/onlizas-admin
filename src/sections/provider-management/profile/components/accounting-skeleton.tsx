export const AccountingBusinessSkeleton = () => {
  return (
    <>
      {[...Array(2)].map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="flex items-center gap-2 animate-pulse"
        >
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      ))}
    </>
  );
};
