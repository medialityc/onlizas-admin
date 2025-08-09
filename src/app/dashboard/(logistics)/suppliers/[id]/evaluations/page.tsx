import { buildQueryParams } from "@/lib/request";
import SupplierEvaluations from "@/sections/suppliers/edit/supplier-evaluations";
import { getSupplierEvaluations } from "@/services/supplier";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { StarIcon } from "@heroicons/react/24/solid";
import React, { Suspense } from "react";

async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<SearchParams>;
}) {
  const paramsSearch = await searchParams;
  const query: IQueryable = buildQueryParams(paramsSearch);
  const { data } = await getSupplierEvaluations((await params).id, query);

  return (
    <section
      id="evaluations"
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 animate-slideUp overflow-hidden"
      style={{ animationDelay: "0.4s" }}
    >
      <div className="px-8 py-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <StarIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Evaluaciones
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Historial de evaluaciones y calificaciones del proveedor.
            </p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <Suspense
          fallback={
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl"
                  >
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          {data && <SupplierEvaluations evaluationsData={data} />}
        </Suspense>
      </div>
    </section>
  );
}

export default Page;
