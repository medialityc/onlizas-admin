"use client";
import React from "react";
import SimpleModal from "@/components/modal/modal";
import { useModalState } from "@/hooks/use-modal-state";
import { Form, FormProvider, useForm } from "react-hook-form";
import {
  GeneratePartialClosureInput,
  GeneratePartialClosureSchema,
} from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import RHFDatePicker from "@/components/react-hook-form/rhf-date-picker";
import { RHFInputWithLabel } from "@/components/react-hook-form";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getSuppliersWithPendingAccounts } from "@/services/finance/closures";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";
import { formatDate } from "@/utils/format";
import { createPartialClosureByAccounts } from "@/services/finance/closures";
import showToast from "@/config/toast/toastConfig";

type SelectedAccount = { accountId: string; supplierId: string };
type PartialClosureForm = GeneratePartialClosureInput & {
  selectedAccounts?: SelectedAccount[];
};

export function PartialClosureModal() {
  const { getModalState, closeModal } = useModalState();
  const partialModal = getModalState("partial-closure");
  const methods = useForm<PartialClosureForm>({
    resolver: zodResolver(GeneratePartialClosureSchema),
    defaultValues: {
      // Fechas lógicas por defecto: últimos 15 días
      toDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 15); // fecha fin debe ser hace 15 días
        return d;
      })(),
      fromDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 30); // por defecto igual a fin; usuario puede retroceder más
        return d;
      })(),
      notes: "",
      suppliers: [],
      selectedAccounts: [],
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const fromDate = methods.watch("fromDate");
  const toDate = methods.watch("toDate");
  const suppliers = methods.watch("suppliers");
  const selectedAccounts = methods.watch(
    "selectedAccounts"
  ) as SelectedAccount[];

  const toggleAccount = (supplierId: string, accountId: string) => {
    const current = Array.isArray(selectedAccounts) ? selectedAccounts : [];
    const exists = current.some(
      (a) => a.accountId === accountId && a.supplierId === supplierId
    );
    const next = exists
      ? current.filter(
          (a) => !(a.accountId === accountId && a.supplierId === supplierId)
        )
      : [...current, { supplierId, accountId }];
    methods.setValue("selectedAccounts", next, {
      shouldDirty: true,
      shouldValidate: false,
    });
  };

  const [activeTab, setActiveTab] = React.useState<"datos" | "proveedores">(
    "datos"
  );

  // Utilidades de resumen
  const computeSupplierAmount = (supplier: any) => {
    const supplierSelections = selectedAccounts.filter(
      (a) => a.supplierId === supplier.userId
    );
    return supplierSelections.reduce((sum, sel) => {
      const acc = supplier.accounts?.find(
        (x: any) => x.accountId === sel.accountId
      );
      return sum + (acc?.totalAmount ?? 0);
    }, 0);
  };

  const computeTotalAmount = () => {
    return selectedAccounts.reduce((sum, sel) => {
      const supplier = suppliers?.find((s: any) => s.userId === sel.supplierId);
      const acc = supplier?.accounts?.find(
        (x: any) => x.accountId === sel.accountId
      );
      return sum + (acc?.totalAmount ?? 0);
    }, 0);
  };

  // Submit handler: maps form data to requested payload
  const [submitting, setSubmitting] = React.useState(false);
  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    const values = methods.getValues();
    if (!values.fromDate || !values.toDate) return;
    const payload = {
      periodStartDate: values.fromDate.toISOString(),
      periodEndDate: values.toDate.toISOString(),
      notes: values.notes ?? "",
      suppliers: (values.selectedAccounts ?? []).map((sa) => ({
        supplierId: sa.supplierId,
        accountId: sa.accountId,
      })),
    };
    const res = await createPartialClosureByAccounts(payload);
    if (!res.error) {
      showToast("Cierre parcial creado correctamente", "success");
      closeModal("partial-closure");
      reset();
    } else {
      showToast(res.message ?? "Error al crear el cierre parcial", "error");
      console.error("Partial closure error:", res);
    }
    setSubmitting(false);
  };

  return (
    <SimpleModal
      open={partialModal?.open}
      onClose={() => closeModal("partial-closure")}
      title="Cierre Parcial"
      className="w-[980px] max-w-[95vw]"
    >
      <FormProvider {...methods}>
        <div className="flex flex-col gap-4">
          {/* Sticky resumen superior */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0b1422]/95 backdrop-blur pt-2 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm flex items-center gap-2">
                {Array.isArray(selectedAccounts) &&
                selectedAccounts.length > 0 ? (
                  <>
                    <span className="text-gray-700">Total a pagar</span>
                    <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-1 text-xs">
                      {selectedAccounts.length} cuenta(s)
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">
                    Selecciona cuentas para ver el resumen
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold">
                {Array.isArray(selectedAccounts) && selectedAccounts.length > 0
                  ? computeTotalAmount().toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })
                  : "—"}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs"
                onClick={() => {
                  methods.setValue("selectedAccounts", [], {
                    shouldDirty: true,
                  });
                }}
              >
                Limpiar selección
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs"
                onClick={() => setActiveTab("proveedores")}
              >
                Ir a proveedores
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-2 text-sm ${
                  activeTab === "datos"
                    ? "border-b-2 border-primary font-semibold"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("datos")}
              >
                Datos
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm ${
                  activeTab === "proveedores"
                    ? "border-b-2 border-primary font-semibold"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("proveedores")}
              >
                Proveedores
              </button>
            </div>
            <div className="py-2">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm disabled:opacity-50 inline-flex items-center gap-2"
                disabled={
                  submitting ||
                  !selectedAccounts ||
                  selectedAccounts.length === 0
                }
                onClick={onSubmit}
              >
                {submitting && (
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? "Enviando..." : "Enviar cierre parcial"}
              </button>
            </div>
          </div>

          {activeTab === "datos" && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <RHFDateInput
                  name="fromDate"
                  label="Fecha inicio"
                  // La fecha inicio no puede ser mayor a la fecha fin
                  maxDate={toDate}
                />
                <RHFDateInput
                  name="toDate"
                  label="Fecha fin"
                  // La fecha fin debe ser al menos hace 15 días y no menor que inicio
                  minDate={fromDate}
                  maxDate={(() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 15);
                    return d;
                  })()}
                />
              </div>
              <RHFInputWithLabel name="notes" label="Notas" type="textarea" />
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-primary text-white text-sm hover:bg-primary/90"
                  onClick={() => setActiveTab("proveedores")}
                >
                  Continuar a Proveedores
                </button>
              </div>
            </div>
          )}

          {activeTab === "proveedores" && (
            <div className="flex flex-col gap-4">
              <RHFAutocompleteFetcherInfinity
                onFetch={(params) =>
                  getSuppliersWithPendingAccounts(
                    params
                    // fromDate.toISOString(),
                    // toDate.toISOString()
                  )
                }
                // queryKey={`suppliers-${fromDate.toISOString()}-${toDate.toISOString()}`}
                name="suppliers"
                label="Proveedores"
                returnSelectedObject
                objectKeyLabel="userName"
                multiple
              />

              {Array.isArray(suppliers) && suppliers.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-sm font-semibold mb-2">
                    Cuentas por pagar seleccionables
                  </h3>
                  <div className="space-y-4 max-h-[55vh] overflow-auto pr-2">
                    {suppliers.map((supplier: any) => (
                      <div
                        key={supplier.userId}
                        className="border rounded-lg p-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{supplier.userName}</p>
                            <p className="text-xs text-gray-500">
                              {supplier.email}
                            </p>
                          </div>
                          <div className="text-right text-xs text-gray-600">
                            <div>
                              Cuenta(s) pendientes:{" "}
                              {supplier.totalPendingAccounts}
                            </div>
                            <div>
                              Monto pendiente: {supplier.totalPendingAmount}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-gray-600">
                                <th className="py-1">Seleccionar</th>
                                <th className="py-1">Descripción</th>
                                <th className="py-1">Monto</th>
                                <th className="py-1">Vencimiento</th>
                                <th className="py-1">Subórdenes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {supplier.accounts?.map((acc: any) => {
                                const checked = (selectedAccounts || []).some(
                                  (a) =>
                                    a.accountId === acc.accountId &&
                                    a.supplierId === supplier.userId
                                );
                                return (
                                  <tr
                                    key={acc.accountId}
                                    className="border-t hover:bg-gray-50"
                                  >
                                    <td className="py-1">
                                      <input
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={checked}
                                        onChange={() =>
                                          toggleAccount(
                                            supplier.userId,
                                            acc.accountId
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="py-1">{acc.description}</td>
                                    <td className="py-1">{acc.totalAmount}</td>
                                    <td className="py-1">
                                      {formatDate(acc.dueDate)}
                                    </td>
                                    <td className="py-1">
                                      {acc.subOrdersCount}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Resumen por proveedor dentro de la tarjeta */}
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-gray-700">
                            Subtotal proveedor
                          </span>
                          <span className="font-medium">
                            {computeSupplierAmount(supplier).toLocaleString(
                              undefined,
                              {
                                style: "currency",
                                currency: "USD",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(!suppliers || suppliers.length === 0) && (
                    <div className="text-sm text-gray-500">
                      No hay proveedores en el rango seleccionado.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </FormProvider>
    </SimpleModal>
  );
}
