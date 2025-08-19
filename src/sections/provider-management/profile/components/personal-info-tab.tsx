"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/cards/card";
import InputWithLabel from "@/components/input/input-with-label";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import { User } from "@/auth-sso/types";
import Image from "next/image";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  SparklesIcon,
  IdentificationIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  EyeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import StatusBadge from "@/components/badge/status-badge";
import { IUser } from "@/types/users";
import { useFormContext, useFieldArray } from "react-hook-form";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PasswordToggleField } from "@/sections/users/edit/components/password-toggle-field";
import { resendEmail, resendPhone } from "@/services/users";
import LoaderButton from "@/components/loaders/loader-button";
import { VerificationStatusList } from "@/sections/users/edit/components/verification-status-list";
import showToast from "@/config/toast/toastConfig";
import { Button } from "@/components/button/button";
import { UserUpdateData } from "@/sections/users/edit/components/user-schema";
import { ProviderProfileFormData } from "../profile-schema";
import AdressField from "@/sections/users/edit/components/adress-field";
import { AddressModal } from "@/sections/users/edit/components/adress-modal";
import { EmptyState } from "@/sections/users/edit/components/empty-state-component";
import { AddressFormData as UserAddressFormData } from "@/sections/users/edit/components/user-schema";
import { useMemo, useState } from "react";
import { useModalState } from "@/hooks/use-modal-state";

interface PersonalInfoTabProps {
  user: IUser | null;
  isEditing?: boolean;
}

export function PersonalInfoTab({
  user,
  isEditing = false,
}: PersonalInfoTabProps) {
  const emails = user?.emails ?? [];
  const phones = user?.phones ?? [];
  const methods = useFormContext<ProviderProfileFormData>();
  const { setValue, control, watch } = methods;
  const [enablePasswordEdit, setEnablePasswordEdit] = useState(false);
  // Modal state using global useModalState pattern
  const { getModalState, openModal, closeModal } = useModalState();
  const createAddressModal = getModalState("createAddress");
  const editAddressModal = getModalState<number>("editAddress");

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

  type ProviderAddress = ProviderProfileFormData["addresses"][number];
  const toProviderAddress = (a: UserAddressFormData): ProviderAddress => ({
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
      updateAddress(editIndex, toProviderAddress(address));
      closeModal("editAddress");
    } else {
      const withId = { ...address, id: Date.now() } as UserAddressFormData;
      appendAddress(toProviderAddress(withId));
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

  return (
    <>
      <Card className="border rounded-lg dark:border-gray-800">
        <CardHeader>
          <div className="mb-3 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            <h2 className="font-bold">Información básica</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {isEditing ? (
                <RHFImageUpload
                  name="photo"
                  label="Foto"
                  defaultImage={user?.photoUrl}
                  variant="rounded"
                  size="md"
                />
              ) : user?.photoUrl ? (
                <Image
                  src={user.photoUrl}
                  alt={user.name || "avatar"}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserCircleIcon className="w-8 h-8 text-gray-500 dark:text-gray-300" />
                </div>
              )}
            </div>

            {/* Título con nombre */}
            <div>
              <CardTitle className="text-2xl font-bold">
                {user?.name || "Usuario"}
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
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <IdentificationIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre
                  </span>
                </div>
                {isEditing ? (
                  <RHFInputWithLabel
                    name="name"
                    label=""
                    placeholder="Usuario"
                    required
                  />
                ) : (
                  <InputWithLabel
                    id="name"
                    onChange={() => {}}
                    placeholder={`${user?.name ? "" : "Usuario"}`}
                    label=""
                    value={user?.name || ""}
                    disabled
                  />
                )}
              </div>

              {/* Emails */}
              <div>
                {!isEditing ? (
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Emails
                    </label>
                    {emails && emails.length > 0 ? (
                      <ul className="space-y-2">
                        {emails.map((e, idx) => (
                          <li
                            key={e.address + idx}
                            className="flex items-center justify-between bg-gray-50 dark:bg-black-dark-light p-3 rounded"
                          >
                            <span className="text-sm">{e.address}</span>
                            <div>
                              <StatusBadge
                                isActive={!!e.isVerified}
                                activeText="Verificado"
                                inactiveText="No verificado"
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        No hay emails registrados
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {emailFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <RHFInputWithLabel
                          name={`emails.${index}.address`}
                          label={`Email ${index + 1}`}
                          className="flex-1"
                        />
                        <div className="flex items-center gap-2 mt-7">
                          <div className="flex items-center gap-2">
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
                          </div>

                          <div className="flex items-center">
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

                    <div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          appendEmail({ address: "", isVerified: false })
                        }
                        className="flex items-center gap-2 px-2 py-1"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Añadir
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direcciones */}
              <div>
                <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <span className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    Direcciones
                  </span>
                  {isEditing && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => openModal("createAddress")}
                      className="flex items-center gap-2"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Nueva Dirección
                    </Button>
                  )}
                </label>

                {!isEditing ? (
                  <div>
                    {!user?.addresses || user.addresses.length === 0 ? (
                      <InputWithLabel
                        id="no-address"
                        onChange={() => {}}
                        label=""
                        value="Sin direcciones registradas"
                        disabled
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.addresses.map((address, index) => (
                          <InputWithLabel
                            key={index}
                            id={`address-${index}`}
                            onChange={() => {}}
                            label={address.name || `Dirección ${index + 1}`}
                            value={`${address.mainStreet} ${address.number}, ${address.city}, ${address.state}`}
                            disabled
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : addressFields.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addressFields.map((field, index) => (
                      <AdressField
                        key={field._key ?? `${field.id}-${index}`}
                        field={field as UserAddressFormData}
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
            <div className="space-y-4">
              {/* Estado de la cuenta */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
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
                  {/* <StatusBadge
                  isActive={user?.isVerified ?? false}
                  activeText="Verificado"
                  inactiveText="No verificado"
                />
                <StatusBadge
                  isActive={!(user?.isBlocked ?? true)}
                  activeText="Desbloqueado"
                  inactiveText="Bloqueado"
                /> */}
                </div>
              </div>

              {/* Teléfonos */}
              <div>
                {!isEditing ? (
                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Teléfonos
                    </label>
                    {phones && phones.length > 0 ? (
                      <ul className="space-y-2">
                        {phones.map((p, idx) => (
                          <li
                            key={p.number + idx}
                            className="flex items-center justify-between bg-gray-50 dark:bg-black-dark-light p-3 rounded"
                          >
                            <span className="text-sm">{p.number}</span>
                            <div>
                              <StatusBadge
                                isActive={!!p.isVerified}
                                activeText="Verificado"
                                inactiveText="No verificado"
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        No hay teléfonos registrados
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {phoneFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <RHFInputWithLabel
                          name={`phones.${index}.number`}
                          label={`Teléfono ${index + 1}`}
                          className="flex-1"
                          type="tel"
                        />
                        <div className="flex items-center gap-2 mt-7">
                          <div className="flex items-center gap-2">
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
                          </div>

                          <div className="flex items-center">
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

                    <div>
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
                        className="flex items-center gap-2 px-2 py-1"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Añadir
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Documentos - Botón para ir a la página dedicada */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <IdentificationIcon className="h-4 w-4" />
                  Documentos
                </label>
                <div className="space-y-2">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Gestiona tus documentos personales desde una página
                      dedicada
                    </p>
                    <Button
                      type="button"
                      onClick={() =>
                        window.open(
                          `/provider/profile/${user?.id}/documents`,
                          "_blank"
                        )
                      }
                      className="flex items-center gap-2"
                      size="sm"
                    >
                      <IdentificationIcon className="h-4 w-4" />
                      Ver Documentos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal para crear/editar direcciones */}
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

// Modales locales
