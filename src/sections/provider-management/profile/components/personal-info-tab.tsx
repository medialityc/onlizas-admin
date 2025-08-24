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
import { UserDocumentsList } from "@/sections/users/documents/list/documents-list";
import { getUserDocuments } from "@/services/users";
import { Suspense } from "react";
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
  console.log(user);

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

  // documents are shown via the reusable UserDocumentsList (server-aware)
  const documentsPromise = useMemo(() => {
    const userId = user?.id ?? 0;
    return getUserDocuments(userId);
  }, [user?.id]);

  type PersonalAddress = PersonalInfoFormData["addresses"][number];
  const toPersonalAddress = (a: UserAddressFormData): PersonalAddress => ({
    id: a.id,
    name: a.name,
    mainStreet: a.mainStreet,
    number: a.number,
    city: a.city ?? "",
    state: a.state ?? "",
    zipcode: a.zipcode ?? "",
    countryId: a.countryId ?? 0,
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
                    name="photo"
                    label="Foto"
                    // defaultImage={user?.photoUrl}
                    variant="rounded"
                    size="md"
                  />
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
                  loading={methods.formState.isSubmitting}
                  className="px-4 py-2"
                >
                  Guardar
                </LoaderButton>
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
                  <UserDocumentsList
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
