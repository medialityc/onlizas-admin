// @ts-nocheck
"use client";

import { ILocation } from "@/types/locations";
import SimpleModal from "@/components/modal/modal";
import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LocationFormData, locationSchema } from "./locations-schema";
import GooglePlacesAutocomplete from "@/components/input/google-maps/place-autocomplete";
import { Controller } from "react-hook-form";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import RHFSwitch from "@/components/react-hook-form/rhf-switch";
import { createLocation, updateLocation } from "@/services/locations";

interface LocationsModalProps {
  open: boolean;
  onClose: () => void;
  location?: ILocation;
  isDetailsView?: boolean;
  loading: boolean;
  onSuccess?: (data?: ILocation) => void;
}

export default function LocationsModal({
  open,
  onClose,
  location,
  isDetailsView = false,
  loading,
  onSuccess,
}: LocationsModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [typeQuery, setTypeQuery] = useState("");
  const queryClient = useQueryClient();

  const methods = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name ?? "",
      country_code: location?.country_code ?? "",
      state: location?.state ?? "",
      district: location?.district ?? "",
      address_raw: location?.address_raw ?? "",
      latitude: location?.latitude ?? 0,
      longitude: location?.longitude ?? 0,
      place_id: location?.place_id ?? "",
      type: (location?.type as "WAREHOUSE" | "BUSINESS" | "PICKUP" | "HUB" | "OTHER") ?? undefined,
      status: location?.status === "ACTIVE", // true = ACTIVE, false = INACTIVE
  // tags removed from UI; backend will store empty array if not provided
    },
  });

  const {
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

 
  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    const addressComponents = place.address_components || [];
    const geometry = place.geometry;
    console.log(addressComponents)
    console.log(geometry)
console.log(place)

    const getComponent = (type: string) => {
      const component = addressComponents.find((comp) => comp.types.includes(type));
      return component ? component.short_name : '';
    };

    const countryCode = getComponent('country');
    const state = getComponent('administrative_area_level_1');
    const district = getComponent('locality') || getComponent('administrative_area_level_2');

    !location?.name? setValue('name', place.name):location.name;
    setValue('country_code', countryCode);
    setValue('state', state);
    setValue('district', district);
    setValue('address_raw', place.formatted_address || '');
    setValue('latitude', geometry?.location?.lat() || 0);
    setValue('longitude', geometry?.location?.lng() || 0);
    setValue('place_id', place.place_id || '');
  };

  const onSubmit = async (data: LocationFormData) => {
    setError(null);
    try {
      const parsedData = {
        ...data,
        status: data.status ? "ACTIVE" : "INACTIVE", // Convert boolean to string
        tags: [],
      };

      let response;
      
      if (location) {
        // Update existing location
        response = await updateLocation(location.id, parsedData);
      } else {
        // Create new location
        response = await createLocation(parsedData as any);
      }

      if (response.error) {
        toast.error(response.message || 'Error al procesar la localización');
        setError(response.message || 'Error al procesar la localización');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["locations"] });
      onSuccess?.(response.data);
      reset();
      toast.success(
        location
          ? "Localización editada exitosamente"
          : "Localización creada exitosamente"
      );
      handleClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la localización";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={location ? "Editar Localización" : "Crear Localización"}
    >
  <div className="p-5 max-w-full">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="w-full min-w-0">
            {/* Status toggle only in edit mode */}
            {location && (
              <div className="mb-4">
                <RHFSwitch
                  name="status"
                  label="Estado de la ubicación"
                  disabled={isDetailsView}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {watch("status") ? "Activa - Disponible para uso" : "Inactiva - No disponible para nuevas asignaciones"}
                </p>
              </div>
            )}
            {/* Name - full width */}
            <div className="mb-4">
              <RHFInputWithLabel
                name="name"
                label="Nombre de la Localización"
                placeholder="Ej: Bodega Principal"
                autoFocus
                maxLength={120}
              />
            </div>

            {/* Address - full width, more prominent */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Dirección *
              </label>
              <Controller
                name="address_raw"
                control={methods.control}
                render={({ field }) => (
                  <div className="min-w-0">
                    <GooglePlacesAutocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                      onPlaceSelected={handlePlaceSelected}
                      placeholder="Buscar dirección..."
                      value={field.value}
                      onChange={field.onChange}
                      inputClassName="form-input h-12 w-full"
                    />
                  </div>
                )}
              />
            </div>

            {/* Compact grid: country / state / district / type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="col-span-1 min-w-0">
                <RHFInputWithLabel
                  name="country_code"
                  label="País (código)"
                  placeholder="Ej: CO"
                  maxLength={3}
                />
              </div>

              <div className="col-span-1 min-w-0">
                <RHFInputWithLabel
                  name="state"
                  label="Estado / Departamento"
                  placeholder="Ej: Cundinamarca"
                  maxLength={120}
                />
              </div>

              <div className="col-span-1 min-w-0">
                <RHFInputWithLabel
                  name="district"
                  label="Distrito / Ciudad"
                  placeholder="Ej: Bogotá"
                  maxLength={120}
                />
              </div>

              <div className="col-span-1 min-w-0">
                <RHFSelectWithLabel
                  name="type"
                  label="Tipo"
                  placeholder="Seleccionar..."
                  options={[
                    { value: "WAREHOUSE", label: "Almacén" },
                    { value: "BUSINESS", label: "Negocio" },
                    { value: "PICKUP", label: "Punto de recogida" },
                    { value: "HUB", label: "Hub" },
                    { value: "OTHER", label: "Otro" },
                  ]}
                  variant="custom"
                />
              </div>
            </div>
            
            
          </div>

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
            >
              {location ? "Editar" : "Crear"} Localización
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
