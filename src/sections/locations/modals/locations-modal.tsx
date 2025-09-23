//@ts-nocheck
"use client";

import { ILocation, LocationType } from "@/types/locations";
import SimpleModal from "@/components/modal/modal";
import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LocationFormData, locationSchema } from "./locations-schema";
import GooglePlacesAutocomplete from "@/components/input/google-maps/place-autocomplete";
import { Controller } from "react-hook-form";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { LOCATION_TYPE_OPTIONS } from "../utils/location-type-options";
import { buildNormalizedAddress, extractLocationFields } from "../utils/address-parser";
import { useLocationSubmit } from "../hooks/use-location-submit";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

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
  const { submitLocation } = useLocationSubmit(onSuccess);

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every(perm => permissions.some(p => p.code === perm));
  };
  const hasUpdatePermission = hasPermission(["UPDATE_ALL"]);

  const methods = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name ?? "",
      countryCode: location?.countryCode ?? "",
      state: location?.state ?? "",
      district: location?.district ?? "",
      addressRaw: location?.addressRaw ?? "",
      addressNormalized: location?.addressNormalized ?? "",
      postalCode: location?.postalCode ?? "",
      latitude: location?.latitude ?? 0,
      longitude: location?.longitude ?? 0,
      placeId: location?.placeId ?? "",
      type: location?.type ?? LocationType.WAREHOUSE,
      tags: location?.tags ?? [],
    },
  });

  const {
    reset,
    setValue,
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

    // Extract individual fields for database
    const locationFields = extractLocationFields(addressComponents);
    
    // Build complete normalized address
    const addressNormalized = buildNormalizedAddress(addressComponents);

    // Set form values
    if (!location?.name) setValue('name', place.name || '');
    setValue('countryCode', locationFields.countryCode);
    setValue('state', locationFields.state);
    setValue('district', locationFields.district);
    setValue('addressRaw', place.formatted_address || '');
    setValue('addressNormalized', addressNormalized);
    setValue('postalCode', locationFields.postalCode);
    setValue('latitude', geometry?.location?.lat() || 0);
    setValue('longitude', geometry?.location?.lng() || 0);
    setValue('placeId', place.place_id || '');
  };

  const onSubmit = async (data: LocationFormData) => {
    setError(null);
    try {
      await submitLocation(data, location);
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al procesar la localización";
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
                  name="addressRaw"
                  control={methods.control}
                  render={({ field }) => (
                    <div className="min-w-0">
                      <GooglePlacesAutocomplete
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                        onPlaceSelected={handlePlaceSelected}
                        placeholder="Buscar dirección..."
                        inputClassName="form-input h-12 w-full"
                      />
                    </div>
                  )}
                />
              </div>

              {/* Postal Code */}
              <div className="mb-4">
                <RHFInputWithLabel
                  name="postalCode"
                  label="Código Postal"
                  placeholder="Ej: 11001"
                  maxLength={20}
                />
              </div>

              {/* Grid: country / state / district / type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="col-span-1 min-w-0">
                  <RHFInputWithLabel
                    name="countryCode"
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
                    options={LOCATION_TYPE_OPTIONS}
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
            {hasUpdatePermission &&
            <LoaderButton
              type="submit"
              loading={isSubmitting}
              className="btn btn-primary"
            >
              {location ? "Editar" : "Crear"} Localización
            </LoaderButton>}
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
