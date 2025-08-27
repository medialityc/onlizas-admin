"use client";

import { Button } from "@/components/button/button";
import { MapPinIcon, PlusIcon } from "@heroicons/react/24/outline";
import { AddressFormData as UserAddressFormData } from "@/sections/users/edit/components/user-schema";
import AdressField from "@/sections/users/edit/components/adress-field";
import { EmptyState } from "@/sections/users/edit/components/empty-state-component";

interface AddressesSectionProps {
  addressFields: any[];
  errors: any;
  openModal: (modal: string) => void;
  handleEditAddress: (addr: any, index: number) => void;
  removeAddress: (index: number) => void;
}

export function AddressesSection({
  addressFields,
  errors,
  openModal,
  handleEditAddress,
  removeAddress,
}: AddressesSectionProps) {
  return (
    <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4 h-96">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-amber-50 dark:bg-amber-900/10">
            <MapPinIcon className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Direcciones
          </h3>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => openModal("createAddress")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Nueva Dirección
        </Button>
      </div>
      <div className="h-80 overflow-y-auto pr-2 ultra-thin-scrollbar">
        {errors.addresses && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
            <p className="text-xs text-red-600 dark:text-red-400">
              ❌ Error en direcciones:{" "}
              {errors.addresses.message || "Revise las direcciones"}
            </p>
          </div>
        )}
        {addressFields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addressFields.map((field, index) => (
              <AdressField
                key={field._key ?? `${(field as any).id}-${index}`}
                field={field as unknown as UserAddressFormData}
                index={index}
                handleEditAddress={(addr) => handleEditAddress(addr, index)}
                removeAddress={() => removeAddress(index)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MapPinIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />}
            title="No hay direcciones registradas"
            description="Agregue una dirección para comenzar"
          />
        )}
      </div>
    </div>
  );
}
