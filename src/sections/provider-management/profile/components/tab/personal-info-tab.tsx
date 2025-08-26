"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/cards/card";
import { AddressFormData as UserAddressFormData } from "@/sections/users/edit/components/user-schema";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import { Suspense, useEffect, useMemo } from "react";
import {
  SparklesIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import StatusBadge from "@/components/badge/status-badge";
import { UserResponseMe } from "@/types/users";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import FormProvider from "@/components/react-hook-form/form-provider";
import AdressField from "@/sections/users/edit/components/adress-field";
import { AddressModal } from "@/sections/users/edit/components/adress-modal";
import { EmptyState } from "@/sections/users/edit/components/empty-state-component";
import { urlToFile } from "@/lib/utils";
import { usePersonalInfoTab } from "../../hooks/use-personal-info-tab";
import { getUserDocuments } from "@/services/users";
import { ProviderDocumentsList } from "../../documents/list/provider-documents-list";

interface PersonalInfoTabProps {
  user: UserResponseMe | null;
}

export function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  const {
    addressFields,
    appendEmail,
    appendPhone,
    closeModal,
    createAddressModal,
    editAddressModal,
    emailFields,
    handleAddressModalSave,
    handleEditAddress,
    handleFormSubmit,
    handleRemoveEmail,
    handleRemovePhone,
    methods,
    openModal,
    phoneFields,
    removeAddress,
    selectedAddress,
    updateProviderMutation,
    documentsPromise,
  } = usePersonalInfoTab({ user });

  const {
    formState: { errors },
  } = methods;

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleFormSubmit}>
        <Card className="border rounded-lg dark:border-gray-800">
          <CardHeader>
            <div className="mb-3 flex items-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              <h2 className="font-bold">Información básica</h2>
            </div>

            <div className="flex items-center gap-4 justify-between w-full">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <RHFImageUpload
                    name="photoFile"
                    label="Foto"
                    // defaultImage={user?.photoUrl}
                    variant="rounded"
                    size="md"
                  />
                  {errors.photoFile && (
                    <p className="text-xs text-red-500 mt-1">
                      ❌ {errors.photoFile.message}
                    </p>
                  )}
                </div>

                {/* Título con nombre */}
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {user?.name}
                  </CardTitle>
                  <CardDescription>
                    <div className="mt-2">
                      <StatusBadge
                        isActive={user?.isActive ?? false}
                        activeText="Proveedor verificado"
                        inactiveText="No verificado"
                      />
                    </div>
                  </CardDescription>
                </div>
              </div>

              <div className="ml-4">
                <LoaderButton
                  type="submit"
                  loading={updateProviderMutation.isPending}
                  className="px-4 py-2"
                >
                  Guardar
                </LoaderButton>
                {Object.keys(errors).length > 0 && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-xs text-red-600 dark:text-red-400">
                      ⚠️ Hay {Object.keys(errors).length} error(es) en el
                      formulario
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row 1: Nombre (left) */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-900/10">
                      <IdentificationIcon className="h-5 w-5 text-dark-dark-light-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Nombre
                    </h3>
                  </div>
                </div>
                <RHFInputWithLabel
                  name="name"
                  label=""
                  placeholder="Usuario"
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    ❌ {errors.name.message}
                  </p>
                )}
              </div>

              {/* Row 1: Estado de la cuenta (right) */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-md bg-green-50 dark:bg-green-900/10">
                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                    Estado de la cuenta
                  </h3>
                </div>
                <div className="flex gap-2">
                  <StatusBadge
                    isActive={user?.isActive ?? false}
                    activeText="Activo"
                    inactiveText="Inactivo"
                  />
                  <StatusBadge
                    isActive={user?.isBlocked ?? false}
                    activeText="Desbloqueado"
                    inactiveText="Bloqueado"
                  />
                </div>
              </div>

              {/* Row 2: Emails - full width */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:col-span-2 h-96 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-sky-50 dark:bg-sky-900/10">
                      <EnvelopeIcon className="h-5 w-5 text-sky-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Emails
                    </h3>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      appendEmail({ address: "", isVerified: false })
                    }
                    className="flex items-center gap-2 mr-9"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Añadir
                  </Button>
                </div>

                <div className="h-80 divide-y divide-gray-200 dark:divide-gray-800 overflow-y-auto pr-2 ultra-thin-scrollbar flex-1">
                  {errors.emails && (
                    <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                      <p className="text-xs text-red-600 dark:text-red-400">
                        ❌ Error en emails:{" "}
                        {errors.emails.message || "Revise los campos de email"}
                      </p>
                    </div>
                  )}
                  {emailFields.map((field, index) => (
                    <div key={field.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <RHFInputWithLabel
                            name={`emails.${index}.address`}
                            label={`Email ${index + 1}`}
                            className="flex-1"
                          />
                          {errors.emails?.[index]?.address && (
                            <p className="text-xs text-red-500 mt-1">
                              ❌ {errors.emails[index].address.message}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-9">
                          <StatusBadge
                            isActive={field.isVerified}
                            activeText="Verificado"
                            inactiveText="No Verificado"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemoveEmail(index)}
                            className="p-1.5 rounded-full text-red-400 hover:bg-red-600/10 hover:text-red-700 transition"
                            aria-label={`Eliminar email ${index + 1}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {emailFields.length === 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                      No hay emails añadidos.
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Direcciones (left) */}
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
                          handleEditAddress={(addr) =>
                            handleEditAddress(addr, index)
                          }
                          removeAddress={removeAddress}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={
                        <MapPinIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      }
                      title="No hay direcciones registradas"
                      description="Agregue una dirección para comenzar"
                    />
                  )}
                </div>
              </div>

              {/* Row 3: Teléfonos (right) */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4 h-96">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-rose-50 dark:bg-rose-900/10">
                      <PhoneIcon className="h-5 w-5 text-rose-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Teléfonos
                    </h3>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      appendPhone({
                        countryId: 1,
                        number: "",
                        isVerified: false,
                      })
                    }
                    className="flex items-center gap-2 mr-9"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Añadir
                  </Button>
                </div>
                <div className="h-80 divide-y divide-gray-200 dark:divide-gray-800 overflow-y-auto pr-2 ultra-thin-scrollbar">
                  {errors.phones && (
                    <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                      <p className="text-xs text-red-600 dark:text-red-400">
                        ❌ Error en teléfonos:{" "}
                        {errors.phones.message ||
                          "Revise los campos de teléfono"}
                      </p>
                    </div>
                  )}
                  {phoneFields.map((field, index) => (
                    <div
                      key={`phone-${field.id}-${index}`}
                      className="py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <RHFInputWithLabel
                            name={`phones.${index}.number`}
                            label={`Teléfono ${index + 1}`}
                            className="flex-1"
                            type="tel"
                          />
                          {errors.phones?.[index]?.number && (
                            <p className="text-xs text-red-500 mt-1">
                              ❌ {errors.phones[index].number.message}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-7">
                          <StatusBadge
                            isActive={field?.isVerified ?? false}
                            activeText="Verificado"
                            inactiveText="No Verificado"
                          />

                          <button
                            type="button"
                            onClick={() => handleRemovePhone(index)}
                            className="p-1.5 rounded-full text-red-400 hover:bg-red-600/10 hover:text-red-700 transition"
                            aria-label={`Eliminar teléfono ${index + 1}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {phoneFields.length === 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                      No hay teléfonos añadidos.
                    </div>
                  )}
                </div>
              </div>

              {/* Row 4: Documentos - full width and last */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4 md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-violet-50 dark:bg-violet-900/10">
                      <IdentificationIcon className="h-5 w-5 text-violet-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Documentos
                    </h3>
                  </div>
                </div>

                <Suspense
                  fallback={<div className="py-4">Cargando documentos...</div>}
                >
                  <ProviderDocumentsList
                    documentsPromise={documentsPromise}
                    userId={user?.id ?? 0}
                  />
                </Suspense>
              </div>
            </div>
          </CardContent>
        </Card>
      </FormProvider>
      {/* Modal para crear/editar direcciones - FUERA del FormProvider */}
      <AddressModal
        key={
          createAddressModal.open
            ? "new"
            : editAddressModal.open
              ? `edit-${selectedAddress?.id ?? "idx"}`
              : "closed"
        }
        open={createAddressModal.open || editAddressModal.open}
        onClose={() => {
          if (editAddressModal.open) closeModal("editAddress");
          if (createAddressModal.open) closeModal("createAddress");
        }}
        onSave={handleAddressModalSave}
        editingAddress={selectedAddress ?? undefined}
      />
    </>
  );
}
