"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/cards/card";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import { RHFFileUpload } from "@/components/react-hook-form/rhf-file-upload";
import {
  SparklesIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import StatusBadge from "@/components/badge/status-badge";
import { IUser } from "@/types/users";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { resendEmail, resendPhone } from "@/services/users";
import LoaderButton from "@/components/loaders/loader-button";
import showToast from "@/config/toast/toastConfig";
import { Button } from "@/components/button/button";
import FormProvider from "@/components/react-hook-form/form-provider";
import {
  PersonalInfoFormData,
  personalInfoSchema,
} from "../schemas/personal-info-schema";
import AdressField from "@/sections/users/edit/components/adress-field";
import { AddressModal } from "@/sections/users/edit/components/adress-modal";
import { EmptyState } from "@/sections/users/edit/components/empty-state-component";
import { AddressFormData as UserAddressFormData } from "@/sections/users/edit/components/user-schema";
import { useMemo } from "react";
import { useModalState } from "@/hooks/use-modal-state";

interface PersonalInfoTabProps {
  user: IUser | null;
  onSave?: (data: PersonalInfoFormData) => void;
}

export function PersonalInfoTab({ user, onSave }: PersonalInfoTabProps) {
  const emails = user?.emails ?? [];
  const phones = user?.phones ?? [];

  // Modal state using global useModalState pattern
  const { getModalState, openModal, closeModal } = useModalState();
  const createAddressModal = getModalState("createAddress");
  const editAddressModal = getModalState<number>("editAddress");

  // Independent form for personal info only
  const methods = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      id: user?.id,
      name: user?.name || "",
      photo: user?.photoUrl || undefined,
      emails: Array.isArray(user?.emails)
        ? user.emails.map((e: any) => ({
            address: e.address,
            isVerified: !!e.isVerified,
          }))
        : [],
      phones: Array.isArray(user?.phones)
        ? user.phones.map((p: any) => ({
            countryId: Number(p.countryId ?? 0),
            number: String(p.number ?? ""),
            isVerified: !!p.isVerified,
          }))
        : [],
      addresses: Array.isArray(user?.addresses)
        ? user.addresses.map((a: any) => ({
            id: a.id,
            name: a.name ?? "",
            mainStreet: a.mainStreet ?? "",
            number: a.number ?? "",
            city: a.city ?? "",
            state: a.state ?? "",
            zipcode: a.zipcode ?? "",
            countryId: Number(a.countryId ?? 0),
            otherStreets: a.otherStreets ?? "",
            latitude: typeof a.latitude === "number" ? a.latitude : undefined,
            longitude:
              typeof a.longitude === "number" ? a.longitude : undefined,
            annotations: a.annotations ?? "",
          }))
        : [],
      isBlocked: !!user?.isBlocked,
      isVerified: !!user?.isVerified,
      attributes: user?.attributes || {},
    },
    mode: "onChange",
  });

  const { control, watch } = methods;
  const emailWatch = watch("emails") || [];
  const phoneWatch = watch("phones") || [];

  const {
    fields: emailFields,
    append: appendEmail,
    remove: removeEmail,
  } = useFieldArray({ control, name: "emails" });

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({ control, name: "phones" });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({ control, name: "addresses", keyName: "_key" });

  const {
    fields: documentFields,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({ control, name: "documents" });

  type PersonalAddress = PersonalInfoFormData["addresses"][number];
  const toPersonalAddress = (a: UserAddressFormData): PersonalAddress => ({
    id: a.id,
    name: a.name,
    mainStreet: a.mainStreet,
    number: a.number,
    city: a.city,
    state: a.state,
    zipcode: a.zipcode,
    countryId: a.countryId,
    otherStreets: a.otherStreets ?? "",
    latitude: a.latitude,
    longitude: a.longitude,
    annotations: a.annotations ?? "",
  });

  const handleResendEmail = async (email: string) => {
    if (!email) return;
    try {
      const res = await resendEmail({ email });
      if (res?.error) {
        showToast(res.message || "Error al enviar el correo", "error");
      } else {
        showToast("Correo de verificación enviado correctamente", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error al enviar la verificación", "error");
    }
  };

  const handleResendPhone = async (phone: any) => {
    if (!phone) return;
    try {
      const response = await resendPhone({
        countryId: phone.countryId || 1,
        phoneNumber: phone.number || phone,
      });
      if (response?.error) {
        showToast(
          response.message || "Error al enviar la verificación",
          "error"
        );
      } else {
        showToast("Verificación enviada correctamente", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error al enviar la verificación", "error");
    }
  };

  const handleRemoveEmail = (index: number) => removeEmail(index);

  const handleRemovePhone = (index: number) => removePhone(index);

  const handleAddressModalSave = (address: UserAddressFormData) => {
    const editIndex = editAddressModal.id ?? null;
    if (editIndex !== null) {
      updateAddress(editIndex, toPersonalAddress(address));
      closeModal("editAddress");
    } else {
      const withId = { ...address, id: Date.now() } as UserAddressFormData;
      appendAddress(toPersonalAddress(withId));
      closeModal("createAddress");
    }
  };

  const handleEditAddress = (_address: any, index: number) => {
    openModal<number>("editAddress", index);
  };

  // Selected address by index when editing
  const selectedAddress = useMemo(() => {
    const idx = editAddressModal.id;
    if (idx === undefined || idx === null) return null;
    return (addressFields[idx] as unknown as UserAddressFormData) ?? null;
  }, [editAddressModal, addressFields]);

  const handleFormSubmit = async (data: PersonalInfoFormData) => {
    if (onSave) {
      onSave(data);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleFormSubmit}>
      <Card className="border rounded-lg dark:border-gray-800">
        <CardHeader>
          <div className="mb-3 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            <h2 className="font-bold">Información básica</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <RHFImageUpload
                name="photo"
                label="Foto"
                defaultImage={user?.photoUrl}
                variant="rounded"
                size="md"
              />
            </div>

            {/* Título con nombre */}
            <div>
              <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
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
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-6">
              {/* Panel: Nombre */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IdentificationIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre
                    </span>
                  </div>
                </div>
                <RHFInputWithLabel
                  name="name"
                  label=""
                  placeholder="Usuario"
                  required
                />
              </div>

              {/* Panel: Emails */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Emails
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      appendEmail({ address: "", isVerified: false })
                    }
                    className="flex items-center gap-2 mr-4"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Añadir
                  </Button>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-48 overflow-y-auto pr-2 ultra-thin-scrollbar">
                  {emailFields.map((field, index) => (
                    <div key={field.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <RHFInputWithLabel
                            name={`emails.${index}.address`}
                            label={`Email ${index + 1}`}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-3 mt-7">
                          {(emailWatch[index]?.isVerified ??
                          emails[index]?.isVerified) ? (
                            <StatusBadge
                              isActive={true}
                              activeText="Verificado"
                              inactiveText="No"
                            />
                          ) : (
                            <LoaderButton
                              type="button"
                              onClick={() =>
                                handleResendEmail(emailWatch[index]?.address)
                              }
                              className="bg-primary text-white px-2 py-1 text-sm"
                            >
                              Enviar
                            </LoaderButton>
                          )}
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

              {/* Panel: Direcciones */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPinIcon className="h-4 w-4" />
                    Direcciones
                  </label>
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

            {/* Columna derecha */}
            <div className="space-y-6">
              {/* Panel: Estado de la cuenta */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheckIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado de la cuenta
                  </span>
                </div>
                <div className="flex gap-2">
                  <StatusBadge
                    isActive={user?.isActive ?? false}
                    activeText="Activo"
                    inactiveText="Inactivo"
                  />
                </div>
              </div>

              {/* Panel: Teléfonos */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Teléfonos
                    </span>
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
                    className="flex items-center gap-2 mr-4"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Añadir
                  </Button>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800 max-h-48 overflow-y-auto pr-2 ultra-thin-scrollbar">
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
                        </div>
                        <div className="flex items-center gap-3 mt-7">
                          {(phoneWatch[index]?.isVerified ??
                          phones[index]?.isVerified) ? (
                            <StatusBadge
                              isActive={true}
                              activeText="Verificado"
                              inactiveText="No"
                            />
                          ) : (
                            <LoaderButton
                              type="button"
                              onClick={() =>
                                handleResendPhone(phoneWatch[index])
                              }
                              className="bg-primary text-white px-2 py-1 text-sm"
                            >
                              Enviar
                            </LoaderButton>
                          )}
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

              {/* Panel: Documentos */}
              <div className="border rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IdentificationIcon className="h-4 w-4" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Documentos
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      appendDocument({ fileName: "", content: "" })
                    }
                    className="flex items-center gap-2 mr-4"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Añadir
                  </Button>
                </div>

                <div className="space-y-3">
                  {documentFields.length > 0 ? (
                    <div className="space-y-3">
                      {documentFields.map((docField, idx) => (
                        <div
                          key={docField.id}
                          className="flex items-start gap-3 border rounded p-3 bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex-1">
                            <RHFFileUpload
                              name={`documents.${idx}.content`}
                              label="Archivo"
                              accept="*/*"
                            />
                            <RHFInputWithLabel
                              name={`documents.${idx}.fileName`}
                              label="Nombre/Descripción"
                              placeholder="Opcional"
                              className="mt-2"
                            />
                          </div>

                          <div className="flex flex-col items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => removeDocument(idx)}
                              className="p-2 rounded-md text-red-500 hover:bg-red-600/10"
                              aria-label={`Eliminar documento ${idx + 1}`}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                      No hay documentos añadidos. Puedes subirlos aquí.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botón de submit */}
          <div className="mt-6 flex justify-end">
            <LoaderButton
              type="submit"
              loading={methods.formState.isSubmitting}
              className="px-6 py-2"
            >
              Guardar Información Personal
            </LoaderButton>
          </div>
        </CardContent>
      </Card>

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
    </FormProvider>
  );
}
