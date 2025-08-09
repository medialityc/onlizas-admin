import SupplierApprovalProcess from "@/sections/suppliers/edit/supplier-approval-process";
import { getApprovalProcess } from "@/services/supplier";
import { CogIcon } from "@heroicons/react/24/solid";
import React, { Suspense } from "react";

async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { data: approvalProcess } = await getApprovalProcess(
    (await params).id.toString()
  );
  return (
    <section
      id="approval"
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 animate-slideUp overflow-hidden"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="px-8 py-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <CogIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Proceso de Aprobación
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Estado y detalles del proceso de aprobación del proveedor.
            </p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <Suspense
          fallback={
            <div className="animate-pulse space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-1/2"></div>
                </div>
              </div>
            </div>
          }
        >
          {approvalProcess && (
            <SupplierApprovalProcess approvalProcess={approvalProcess} />
          )}
        </Suspense>
      </div>
    </section>
  );
}

export default Page;
