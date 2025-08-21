"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CurrencyFormData, currencySchema } from "./currencies-schema";
import {
  Currency,
  createCurrency,
  updateCurrency,
} from "@/services/currencies";

interface CurrenciesModalProps {
  open: boolean;
  onClose: () => void;
  currency?: Currency; // Opcional si se usa para editar
  loading: boolean;
  onSuccess?: () => void; // Opcional si se usa para editar
}

export default function CurrenciesModal({
  open,
  onClose,
  currency,
  loading,
  onSuccess,
}: CurrenciesModalProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const methods = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      name: currency?.name ?? "",
      codIso: currency?.codIso ?? "",
      symbol: "", // Nuevo campo que no existe en Currency base
      rate: currency?.rate ?? 1,
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: CurrencyFormData) => {
    setError(null);
    let response;
    try {
      if (currency) {
        response = await updateCurrency(currency.id, {
          name: data.name,
          symbol: data.symbol,
          rate: data.rate,
        });
      } else {
        response = await createCurrency(data);
      }

      if (!response.error) {
        queryClient.invalidateQueries({ queryKey: ["currencies"] });
        onSuccess?.();
        reset();
        toast.success(
          currency
            ? "Moneda editada exitosamente"
            : "Moneda creada exitosamente"
        );
        handleClose();
      } else {
        if (response.status === 409) {
          toast.error("Ya existe una moneda con ese código ISO");
        } else {
          toast.error(response.message || "No se pudo procesar la moneda");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la moneda";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={currency ? "Editar Moneda" : "Crear Nueva Moneda"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="space-y-4 w-full">
            {/* Name Input */}
            <RHFInputWithLabel
              name="name"
              label="Nombre de la Moneda"
              placeholder="Ej: Peso Colombiano, Dólar Americano"
              autoFocus
              maxLength={100}
            />

            {/* ISO Code Input */}
            <RHFInputWithLabel
              name="codIso"
              label="Código ISO"
              placeholder="Ej: COP, USD, EUR"
              maxLength={3}
              disabled={!!currency} // No permite editar el código ISO si es edición
            />

            {/* Symbol Input */}
            <RHFInputWithLabel
              name="symbol"
              label="Símbolo"
              placeholder="Ej: $, €, ¥, £"
              maxLength={10}
            />

            {/* Rate Input */}
            <RHFInputWithLabel
              name="rate"
              label="Tasa de Cambio"
              placeholder="Ej: 1.00, 4200.50"
              type="number"
              step="0.01"
              min="0.01"
              max="999999.99"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <LoaderButton
              type="submit"
              loading={isSubmitting}
              className="btn btn-primary"
            >
              {currency ? "Editar" : "Crear"} Moneda
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
