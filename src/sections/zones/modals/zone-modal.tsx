"use client";

import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import LoaderButton from "@/components/loaders/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useCallback, useState } from "react";
import { ZoneSchema, ZoneInput } from "../schemas/zone";
import { createZone, updateZone } from "@/services/zones";
import { getDistrictsByCountry } from "@/services/districts";
import { Zone, District } from "@/types/zones";
import { toast } from "react-toastify";
import { IQueryable } from "@/types/fetch/request";
import { ApiResponse } from "@/types/fetch/api";
import { GetDistricts } from "@/types/zones";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";
import { Label } from "@/components/label/label";

interface Props {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  onSuccess?: () => void;
  zone?: Zone | null;
}

export default function ZoneModal({
  open,
  onClose,
  loading = false,
  onSuccess,
  zone,
}: Props) {
  const [preloadedDistricts, setPreloadedDistricts] = useState<District[]>([]);
  
  const methods = useForm<ZoneInput>({
    resolver: zodResolver(ZoneSchema),
    defaultValues: {
      name: zone?.name || "",
      deliveryAmount: zone?.deliveryAmount || 0,
      districtsIds: zone?.districtsIds || [],
      countryId: zone?.countryId || "c1c9c1b7-3757-4294-9591-970fba64c681", // ID de Cuba por defecto
    },
  });

  const {
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const selectedCountryId = methods.watch("countryId");

  // Memoize extraFilters to avoid unnecessary re-renders
  const districtFilters = useMemo(() => {
    return selectedCountryId ? { countryId: selectedCountryId } : {};
  }, [selectedCountryId]);

  // Función wrapper para obtener distritos con el countryId
  const fetchDistricts = useCallback(
    async (params: IQueryable): Promise<ApiResponse<GetDistricts>> => {
      if (!selectedCountryId) {
        return {
          data: {
            data: [],
            totalCount: 0,
            page: 1,
            pageSize: 35,
            hasNext: false,
            hasPrevious: false,
          },
          status: 200,
          error: false,
        };
      }
      return getDistrictsByCountry(selectedCountryId, params);
    },
    [selectedCountryId]
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (data: ZoneInput) => {
    try {
      if (zone) {
        const res = await updateZone(zone.id, data);
        if (!res.error) {
          toast.success("Zona actualizada correctamente");
        } else if (res.message) {
          toast.error(res.message);
          return;
        }
      } else {
        const res = await createZone(data);
        if (!res.error) {
          toast.success("Zona creada correctamente");
        } else if (res.message) {
          toast.error(res.message);
          return;
        }
      }
      onSuccess?.();
      reset();
      onClose();
    } catch {
      toast.error("Error guardando la zona");
    }
  };

  useEffect(() => {
    if (zone && open) {
      // Usar Cuba como fallback si no viene countryId del backend
      const countryIdToUse = zone.countryId || "c1c9c1b7-3757-4294-9591-970fba64c681";
      
      // Cargar los distritos completos para pre-poblar el selector
      const loadDistricts = async () => {
        if (zone.districtsIds && zone.districtsIds.length > 0) {
          try {
            const response = await getDistrictsByCountry(countryIdToUse, {
              page: 1,
              pageSize: 100,
            });
            
            if (response.data?.data) {
              // Filtrar solo los distritos que están en la zona
              const selectedDistricts = response.data.data.filter((d) =>
                zone.districtsIds.includes(d.id)
              );
              setPreloadedDistricts(selectedDistricts);
            }
          } catch (error) {
            console.error("Error cargando distritos para edición:", error);
          }
        }
      };
      
      loadDistricts();
      
      // Usar Cuba como fallback si no viene countryId del backend
      reset({
        name: zone.name,
        deliveryAmount: zone.deliveryAmount,
        districtsIds: zone.districtsIds,
        countryId: zone.countryId || "c1c9c1b7-3757-4294-9591-970fba64c681",
      });
    }
    if (!open && !zone) {
      setPreloadedDistricts([]);
      reset({
        name: "",
        deliveryAmount: 0,
        districtsIds: [],
        countryId: "c1c9c1b7-3757-4294-9591-970fba64c681", // ID de Cuba por defecto
      });
    }
  }, [zone, open, reset]);

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={zone ? "Editar Zona de Entrega" : "Agregar Zona de Entrega"}
    >
      <div className="p-5">
        <FormProvider methods={methods} onSubmit={submit}>
          <div className="space-y-4 w-full">
            <RHFInputWithLabel
              name="name"
              label="Nombre de la zona"
              placeholder="Ej: Zona Norte"
              type="text"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-[13px]">
                País
                <span className="text-red-500"> *</span>
              </label>
              <RHFCountrySelect
                name="countryId"
                variant="name"
                fullwidth
                inputClassname="transition-all focus:ring-2 focus:ring-green-500"
                disabled={!zone}
              />
            </div>
            <RHFAutocompleteFetcherInfinity<District>
              key={`districts-${selectedCountryId || "none"}`}
              name="districtsIds"
              label="Distritos"
              placeholder={
                selectedCountryId
                  ? "Buscar distritos"
                  : "Seleccione un país primero"
              }
              onFetch={fetchDistricts}
              multiple
              required
              objectValueKey="id"
              objectKeyLabel="name"
              queryKey="no-cache"
              extraFilters={districtFilters}
              enabled={open && !!selectedCountryId}
              defaultOptions={preloadedDistricts}
            />
            <RHFInputWithLabel
              name="deliveryAmount"
              label="Costo de Entrega"
              placeholder="Ej: 5.00"
              type="number"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline-secondary"
            >
              Cancelar
            </button>
            <LoaderButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {zone ? "Actualizar" : "Guardar"}
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
