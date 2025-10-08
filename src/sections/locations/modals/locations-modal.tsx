"use client";

import { ILocation, LocationType } from "@/types/locations";
import SimpleModal from "@/components/modal/modal";
import LoaderButton from "@/components/loaders/loader-button";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LocationFormData, locationSchema } from "./locations-schema";
import GooglePlacesAutocomplete from "@/components/input/google-maps/place-autocomplete";
import { Controller } from "react-hook-form";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { LOCATION_TYPE_OPTIONS } from "../utils/location-type-options";
import {
  buildNormalizedAddress,
  extractLocationFields,
} from "../utils/address-parser";
import { useLocationSubmit } from "../hooks/use-location-submit";

import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";

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
  loading,
  onSuccess,
}: LocationsModalProps) {
  const { submitLocation } = useLocationSubmit(onSuccess);

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE,PERMISSION_ENUM.RETRIEVE_SECTION]);

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
      latitude: location ? location.latitude : 40.4168,
      longitude: location?.longitude ? location.longitude : -3.7038,
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
    if (!location?.name) setValue("name", place.name || "");
    setValue("countryCode", locationFields.countryCode);
    setValue("state", locationFields.state);
    setValue("district", locationFields.district);
    setValue("addressRaw", place.formatted_address || "");
    setValue("addressNormalized", addressNormalized);
    setValue("postalCode", locationFields.postalCode);
    setValue("latitude", geometry?.location?.lat() ?? 40.4168);
    setValue("longitude", geometry?.location?.lng() ?? -3.7038);
    setValue("placeId", place.place_id || "");
  };

  const onSubmit = async (data: LocationFormData) => {
    try {
      await submitLocation(data, location);
      handleClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al procesar la localización";

      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={location ? "Editar Localización" : "Crear Localización"}
      className="max-w-2xl"
    >
      <div className="p-5 max-w-full overflow-visible">
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
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
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                      onPlaceSelected={handlePlaceSelected}
                      placeholder="Buscar dirección..."
                      inputClassName="form-input h-12 w-full"
                      initialValue={field.value}
                      onInputChange={(value) => field.onChange(value)}
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

            {/* Grid: country / state - PRIMERA FILA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="min-w-0 flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3.5">
                  País *
                </label>
                <div className="h-12">
                  <RHFCountrySelect
                    name="countryCode"
                    variant="name"
                    inputClassname="h-full w-full"
                    storeCode={true}
                    fullwidth={true}
                  />
                </div>
                <div className="h-5 mt-1">
                  {methods.formState.errors.countryCode && (
                    <span className="text-sm text-red-600">
                      {methods.formState.errors.countryCode.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="min-w-0 flex flex-col">
                <RHFInputWithLabel
                  name="state"
                  label="Estado / Departamento"
                  placeholder="Ej: Cundinamarca"
                  maxLength={120}
                />
                <div className="h-5 mt-1">
                  {/* Espacio reservado para mantener alineación */}
                </div>
              </div>
            </div>

            {/* Grid: district / type - SEGUNDA FILA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="min-w-0">
                <RHFInputWithLabel
                  name="district"
                  label="Distrito / Ciudad"
                  placeholder="Ej: Bogotá"
                  maxLength={120}
                />
              </div>

              <div className="min-w-0">
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
            {hasUpdatePermission && (
              <LoaderButton
                type="submit"
                loading={isSubmitting}
                className="btn btn-primary"
              >
                {location ? "Editar" : "Crear"} Localización
              </LoaderButton>
            )}
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
