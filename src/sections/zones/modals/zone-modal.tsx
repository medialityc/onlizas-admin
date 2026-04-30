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
  type?: "provider" | "onlizas";
}

export default function ZoneModal({
  open,
  onClose,
  loading = false,
  onSuccess,
  zone,
  type,
}: Props) {
  const getDistrictsFromZone = useCallback((zoneData: Zone): District[] => {
    if (!zoneData.districtsIds?.length) return [];

    return zoneData.districtsIds.map((id, index) => ({
      id,
      name: zoneData.districtsNames?.[index] || id,
    }));
  }, []);

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
        let page = 1;
        let hasNext = true;

        while (hasNext) {
          const res = await getDistrictsByState(String(stateId), {
            page,
            pageSize: 100,
          });

          if (!res.error && res.data?.data) {
            res.data.data.forEach((p) => allDistricts.push(p));
            hasNext = res.data.hasNext;
            page++;
          } else {
            hasNext = false;
          }
        }
      }

      // Agregar los distritos obtenidos a las opciones precargadas para que
      // el componente autocomplete los muestre como pills seleccionados
      setPreloadedDistricts((prev) => {
        const existingIds = new Set(prev.map((d) => d.id));
        const newDistricts = allDistricts.filter((d) => !existingIds.has(d.id));
        return [...prev, ...newDistricts];
      });

      const currentIds = getValues("districtsIds") || [];
      const uniqueIds = Array.from(
        new Set<string>([...currentIds, ...allDistricts.map((d) => d.id)]),
      );

      setValue("districtsIds", uniqueIds, { shouldValidate: true });
      toast.success(
        `Se seleccionaron ${allDistricts.length} distritos de los estados elegidos`,
      );
    } catch {
      toast.error("Error seleccionando distritos por estado");
    }
  }, [getValues, setValue]);

  const submit = async (data: ZoneInput) => {
    try {
      if (zone) {
        const res = await updateZone(zone.id, {
          ...data,
          isSystemZone: zone.isSystemZone,
        });
        if (!res.error) {
          toast.success("Zona actualizada correctamente");
        } else if (res.message) {
          toast.error(res.message);
          return;
        }
      } else {
        const res = await createZone({
          ...data,
          isSystemZone: type === "onlizas",
        });
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
        let districts = getDistrictsFromZone(zone);

        if (
          zone.districtsIds?.length > 0 &&
          (!zone.districtsNames || zone.districtsNames.length === 0)
        ) {
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
          stateIds: [],
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
        stateIds: [],
        countryId: "c1c9c1b7-3757-4294-9591-970fba64c681",
      });
    }
  }, [zone, open, reset, getDistrictsFromZone]);

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
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-primary/10 bg-primary/[0.03] px-4 py-3 dark:border-primary/20 dark:bg-primary/[0.06]">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                Selecciona uno o varios estados arriba y pulsa el botón para
                incluir automáticamente todos sus distritos.
              </p>
              <button
                type="button"
                onClick={handleSelectAllDistrictsForStates}
                disabled={!selectedStateIds || selectedStateIds.length === 0}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-primary dark:border-primary/40 dark:bg-[#1a1c23] dark:hover:bg-primary dark:hover:text-white dark:disabled:hover:bg-[#1a1c23] dark:disabled:hover:text-primary"
                aria-disabled={
                  !selectedStateIds || selectedStateIds.length === 0
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Seleccionar todos los distritos
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
