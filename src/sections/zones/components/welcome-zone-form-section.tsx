"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import LoaderButton from "@/components/loaders/loader-button";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";

import { ZoneSchema, ZoneInput } from "@/sections/zones/schemas/zone";
import { createZone } from "@/services/zones";
import { getDistrictsByCountry } from "@/services/districts";
import { District, GetDistricts } from "@/types/zones";
import { IQueryable } from "@/types/fetch/request";
import { ApiResponse } from "@/types/fetch/api";
import {
  getStatesByCountry,
  getDistrictsByState,
  State,
} from "@/services/countries";

interface WelcomeZoneFormSectionProps {
  afterCreateRedirectTo: string;
}

export function WelcomeZoneFormSection({
  afterCreateRedirectTo,
}: WelcomeZoneFormSectionProps) {
  const router = useRouter();
  const [preloadedDistricts] = useState<District[]>([]);

  const methods = useForm<ZoneInput>({
    resolver: zodResolver(ZoneSchema),
    defaultValues: {
      name: "",
      deliveryAmount: 0,
      districtsIds: [],
      stateIds: [],
      countryId: "c1c9c1b7-3757-4294-9591-970fba64c681",
    },
  });

  const {
    getValues,
    formState: { isSubmitting },
  } = methods;

  const selectedCountryId = methods.watch("countryId");
  const selectedStateIds = methods.watch("stateIds");

  const districtFilters = useMemo(() => {
    return selectedCountryId ? { countryId: selectedCountryId } : {};
  }, [selectedCountryId]);

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

      methods.setValue("districtsIds", uniqueIds, { shouldValidate: true });
      toast.success(
        "Se seleccionaron todos los distritos de los estados elegidos",
      );
    } catch {
      toast.error("Error seleccionando distritos por estado");
    }
  }, [getValues, methods]);

  const submit = async (data: ZoneInput) => {
    try {
      const res = await createZone(data);
      if (!res.error) {
        toast.success("Zona creada correctamente");
        router.push(afterCreateRedirectTo);
      } else if (res.message) {
        toast.error(res.message);
      }
    } catch {
      toast.error("Error guardando la zona");
    }
  };

  return (
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
          queryKey={`welcome-zone-states-${selectedCountryId || "none"}`}
        />
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            Puedes seleccionar distritos individuales o elegir estados y usar la
            acción masiva para incluir todos sus distritos.
          </p>
          <button
            type="button"
            onClick={handleSelectAllDistrictsForStates}
            disabled={!selectedStateIds || selectedStateIds.length === 0}
            className="btn btn-xs btn-outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={!selectedStateIds || selectedStateIds.length === 0}
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
          enabled={!!selectedCountryId}
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
        <LoaderButton
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Guardar zona y continuar
        </LoaderButton>
      </div>
    </FormProvider>
  );
}
