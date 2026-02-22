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
import {
  getStatesByCountry,
  getDistrictsByState,
  State,
} from "@/services/countries";

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
      stateIds: [],
      countryId: zone?.countryId, // ID de Cuba por defecto
    },
  });

  const {
    reset,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = methods;
  const selectedCountryId = methods.watch("countryId");
  const selectedStateIds = methods.watch("stateIds");

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
    [selectedCountryId],
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectAllDistrictsForStates = useCallback(async () => {
    const stateIds = getValues("stateIds") || [];

    if (!stateIds.length) return;

    try {
      const allDistricts: District[] = [];

      for (const stateId of stateIds) {
        const res = await getDistrictsByState(String(stateId), {
          page: 1,
          pageSize: 1000,
        });

        if (!res.error && res.data?.data) {
          allDistricts.push(...res.data.data);
        }
      }

      const currentIds = getValues("districtsIds") || [];
      const uniqueIds = Array.from(
        new Set<string>([...currentIds, ...allDistricts.map((d) => d.id)]),
      );

      setValue("districtsIds", uniqueIds, { shouldValidate: true });
      toast.success(
        "Se seleccionaron todos los distritos de los estados elegidos",
      );
    } catch {
      toast.error("Error seleccionando distritos por estado");
    }
  }, [getValues, setValue]);

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
      const countryIdToUse =
        zone.countryId || "c1c9c1b7-3757-4294-9591-970fba64c681";

      const loadAndReset = async () => {
        let districts: District[] = [];

        if (zone.districtsIds?.length > 0) {
          try {
            const response = await getDistrictsByCountry(countryIdToUse, {
              page: 1,
              pageSize: 500,
            });

            if (response.data?.data) {
              districts = response.data.data.filter((d) =>
                zone.districtsIds.includes(d.id),
              );
            }
          } catch (error) {
            console.error("Error cargando distritos para edición:", error);
          }
        }

        setPreloadedDistricts(districts);
        reset({
          name: zone.name,
          deliveryAmount: zone.deliveryAmount,
          districtsIds: zone.districtsIds,
          countryId: countryIdToUse,
        });
      };

      loadAndReset();
    }
    if (!open && !zone) {
      setPreloadedDistricts([]);
      reset({
        name: "",
        deliveryAmount: 0,
        districtsIds: [],
        countryId: "c1c9c1b7-3757-4294-9591-970fba64c681",
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
              />
            </div>
            <RHFAutocompleteFetcherInfinity<State>
              key={`states-${selectedCountryId || "none"}`}
              name="stateIds"
              label="Estados / Provincias"
              placeholder={
                selectedCountryId
                  ? "Selecciona uno o varios estados"
                  : "Seleccione un país primero"
              }
              onFetch={
                selectedCountryId
                  ? (params) =>
                      getStatesByCountry(String(selectedCountryId), {
                        page: params.page as number,
                        pageSize: params.pageSize as number,
                        search: params.search as any,
                      })
                  : undefined
              }
              multiple
              objectValueKey="id"
              objectKeyLabel="name"
              disabled={!selectedCountryId}
              queryKey={`zone-states-${selectedCountryId || "none"}`}
            />
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <p>
                Puedes seleccionar distritos individuales o elegir estados y
                usar la acción masiva para incluir todos sus distritos.
              </p>
              <button
                type="button"
                onClick={handleSelectAllDistrictsForStates}
                disabled={!selectedStateIds || selectedStateIds.length === 0}
                className="btn btn-xs btn-outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                aria-disabled={
                  !selectedStateIds || selectedStateIds.length === 0
                }
              >
                Seleccionar distritos de estados
              </button>
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
              onFetch={
                selectedCountryId
                  ? (params) =>
                      fetchDistricts({ ...params, searchTerm: params.search })
                  : undefined
              }
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
              label="Costo de Entrega (USD)"
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
