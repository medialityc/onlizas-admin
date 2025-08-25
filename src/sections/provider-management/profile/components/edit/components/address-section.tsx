"use client";

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { UserEditFormData, AddressFormData } from "../user-edit-schema";
import { Button } from "@/components/button/button";
import {
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import SimpleModal from "@/components/modal/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "../user-edit-schema";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFCountrySelect } from "@/components/react-hook-form/rhf-country-code-select";
import { Label } from "@/components/label/label";
import LoaderButton from "@/components/loaders/loader-button";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: AddressFormData) => void;
  editingAddress?: AddressFormData | null;
}

function AddressModal({
  open,
  onClose,
  onSave,
  editingAddress,
}: AddressModalProps) {
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
      countryId: -1,
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
        </div>
      </FormProvider>
    </SimpleModal>
  );
}

export default function AddressSection() {
  const { control } = useFormContext<UserEditFormData>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "addresses",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addAddress = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const editAddress = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const removeAddress = (index: number) => {
    remove(index);
  };

  const handleSaveAddress = (addressData: AddressFormData) => {
    if (editingIndex !== null) {
      update(editingIndex, addressData);
    } else {
      append(addressData);
    }
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const getEditingAddress = (): AddressFormData | null => {
    if (editingIndex !== null && fields[editingIndex]) {
      return fields[editingIndex] as AddressFormData;
    }
    return null;
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white-light">
              Direcciones
            </h3>
          </div>
          <Button
            type="button"
            size="sm"
            outline
            onClick={addAddress}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Agregar Dirección
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
            <MapPinIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              No hay direcciones agregadas. Haz clic en "Agregar Dirección" para
              comenzar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => {
              const address = field as AddressFormData;
              return (
                <div
                  key={field.id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {address.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.mainStreet} {address.number}
                        {address.otherStreets && `, ${address.otherStreets}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.zipcode}
                      </p>
                      {address.annotations && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          {address.annotations}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        outline
                        onClick={() => editAddress(index)}
                        className="flex items-center gap-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Editar
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="danger"
                        outline
                        onClick={() => removeAddress(index)}
                        className="flex items-center gap-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {fields.length > 0 && (
          <p className="text-sm text-gray-500">
            Puedes agregar múltiples direcciones. La primera dirección será
            considerada como principal.
          </p>
        )}
      </div>

      <AddressModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIndex(null);
        }}
        onSave={handleSaveAddress}
        editingAddress={getEditingAddress()}
      />
    </>
  );
}
