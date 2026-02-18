import React, { Suspense } from "react";
import FloatingApprovalButton from "@/components/floating-approval-button";
import ApprovalControls from "@/sections/suppliers/edit/approval-controls";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { getSupplierDetails } from "@/services/supplier";
import SupplierEditForm from "@/sections/suppliers/edit/form/supplier-edit-form";
import ExternalReviewTokenModal from "@/sections/suppliers/edit/external-review/external-review-token-modal";
import FixedTaxSection from "@/sections/suppliers/edit/fixed-tax-section";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const { data: supplierDetails } = await getSupplierDetails(id);
  const showApprovalButton =
    supplierDetails?.state === "Pending" ||
    supplierDetails?.state === "WaitingExtension";

  return (
    <div className="space-y-8">
      <section
        id="general"
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 animate-slideUp overflow-hidden"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="px-8 py-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center">
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

      <div className="grid grid-cols-2 gap-2">
        {/* Información del Negocio asociado */}
        <section
          id="business"
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 animate-slideUp overflow-hidden"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="px-8 py-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Información del Negocio
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Datos del negocio asociado al proveedor (si aplica).
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {supplierDetails?.businessName && supplierDetails?.businessCode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nombre del Negocio
                  </h3>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {supplierDetails.businessName}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Código
                  </h3>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {supplierDetails.businessCode}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Este proveedor no tiene un negocio asociado.
              </div>
            )}
          </div>
        </section>

        {/* Tarifa fija */}
        {supplierDetails && (
          <FixedTaxSection
            approvalProcessId={supplierDetails.id}
            initialFixedTax={supplierDetails.fixedTax ?? null}
          />
        )}
      </div>

      {/* Aprobación / Rechazo */}
      {(supplierDetails?.state === "Pending" ||
        supplierDetails?.state === "WaitingExtension") && (
        <section
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 animate-slideUp overflow-hidden"
          id="approval-controls"
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
              approvalProcessId={supplierDetails.id}
              pendingCategories={supplierDetails.pendingCategories ?? []}
            />
          </div>
        </section>
      )}
      {/* Floating button to jump to approval controls (visible only when applicable) */}
      {showApprovalButton && (
        // Floating button is a client component that performs smooth scroll
        <Suspense>
          {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
          <FloatingApprovalButton />
        </Suspense>
      )}
      <ExternalReviewTokenModal approvalProcessId={id} />
    </div>
  );
}
