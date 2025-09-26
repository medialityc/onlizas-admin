"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleModal from "@/components/modal/modal";
import { Badge } from "@mantine/core";
import { Button } from "@/components/button/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addShippingMethodsToRegion } from "@/services/regions";
import { usePermissions } from "zas-sso-client";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSwitch from "@/components/react-hook-form/rhf-switch";

// Importar schemas y tipos desde el archivo centralizado
import {
  shippingMethodSchema,
  ShippingMethodFormData,
  ShippingMethod,
} from "@/sections/regions/schemas/region-modal-schemas";

interface EditShippingModalProps {
  open: boolean;
  onClose: () => void;
  shippingMethod: ShippingMethod | null;
  regionId: number;
}

export default function EditShippingModal({
  open,
  onClose,
  shippingMethod,
  regionId,
}: EditShippingModalProps) {
  const queryClient = useQueryClient();
  const { data: permissions = [] } = usePermissions();

  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.some((perm) =>
      permissions.some((p: any) => p.code === perm)
    );
  };

  const canEdit = hasPermission(["UPDATE_ALL"]);

  const methods = useForm<ShippingMethodFormData>({
    resolver: zodResolver(shippingMethodSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  // Reset form cuando cambia el shippingMethod
  useEffect(() => {
    if (shippingMethod && open) {
      reset({
        shippingMethodId: shippingMethod.shippingMethodId,
        enabled: shippingMethod.isEnabled, // Mapear isEnabled del backend a enabled del form
        baseCost: shippingMethod.baseCost,
        estimatedDaysMin: shippingMethod.estimatedDaysMin,
        estimatedDaysMax: shippingMethod.estimatedDaysMax,
        maxWeight: shippingMethod.maxWeight || null,
        maxDimensions: shippingMethod.maxDimensions || null,
        carrier: shippingMethod.carrier,
      });
    }
  }, [shippingMethod, open, reset]);

  // Submit simplificado - envía directamente la data del form
  const onSubmit = async (data: ShippingMethodFormData) => {
    if (!canEdit) return;

    try {
      // Transformar los datos para que coincidan con lo que espera el backend
      const payload = {
        shippingMethodId: data.shippingMethodId,
        baseCost: data.baseCost,
        estimatedDaysMin: data.estimatedDaysMin,
        estimatedDaysMax: data.estimatedDaysMax,
        maxWeight: data.maxWeight || undefined,
        maxDimensions: data.maxDimensions || undefined,
        carrier: data.carrier,
        enabled: data.enabled,
      };

      const response = await addShippingMethodsToRegion(regionId, {
        shippingMethods: [payload],
      });

      if (!response.error) {
        toast.success("Configuración de método de envío actualizada");
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        queryClient.invalidateQueries({ queryKey: ["region-details", regionId] });
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

  if (!shippingMethod) return null;

  return (
    <SimpleModal
      title={`Editar ${shippingMethod.name}`}
      open={open}
      onClose={handleClose}
      loading={isSubmitting}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6 space-y-6">
          {/* Información básica */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Información del Método de Envío
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Nombre:
                </span>
                <span className="font-medium">
                  {shippingMethod.name} ({shippingMethod.code})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Estado:
                </span>
                <Badge
                  color={shippingMethod.isEnabled ? "green" : "gray"}
                  variant="light"
                  size="sm"
                >
                  {shippingMethod.isEnabled ? "Habilitado" : "Deshabilitado"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Configuración editable */}
          <div className="space-y-4">
            {/* Estado de habilitación */}
            <RHFSwitch
              name="enabled"
              label="Estado de Habilitación"
              helperText="Habilitar este método de envío en la región"
              disabled={!canEdit || isSubmitting}
            />

            {/* Transportista */}
            <RHFInputWithLabel
              name="carrier"
              type="text"
              label="Transportista"
              placeholder="Nombre del transportista"
              disabled={!canEdit || isSubmitting}
              required
            />

            {/* Costo base */}
            <RHFInputWithLabel
              name="baseCost"
              type="number"
              label="Costo Base"
              placeholder="0.00"
              underLabel="Costo base del envío en la moneda local"
              disabled={!canEdit || isSubmitting}
              minMax={{ min: 0, max: 999999 }}
              required
            />

            {/* Días estimados */}
            <div className="grid grid-cols-2 gap-4">
              <RHFInputWithLabel
                name="estimatedDaysMin"
                type="number"
                label="Días Mínimos"
                placeholder="1"
                disabled={!canEdit || isSubmitting}
                minMax={{ min: 1, max: 365 }}
                required
              />

              <RHFInputWithLabel
                name="estimatedDaysMax"
                type="number"
                label="Días Máximos"
                placeholder="7"
                disabled={!canEdit || isSubmitting}
                minMax={{ min: 1, max: 365 }}
                required
              />
            </div>

            {/* Límites opcionales */}
            <div className="grid grid-cols-2 gap-4">
              <RHFInputWithLabel
                name="maxWeight"
                type="number"
                label="Peso Máximo (kg)"
                placeholder="Sin límite"
                underLabel="Peso máximo permitido en kilogramos"
                disabled={!canEdit || isSubmitting}
                minMax={{ min: 0, max: 99999 }}
              />

              <RHFInputWithLabel
                name="maxDimensions"
                type="number"
                label="Dimensión Máxima (cm)"
                placeholder="Sin límite"
                underLabel="Dimensión máxima permitida en centímetros"
                disabled={!canEdit || isSubmitting}
                minMax={{ min: 0, max: 99999 }}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              outline={true}
              onClick={handleClose}
              disabled={isSubmitting}
            >
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
