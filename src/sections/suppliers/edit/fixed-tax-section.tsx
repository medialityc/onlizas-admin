"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button/button";
import { RHFInputWithLabel, FormProvider } from "@/components/react-hook-form";
import { useForm } from "react-hook-form";
import showToast from "@/config/toast/toastConfig";
import { updateApprovalProcessFixedTax } from "@/services/supplier";

interface FixedTaxFormData {
  fixedTax: number | null;
}

interface FixedTaxSectionProps {
  approvalProcessId: number | string;
  initialFixedTax: number | null;
}

export default function FixedTaxSection({
  approvalProcessId,
  initialFixedTax,
}: FixedTaxSectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const methods = useForm<FixedTaxFormData>({
    defaultValues: {
      fixedTax: initialFixedTax,
    },
  });

  const handleSubmit = async (data: FixedTaxFormData) => {
    const value = data.fixedTax;

    if (value == null || isNaN(value)) {
      showToast("Debe indicar una tasa fija válida", "error");
      return;
    }

    if (value < 0 || value > 100) {
      showToast("La tasa fija debe estar entre 0% y 100%", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await updateApprovalProcessFixedTax(approvalProcessId, value);

      if (res.error) {
        showToast(res.message || "Error al actualizar la tarifa fija", "error");
        return;
      }

      showToast("Tarifa fija actualizada correctamente", "success");
      router.refresh();
    } catch (error) {
      console.error("Error updating fixed tax", error);
      showToast("Error al actualizar la tarifa fija", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="fixed-tax"
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 animate-slideUp overflow-hidden"
      style={{ animationDelay: "0.27s" }}
    >
      <div className="px-8 py-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 border-b border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Tarifa fija
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Define el porcentaje fijo que se aplicará a las ventas de este
          proveedor.
        </p>
      </div>
      <div className="p-8 w-full">
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <RHFInputWithLabel
            name="fixedTax"
            label="Tarifa fija (%)"
            type="number"
            minMax={{ min: 1, max: 100 }}
            placeholder="Ejemplo: 15 para 15%"
            required
          />
          <p className="text-xs text-gray-500">
            Indica el porcentaje fijo que se descontará sobre el valor de las
            ventas.
          </p>
          <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700 mt-4">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="px-6 py-2"
            >
              Guardar cambios
            </Button>
          </div>
        </FormProvider>
      </div>
    </section>
  );
}
