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
import { createRegion, updateRegion, getRegionById } from "@/services/regions";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import RHFMultiCountrySelect from "@/components/react-hook-form/rhf-multi-country-select";
import RHFSwitch from "@/components/react-hook-form/rhf-switch";
import { useRegionDetails } from "../hooks/use-region-details";
import { usePermissions } from "zas-sso-client";

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
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const queryClient = useQueryClient();

  // Control de permisos
  const { data: permissions = [], isLoading: permissionsLoading } =
    usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };

  // Obtener los datos completos de la región cuando se está editando
  const { data: regionData, isLoading: isLoadingRegion } = useRegionDetails(
    region?.id,
    open && !!region?.id && !isDetailsView
  );

  // Usar los datos completos si están disponibles, sino usar los datos básicos
  const fullRegion = regionData?.data || region;

  // Permisos específicos (después de definir fullRegion)
  const hasCreate = hasPermission(["Create"]);
  const hasUpdate = hasPermission(["Update"]);
  const canEdit = fullRegion ? hasUpdate : hasCreate;

  const methods = useForm<CreateRegionSchema>({
    resolver: zodResolver(regionSchema) as Resolver<CreateRegionSchema>,
    defaultValues: {
      code: fullRegion?.code || "",
      name: fullRegion?.name || "",
      description: fullRegion?.description || "",
      status: fullRegion?.status === 1 ? false : true, // 1 = inactive, 0 = active
      countryIds: fullRegion?.countries?.map((c) => c.id) || [],
      moveCountries: false,
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
    try {
      // Convertir el valor booleano del status a numérico para el backend
      const submitData = {
        ...data,
        status: data.status ? 0 : 1, // true = 0 (activo), false = 1 (inactivo)
      };

      let response;
      if (fullRegion) {
        // En edición, no enviar el código
        const { code, ...updateData } = submitData;
        response = await updateRegion(fullRegion.id, updateData);
      } else {
        response = await createRegion(submitData);
      }

      if (!response.error) {
        queryClient.invalidateQueries({ queryKey: ["regions"] });
        onSuccess?.(response.data ?? undefined);
        toast.success(
          fullRegion
            ? "Región actualizada exitosamente"
            : "Región creada exitosamente"
        );
        handleClose();
      } else {
        toast.error(response.message || "Error al procesar la región");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la región";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <SimpleModal
        open={open}
        onClose={handleClose}
        loading={loading || isLoadingRegion || permissionsLoading}
        title={fullRegion ? "Editar Región" : "Crear Región"}
      >
        <div className="p-5">
          {error && (
            <div className="mb-4">
              <div className="alert alert-danger">{error}</div>
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Estado - fila completa */}
              <div className="flex items-center space-x-3">
                <RHFSwitch
                  name="status"
                  label="Estado"
                  disabled={isDetailsView || !canEdit}
                />
              </div>

              {/* Segunda fila: Código y Nombre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RHFInputWithLabel
                  name="code"
                  label="Código"
                  placeholder="Ej: LATAM"
                  required
                  disabled={isDetailsView || !!fullRegion || !canEdit}
                />
                <RHFInputWithLabel
                  name="name"
                  label="Nombre"
                  placeholder="Nombre de la región"
                  required
                  disabled={isDetailsView || !canEdit}
                />
              </div>

              {/* Descripción */}
              <RHFInputWithLabel
                name="description"
                label="Descripción"
                placeholder="Describe la región"
                type="textarea"
                rows={3}
                disabled={isDetailsView || !canEdit}
              />

              {/* Países asociados */}
              <RHFMultiCountrySelect
                name="countryIds"
                label="Países asociados"
                placeholder="Selecciona los países de esta región"
                disabled={isDetailsView || !canEdit}
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
                {!isDetailsView && (
                  <LoaderButton
                    type="submit"
                    loading={isSubmitting || permissionsLoading}
                    className="btn btn-primary"
                    disabled={isSubmitting || permissionsLoading || !canEdit}
                  >
                    {fullRegion ? "Guardar Cambios" : "Crear Región"}
                  </LoaderButton>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </SimpleModal>
    </>
  );
}
