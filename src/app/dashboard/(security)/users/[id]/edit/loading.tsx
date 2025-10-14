export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-pulse">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Basic Information */}
            <div className="col-span-full">
              <h2 className="text-base font-semibold leading-7 text-gray-900 mb-6">
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full flex flex-col items-center">
                  {/* Circular profile picture skeleton */}
                  <div className="h-24 w-24 rounded-full bg-gray-200 mb-4"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="sm:col-span-4">
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Roles */}
            <div className="mt-2 col-span-full">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Status */}
            <div className="col-span-full flex flex-col gap-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
              </h2>
              <div className="flex items-center justify-around">
                {/* Bloqueado */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-48 bg-gray-200 rounded mt-1"></div>
                </div>

                {/* Verificado */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-48 bg-gray-200 rounded mt-1"></div>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="col-span-full">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-base font-semibold text-gray-900">
                  <div className="h-6 w-40 bg-gray-200 rounded"></div>
                </h2>
                <div className="h-10 w-48 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,320px)] gap-6">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
