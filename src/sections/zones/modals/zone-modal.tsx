"use client";

import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import LoaderButton from "@/components/loaders/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { ZoneSchema, ZoneInput } from "../schemas/zone";
import { createZone, updateZone } from "@/services/zones";
import { getDistrictsByCountry } from "@/services/districts";
import { getCountries } from "@/services/countries";
import { Zone, District } from "@/types/zones";
import { toast } from "react-toastify";
import { IQueryable } from "@/types/fetch/request";
import { ApiResponse } from "@/types/fetch/api";
import { GetDistricts } from "@/types/zones";

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
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  const methods = useForm<ZoneInput>({
    resolver: zodResolver(ZoneSchema),
    defaultValues: {
      name: zone?.name || "",
      deliveryAmount: zone?.deliveryAmount || 0,
      districtsIds: zone?.districtsIds || [],
    },
  });

  const {
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // Fetch countries for the filter
  const { data: countriesData, isLoading: countriesLoading, refetch } = useQuery({
    queryKey: ["countries-zone-modal", open],
    queryFn: async () => {
      const res = await getCountries();
      if (res.error) throw new Error(res.message);
      const countries = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      return countries;
    },
    enabled: open,
    staleTime: 0,
    gcTime: 0,
  });

  // Forzar refetch cuando se abre el modal
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const countryOptions = (countriesData || []).map((c) => ({
    value: c.id.toString(),
    label: c.name,
  }));

  // Memoize extraFilters to avoid unnecessary re-renders
  const districtFilters = useMemo(() => {
    return selectedCountryId ? { countryId: selectedCountryId } : {};
  }, [selectedCountryId]);

  // Limpiar distritos cuando cambia el país
  const handleCountryChange = (value: string | null) => {
    setSelectedCountryId(value);
    setValue("districtsIds", []); // Limpiar distritos seleccionados
  };

  // Función wrapper para obtener distritos con el countryId
  const fetchDistricts = useCallback(
    async (params: IQueryable): Promise<ApiResponse<GetDistricts>> => {
      if (!selectedCountryId) {
        return {
          data: { data: [], totalCount: 0, page: 1, pageSize: 35, hasNext: false, hasPrevious: false },
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
    setSelectedCountryId(null);
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
      reset({
        name: zone.name,
        deliveryAmount: zone.deliveryAmount,
        districtsIds: zone.districtsIds,
      });
    }
    if (!open && !zone) {
      reset({
        name: "",
        deliveryAmount: 0,
        districtsIds: [],
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
            <Select
              label="País"
              placeholder={countriesLoading ? "Cargando..." : "Seleccione un país para filtrar distritos"}
              data={countryOptions}
              value={selectedCountryId}
              onChange={handleCountryChange}
              searchable
              clearable
              disabled={countriesLoading}
              classNames={{
                input: "form-input",
                label: "text-sm font-semibold text-gray-900 dark:text-gray-300",
              }}
            />
            <RHFAutocompleteFetcherInfinity<District>
              key={`districts-${selectedCountryId || "none"}`}
              name="districtsIds"
              label="Distritos"
              placeholder={selectedCountryId ? "Buscar distritos" : "Seleccione un país primero"}
              onFetch={fetchDistricts}
              multiple
              required
              objectValueKey="id"
              objectKeyLabel="name"
              queryKey="no-cache"
              extraFilters={districtFilters}
              enabled={open && !!selectedCountryId}
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
