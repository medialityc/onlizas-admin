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

// New modular components
import { SelectedSummary } from "./partial-closure/SelectedSummary";
import { TabsBar } from "./partial-closure/TabsBar";
import { DatosTab } from "./partial-closure/DatosTab";
import { ProveedoresTab } from "./partial-closure/ProveedoresTab";
import { SelectedAccount, Supplier } from "./partial-closure/types";

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
  const computeSupplierAmount = (supplier: Supplier) => {
    const supplierSelections = selectedAccounts.filter(
      (a) => a.supplierId === supplier.userId
    );
    return supplierSelections.reduce((sum, sel) => {
      const acc = supplier.accounts?.find((x) => x.accountId === sel.accountId);
      return sum + (acc?.totalAmount ?? 0);
    }, 0);
  };

  const computeTotalAmount = () => {
    return selectedAccounts.reduce((sum, sel) => {
      const supplier = suppliers?.find(
        (s: Supplier) => s.userId === sel.supplierId
      );
      const acc = supplier?.accounts?.find(
        (x) => x.accountId === sel.accountId
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
        supplierId: sa.supplierId ?? "",
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
      className="w-[980px] max-w-[95vw] max-h-[85vh]"
    >
      <FormProvider {...methods}>
        <div className="flex flex-col gap-4">
          <SelectedSummary
            selectedAccounts={selectedAccounts || []}
            computeTotalAmount={computeTotalAmount}
            onClear={() => {
              methods.setValue("selectedAccounts", [], { shouldDirty: true });
            }}
            onGoSuppliers={() => setActiveTab("proveedores")}
          />

          <TabsBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            submitting={submitting}
            canSubmit={!!selectedAccounts && selectedAccounts.length > 0}
            onSubmit={onSubmit}
          />

          {activeTab === "datos" && (
            <DatosTab
              fromDate={fromDate}
              toDate={toDate}
              onContinue={() => setActiveTab("proveedores")}
            />
          )}

          {activeTab === "proveedores" && (
            <ProveedoresTab
              suppliers={(suppliers as Supplier[]) || []}
              onFetch={(params) => getSuppliersWithPendingAccounts(params)}
              selectedAccounts={selectedAccounts || []}
              toggleAccount={toggleAccount}
              computeSupplierAmount={computeSupplierAmount}
            />
          )}
        </div>
      </FormProvider>
    </SimpleModal>
  );
}
