"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Region } from "@/types/regions";
import { regionSchema, CreateRegionSchema } from "../schemas/region-schema";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import { createRegion, updateRegion } from "@/services/regions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import RHFMultiCountrySelect from "@/components/react-hook-form/rhf-multi-country-select";


interface RegionModalProps {
  open: boolean;
  onClose: () => void;
  region?: Region;
  isDetailsView?: boolean;
  loading: boolean;
  onSuccess?: (data?: Region) => void;
}

export default function RegionModal({
  open,
  onClose,
  region,
  isDetailsView = false,
  loading,
  onSuccess,
}: RegionModalProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const methods = useForm<CreateRegionSchema>({
    resolver: zodResolver(regionSchema) ,
    defaultValues: {
       code: region?.code || "",
      name: region?.name || "",
      description: region?.description || "",
      status: region?.status === "deleted" ? "inactive" : region?.status || "active",
      countryIds: region?.countries?.map(c => c.id) || [],      
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: any) => {
    setError(null);
    console.log(data)
    try {
      let response;
      if (region) {
        response = await updateRegion(region.id, data);
        if (!response.error) {
          queryClient.invalidateQueries({ queryKey: ["regions"] });
          onSuccess?.(response.data ?? undefined);
          toast.success("Región actualizada exitosamente");
          handleClose();
        } else {
          if (response.status === 400) {
            toast.error("Ya existe una región con ese código");
          } else {
            toast.error(response.message || "No se pudo actualizar la región");
          }
        }
      } else {
        response = await createRegion(data);
        if (!response.error) {
          queryClient.invalidateQueries({ queryKey: ["regions"] });
          onSuccess?.(response.data ?? undefined);
          toast.success("Región creada exitosamente");
          handleClose();
        } else {
          if (response.status === 400) {
            toast.error("Ya existe una región con ese código");
          } else {
            toast.error(response.message || "No se pudo crear la región");
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la región";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const statusOptions = [
    { value: "active", label: "Activa" },
    { value: "inactive", label: "Inactiva" },
  ];

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={region ? "Editar Región" : "Crear Región"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Primera fila: Código y Nombre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estado */}
              <RHFSelectWithLabel
                name="status"
                options={statusOptions}
                label="Estado"
                placeholder="Selecciona el estado"
                required
                disabled={isDetailsView}
              />
              <RHFInputWithLabel
                name="code"
                label="Código"
                placeholder="Ej: LATAM"
                required
                disabled={isDetailsView}
                className="uppercase"
              />
              <RHFInputWithLabel
                name="name"
                label="Nombre"
                placeholder="Nombre de la región"
                required
                disabled={isDetailsView}
              />
            </div>

            {/* Descripción */}
            <RHFInputWithLabel
              name="description"
              label="Descripción"
              placeholder="Describe la región"
              type="textarea"
              rows={3}
              disabled={isDetailsView}
            />

            {/* Países asociados */}
            <RHFMultiCountrySelect
              name="countryIds"
              label="Países asociados"
              placeholder="Selecciona los países de esta región"
              disabled={isDetailsView}
            />
            {/* Botones */}
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
                disabled={isSubmitting}
              >
                {region ? "Guardar Cambios" : "Crear Región"}
              </LoaderButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
