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
} from "../create/system-configuration-schemas";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";
import { Label } from "@/components/label/label";
import {
  SystemConfiguration,
  UpdateSystemConfiguration,
} from "@/types/system-configuration";
import { updateSystemConfiguration } from "@/services/system-configuration";
import { getCountries } from "@/services/countries";
import { Country } from "@/types/countries";
import { ApiResponse } from "@/types/fetch/api";
import { PaginatedResponse } from "@/types/common";

interface SystemConfigurationEditModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  item: SystemConfiguration;
}

export default function SystemConfigurationEditModal({
  open,
  onClose,
  onSuccess,
  item,
}: SystemConfigurationEditModalProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const methods = useForm<CreateSystemConfigurationSchema>({
    resolver: zodResolver(createSystemConfigurationSchema),
    defaultValues: {
      configurationType: item.configurationType,
      additionalSettings: item.additionalSettings,
      countryId: item.countryId,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    // sync defaults when item changes
    reset({
      configurationType: item.configurationType,
      additionalSettings: item.additionalSettings,
      countryId: item.countryId,
    });
  }, [item, reset]);

  const [countriesMap, setCountriesMap] = useState<
    Record<number | string, string>
  >({});
  useEffect(() => {
    // Build a map id -> code to compute countryCode on submit
    getCountries()
      .then((res: ApiResponse<PaginatedResponse<Country>>) => {
        const list = res.data?.data || [];
        const map: Record<number | string, string> = {};
        for (const c of list) map[c.id] = c.code;
        setCountriesMap(map);
      })
      .catch(() => {});
  }, []);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };
  const onSubmit = async (data: CreateSystemConfigurationSchema) => {
    setError(null);
    try {
      const countryCode = countriesMap[data.countryId] ?? item.countryCode;
      const body: UpdateSystemConfiguration = {
        updateData: {
          configurationType: data.configurationType,
          additionalSettings: data.additionalSettings,
          countryId: data.countryId,
          countryCode,
          active: item.active,
        },
      };
      const response = await updateSystemConfiguration(item.id, body);
      if (response.error) {
        toast.error(response.message || "Error al actualizar la configuración");
      } else {
        queryClient.invalidateQueries({ queryKey: ["system-configurations"] });
        onSuccess?.();
        toast.success("Configuración actualizada exitosamente");
        handleClose();
      }
    } catch (err) {
      console.error("Error updating configuration:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al actualizar la configuración";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      title="Editar Configuración del Sistema"
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
            <div className="grid grid-cols-1 gap-4">
              <Label htmlFor="countryId">País *</Label>
              <RHFCountrySelect name="countryId" variant="name" fullwidth />
            </div>
            <div className="grid grid-cols-1 gap-4">
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
                Guardar Cambios
              </LoaderButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
