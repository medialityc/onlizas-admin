"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import RHFInput from "@/components/react-hook-form/rhf-input";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSystemConfigurationSchema,
  createSystemConfigurationSchema,
  defaultSystemConfigurationForm,
} from "../create/system-configuration-schemas";
import { createSystemConfiguration } from "@/services/system-configuration";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";
import { Label } from "@/components/label/label";
import { CreateSystemConfigurationDto } from "@/types/system-configuration";

interface SystemConfigurationCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SystemConfigurationCreateModal({
  open,
  onClose,
  onSuccess,
}: SystemConfigurationCreateModalProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const methods = useForm<CreateSystemConfigurationSchema>({
    resolver: zodResolver(createSystemConfigurationSchema),
    defaultValues: defaultSystemConfigurationForm,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: CreateSystemConfigurationSchema) => {
    setError(null);
    try {
      const bodyData: CreateSystemConfigurationDto = {
        additionalSettings: data.additionalSettings,
        configurationType: data.configurationType,
        countryId: data.countryId,
      };
      const response = await createSystemConfiguration(bodyData);
      if (response.error) {
        toast.error(response.message || "Error al crear la configuración");
      } else {
        queryClient.invalidateQueries({ queryKey: ["system-configurations"] });
        onSuccess?.();
        reset();
        toast.success("Configuración creada exitosamente");
        handleClose();
      }
    } catch (err) {
      console.error("Error creating configuration:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear la configuración";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      title="Crear Configuración del Sistema"
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <RHFInput
                name="configurationType"
                label="Tipo de Configuración"
                placeholder="Ej: TAX_RULES"
                required
              />
            </div>
            <div className="grid grid-cols-1  gap-4">
              <Label htmlFor="countryId">País *</Label>
              <RHFCountrySelect name="countryId" variant="name" fullwidth />
            </div>
            <div className="grid grid-cols-1  gap-4">
              <RHFInput
                name="additionalSettings"
                label="Ajustes Adicionales"
                placeholder="JSON u otro formato"
                type="textarea"
                className="h-24"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
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
                className="btn btn-primary "
              >
                Crear Configuración
              </LoaderButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
