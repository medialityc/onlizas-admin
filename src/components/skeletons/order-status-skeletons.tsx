import React from "react";

export const OrderStatusFormSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-pulse">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Header skeleton */}
            <div className="col-span-full">
              <h2 className="text-base font-semibold leading-7 text-gray-900 mb-6">
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Form fields skeleton */}
            <div className="col-span-full flex flex-col gap-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </h2>
              <div className="flex items-center justify-around">
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-48 bg-gray-200 rounded mt-1"></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-48 bg-gray-200 rounded mt-1"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions skeleton */}
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderStatusDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-pulse">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded"></div>
          </div>
          
          {/* Content */}
          <div className="space-y-6">
            {/* Tabs skeleton */}
            <div className="flex space-x-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-10 w-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
