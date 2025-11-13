import React from "react";
import { Button } from "@/components/button/button";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { useFormContext } from "react-hook-form";
import { CreateTransferReceptionFormData } from "@/sections/warehouses/schemas/transfer-reception-schema";
import { DISCREPANCY_TYPE_OPTIONS } from "@/types/warehouse-transfer-receptions";

interface Discrepancy {
  id: string;
  productId: string;
  productName: string;
  type: string;
  status: "pending" | "resolved";
  description: string;
  resolution?: string;
  createdAt: string;
}

interface DiscrepancyListProps {
  discrepancies: Discrepancy[];
  resolvedDiscrepancies: Record<string, { resolution: string; resolvedAt: string; quantityAccepted: number }>;
  permanentlyResolvedDiscrepancies: Set<string>;
  onSelectForResolution?: (discrepancyId: string) => void;
  selectedDiscrepancy: string | null;
  onResolveDiscrepancy?: (discrepancyId: string) => void;
  onCancelResolution?: () => void;
  isResolvingAll: boolean;
  canResolve?: boolean;
}

export function DiscrepancyList({
  discrepancies,
  resolvedDiscrepancies,
  permanentlyResolvedDiscrepancies,
  onSelectForResolution,
  selectedDiscrepancy,
  onResolveDiscrepancy,
  onCancelResolution,
  isResolvingAll,
  canResolve = true,
}: DiscrepancyListProps) {
  const { setValue } = useFormContext<CreateTransferReceptionFormData>();

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Discrepancias Detectadas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gestiona las incidencias encontradas durante la recepción
          </p>
        </div>
      </div>

      {discrepancies.length > 0 ? (
        <div className="space-y-4">
          {discrepancies.map((discrepancy) => {
            const isPermanentlyResolved = permanentlyResolvedDiscrepancies.has(discrepancy.id);
            const temporaryResolution = resolvedDiscrepancies[discrepancy.id];
            const isResolved = isPermanentlyResolved || !!temporaryResolution || discrepancy.status === 'resolved';

            return (
              <div
                key={discrepancy.id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-4 border ${
                  isResolved
                    ? "border-green-200 dark:border-green-800"
                    : "border-orange-200 dark:border-orange-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isResolved
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                        }`}
                      >
                        {isResolved ? "Resuelto" : "Pendiente"}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        {DISCREPANCY_TYPE_OPTIONS.find(opt => opt.value === discrepancy.type)?.label || discrepancy.type}
                      </span>
                    </div>

                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {discrepancy.productName}
                    </h4>

                    {discrepancy.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {discrepancy.description}
                      </p>
                    )}

                    {!discrepancy.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 italic">
                        Sin notas adicionales
                      </p>
                    )}

                    {isResolved && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                        <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                          Resolución:
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          {discrepancy.resolution}
                        </p>
                      </div>
                    )}
                  </div>

                  {!isResolved  && canResolve && (
                    <div className="ml-4">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => onSelectForResolution?.(discrepancy.id)}
                      >
                        Resolver
                      </Button>
                    </div>
                  )}
                </div>

                {/* Formulario de resolución inline */}
                {selectedDiscrepancy === discrepancy.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <RHFInputWithLabel
                      name="resolutionNote"
                      type="textarea"
                      label="Nota de Resolución"
                      placeholder="Describe cómo se resolvió la discrepancia..."
                      rows={3}
                      showError={false}
                    />
                    <div className="flex justify-end space-x-3 mt-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onCancelResolution?.();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onResolveDiscrepancy?.(discrepancy.id);
                        }}
                      >
                        Marcar como Resuelta
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            No se han detectado discrepancias
          </p>
        </div>
      )}
    </div>
  );
}