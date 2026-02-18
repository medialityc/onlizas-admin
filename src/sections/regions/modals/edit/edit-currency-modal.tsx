"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleModal from "@/components/modal/modal";
import { Badge } from "@mantine/core";
import { Button } from "@/components/button/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addCurrenciesToRegion } from "@/services/regions";
import { usePermissions } from "@/hooks/use-permissions";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSwitch from "@/components/react-hook-form/rhf-switch";

// Importar schemas y tipos desde el archivo centralizado
import {
  currencySchema,
  CurrencyFormData,
  Currency,
} from "@/sections/regions/schemas/region-modal-schemas";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { CreateCurrency } from "@/types/currencies";

interface EditCurrencyModalProps {
  open: boolean;
  onClose: () => void;
  currency: Currency | null;
  regionId: number | string;
}

export default function EditCurrencyModal({
  open,
  onClose,
  currency,
  regionId,
}: EditCurrencyModalProps) {
  const queryClient = useQueryClient();

  const { hasPermission } = usePermissions();
  const canEdit = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  const methods = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  // Reset form cuando cambia la currency
  useEffect(() => {
    if (currency && open) {
      reset({
        currencyId: currency.id,
        isEnabled: currency.isEnabled,
        rate: currency.rate,
        isPrimary: currency.isPrimary,
      });
    }
  }, [currency, open, reset]);

  // Submit simplificado - envía directamente la data del form
  const onSubmit = async (data: CurrencyFormData) => {
    if (!canEdit) return;

    try {
      const response = await addCurrenciesToRegion(regionId, {
        currencies: [data], // Envía directamente la data sin transformar
      });

      if (!response.error) {
        toast.success("Configuración de moneda actualizada");
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        queryClient.invalidateQueries({
          queryKey: ["region-details", regionId],
        });
        onClose();
      } else {
        toast.error(response.message || "Error al actualizar configuración");
      }
    } catch (error) {
      toast.error("Error al actualizar configuración");
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!currency) return null;

  return (
    <SimpleModal
      title={`Editar ${currency.name}`}
      open={open}
      onClose={handleClose}
      loading={isSubmitting}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Información de la Moneda
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Nombre:
                </span>
                <span className="font-medium">
                  {currency.name} ({currency.code})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Símbolo:
                </span>
                <span className="font-medium">{currency.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Estado:
                </span>
                <div className="flex space-x-2">
                  {currency.isPrimary && (
                    <Badge color="blue" variant="light" size="sm">
                      Principal
                    </Badge>
                  )}
                  <Badge
                    color={currency.isEnabled ? "green" : "gray"}
                    variant="light"
                    size="sm"
                  >
                    {currency.isEnabled ? "Habilitada" : "Deshabilitada"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración editable */}
          <div className="space-y-4">
            {/* Estado de habilitación */}
            <RHFSwitch
              name="isEnabled"
              label="Estado de Habilitación"
              helperText={
                currency.isPrimary
                  ? "La moneda principal no puede ser deshabilitada"
                  : "Habilitar esta moneda en la región"
              }
              disabled={!canEdit || isSubmitting || currency.isPrimary}
            />

            {/* Tasa de cambio */}
            <RHFInputWithLabel
              name="rate"
              type="number"
              label="Tasa de Cambio"
              placeholder="1.000"
              underLabel="Tasa de conversión relativa a la moneda base"
              disabled={!canEdit || isSubmitting}
              minMax={{ min: 0.001, max: 999999 }}
              step={0.001}
              required
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            {canEdit && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            )}
          </div>
        </div>
      </FormProvider>
    </SimpleModal>
  );
}
