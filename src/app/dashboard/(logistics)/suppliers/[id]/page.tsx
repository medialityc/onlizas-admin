import { Suspense } from "react";
import ApprovalControls from "@/sections/suppliers/edit/approval-controls";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { getSupplierDetails } from "@/services/supplier";
import SupplierEditForm from "@/sections/suppliers/edit/form/supplier-edit-form";
import WithLoginGate from "@/sections/suppliers/edit/login-user/with-login-gate";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { data: supplierDetails } = await getSupplierDetails((await params).id);
  console.log(supplierDetails);

  return (
    <div className="space-y-8">
      {/* Modal: Crear usuario cuando el estado sea WithLogin */}
      <WithLoginGate
        id={supplierDetails?.id.toString() ?? ""}
        supplierState={supplierDetails?.state}
      />
      <section
        id="general"
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 animate-slideUp overflow-hidden"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="px-8 py-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <UserCircleIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Información General
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Edita la información básica de la solicitud.
              </p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <Suspense
            fallback={
              <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4"></div>
                    <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-1/2"></div>
                    <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg"></div>
                  </div>
                </div>
              </div>
            }
          >
            {supplierDetails && (
              <SupplierEditForm supplierDetails={supplierDetails} />
            )}
          </Suspense>
        </div>
      </section>

      {/* Aprobación / Rechazo */}
      {supplierDetails?.state === "Pending" && (
        <section
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 animate-slideUp overflow-hidden"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Proceso de aprobación
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Aprueba o rechaza esta solicitud e incluye comentarios.
            </p>
          </div>
          <div className="p-8">
            <ApprovalControls
              approvalProcessId={supplierDetails.id.toString()}
            />
          </div>
        </section>
      )}
    </div>
  );
}
