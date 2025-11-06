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
import { AddressModal } from "./address-modal";

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
