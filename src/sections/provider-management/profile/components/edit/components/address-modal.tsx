"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddressFormData, addressSchema } from "../user-edit-schema";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";
import { Label } from "@/components/label/label";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: AddressFormData) => void;
  editingAddress?: AddressFormData | null;
}

export function AddressModal({
  open,
  onClose,
  onSave,
  editingAddress,
}: AddressModalProps) {
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const methods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: editingAddress || {
      name: "",
      mainStreet: "",
      otherStreets: "",
      number: "",
      city: "",
      state: "",
      zipcode: "",
      annotations: "",
      latitude: 0.0,
      longitude: 0.0,
      countryId: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const {
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: AddressFormData) => {
    onSave(data);
    reset();
    onClose();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude);
          setValue("longitude", position.coords.longitude);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }
  };

  return (
    <SimpleModal
      title={
        <h1 className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5 text-green-600" />
          {editingAddress ? "Editar Dirección" : "Nueva Dirección"}
        </h1>
      }
      subtitle="Complete la información de la dirección. Los campos marcados con * son obligatorios."
      open={open}
      onClose={onClose}
    >
      <FormProvider onSubmit={onSubmit} methods={methods} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <RHFInputWithLabel
              id="name"
              name="name"
              label="Nombre de la dirección *"
              placeholder="Casa, Oficina, Trabajo..."
              className="transition-all focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <RHFInputWithLabel
              id="mainStreet"
              name="mainStreet"
              label="Calle principal *"
              placeholder="Av. Insurgentes, Calle Madero..."
              className="transition-all focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <RHFInputWithLabel
              id="number"
              name="number"
              label="Número *"
              placeholder="123, 45-A, S/N..."
              className="transition-all focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <RHFInputWithLabel
              id="otherStreets"
              name="otherStreets"
              label="Entre calles"
              placeholder="Entre Av. Reforma y Calle 5..."
              className="transition-all focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <RHFInputWithLabel
              id="city"
              name="city"
              label="Ciudad *"
              placeholder="Ciudad de México, Guadalajara..."
              className="transition-all focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <RHFInputWithLabel
              id="state"
              name="state"
              label="Estado *"
              placeholder="CDMX, Jalisco, Nuevo León..."
              className="transition-all focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <RHFInputWithLabel
              id="zipcode"
              name="zipcode"
              label="Código Postal *"
              placeholder="01000, 44100..."
              className="transition-all focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-4 mt-[3px]">
            <Label htmlFor="countryId">País *</Label>
            <RHFCountrySelect
              name="countryId"
              variant="name"
              inputClassname="transition-all focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Coordenadas GPS</Label>
            <Button
              type="button"
              outline
              size="sm"
              onClick={getCurrentLocation}
              className="flex items-center gap-2 text-green-600 hover:text-white border-green-600 hover:bg-green-600"
            >
              <MapPinIcon className="h-4 w-4" />
              Obtener ubicación actual
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <RHFInputWithLabel
                id="latitude"
                name="latitude"
                label="Latitud"
                type="number"
                step="any"
                placeholder="19.4326"
                className="transition-all focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <RHFInputWithLabel
                id="longitude"
                name="longitude"
                label="Longitud"
                type="number"
                step="any"
                placeholder="-99.1332"
                className="transition-all focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="annotations">Notas adicionales</Label>
          <RHFInputWithLabel
            id="annotations"
            name="annotations"
            type="textarea"
            placeholder="Referencias, instrucciones especiales, etc."
            rows={3}
            className="transition-all focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button type="button" outline onClick={onClose}>
            Cancelar
          </Button>
          {hasUpdatePermission && (
            <LoaderButton
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting
                ? "Guardando..."
                : editingAddress
                  ? "Actualizar"
                  : "Guardar"}
            </LoaderButton>
          )}
        </div>
      </FormProvider>
    </SimpleModal>
  );
}
