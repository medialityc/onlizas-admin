"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { paths } from "@/config/paths";
import showToast from "@/config/toast/toastConfig";
import { resendEmail, resendPhone, updateUser } from "@/services/users";
import { IUser } from "@/types/users";
import {
  EnvelopeIcon,
  MapPinIcon,
  PlusIcon,
  ShieldCheckIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

// import BusinessModalContainer from "@/sections/businesses/modals/businesses-modal-container";
import RoleCreateModal from "@/sections/roles/create/role-create-modal";
import { AddressModal } from "./components/adress-modal";
import {
  AddressFormData,
  UserUpdateData,
  userUpdateSchema,
} from "./components/user-schema";

import AdressField from "./components/adress-field";
import { EmptyState } from "./components/empty-state-component";
import { FormActions } from "./components/form-actions-section";
import { PasswordToggleField } from "./components/password-toggle-field";
import { RoleAndBusinessSection } from "./components/role-and-business-section";
import { UserFormHeader } from "./components/user-form-header";
import { VerificationStatusList } from "./components/verification-status-list";
import { AttributesSection } from "./components/attributes-section";
import { useInvalidateAutocomplete } from "@/hooks/react-query/use-autocomplete-cache";

interface UserUpdateFormProps {
  initialData?: Partial<IUser>;
}

const UserEditForm: React.FC<UserUpdateFormProps> = ({ initialData }) => {
  const { invalidateAutocomplete } = useInvalidateAutocomplete();
  const [enablePasswordEdit, setEnablePasswordEdit] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressFormData | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState<
    "address" | "rol" | "business" | "none"
  >("none");
  const router = useRouter();

  const methods = useForm<UserUpdateData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      id: initialData?.id || 0,
      name: initialData?.name || "",
      roles: initialData?.roles?.map((r) => r.name) || [],
      addresses:
        initialData?.addresses?.map((addr) => ({
          ...addr,
          otherStreets: addr.otherStreets || "",
          annotations: addr.annotations || "",
        })) || [],
      attributes: initialData?.attributes || {},
      isBlocked: initialData?.isBlocked || false,
      isVerified: initialData?.isVerified || false,
      businessIds: initialData?.businesses?.map((b) => b.id) || [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    control,
    formState: { isSubmitting },
  } = methods;

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({ control, name: "addresses" });

  const onSubmit = async (data: UserUpdateData) => {
    try {
      const res = await updateUser(initialData?.id ?? "", data);
      if (res?.error && res.message) {
        showToast(res.message, "error");
      } else {
        router.push(paths.dashboard.users.list);
        showToast("Usuario actualizado correctamente", "success");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showToast("Ocurrió un error, intente nuevamente", "error");
    }
  };

  const handleAddressModalSave = (address: AddressFormData) => {
    if (editingAddress) {
      const index = addressFields.findIndex(
        (field) => field.id === editingAddress.id
      );
      if (index !== -1) updateAddress(index, address);
    } else {
      appendAddress({ ...address, id: Date.now() });
    }
    setEditingAddress(null);
  };

  const handleEditAddress = (address: AddressFormData) => {
    setEditingAddress(address);
    setModalOpen("address");
  };

  console.log(methods.formState.errors, "Form Errors");
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <UserFormHeader
          title="Gestión de Usuario"
          description="Complete la información del usuario y configure sus permisos"
        />
        <FormProvider
          methods={methods}
          onSubmit={onSubmit}
          className="space-y-8"
        >
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-black backdrop-blur-sm">
            <CardHeader className="bg-primary text-white rounded-t-lg p-4 text-lg">
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription className="text-blue-100">
                Datos básicos del usuario
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <RHFImageUpload
                    name="photo"
                    control={control}
                    variant="circle"
                    size="lg"
                    defaultImage={initialData?.photoUrl}
                  />
                </div>
                <div className="space-y-2">
                  <RHFInputWithLabel
                    name="name"
                    label="Nombre Completo *"
                    placeholder="Ingrese el nombre completo"
                  />
                  <PasswordToggleField
                    enablePasswordEdit={enablePasswordEdit}
                    setEnablePasswordEdit={setEnablePasswordEdit}
                    control={control}
                  />
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex items-center space-x-3">
                  <RHFCheckbox name="isVerified" label="Usuario verificado" />
                </div>
                <div className="flex items-center space-x-3">
                  <RHFCheckbox name="isBlocked" label="Usuario bloqueado" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-black backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-t-lg p-4 text-lg">
              <CardTitle className="flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5" />
                Emails y Teléfonos
              </CardTitle>
              <CardDescription className="text-blue-100">
                Información de contacto y su estado de verificación
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <VerificationStatusList
                items={
                  initialData?.emails?.map((email) => ({
                    value: email.address,
                    isVerified: email.isVerified,
                  })) || []
                }
                label="Correos Electrónicos"
                onVerify={async (email) => {
                  try {
                    const response = await resendEmail({ email });
                    if (response?.error) {
                      showToast(
                        response.message || "Error al enviar el correo",
                        "error"
                      );
                    } else {
                      showToast(
                        "Correo de verificación enviado correctamente",
                        "success"
                      );
                    }
                  } catch (error) {
                    console.error("Error al verificar el correo:", error);
                    showToast("Error al verificar el correo", "error");
                  }
                }}
              />

              <VerificationStatusList
                items={
                  initialData?.phones?.map((phone) => ({
                    value: phone.number,
                    isVerified: phone.isVerified,
                  })) || []
                }
                label="Teléfonos"
                onVerify={async (value) => {
                  try {
                    const phone = initialData?.phones?.find(
                      (p) => p.number === value
                    );
                    if (!phone) return;
                    const response = await resendPhone({
                      countryId: phone.countryId,
                      phoneNumber: phone.number,
                    });
                    if (response?.error) {
                      showToast(
                        response.message || "Error al enviar el correo",
                        "error"
                      );
                    } else {
                      showToast(
                        "Correo de verificación enviado correctamente",
                        "success"
                      );
                    }
                  } catch (error) {
                    console.error("Error al verificar el correo:", error);
                    showToast("Error al verificar el correo", "error");
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 dark:bg-black backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg p-4 text-lg">
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="h-5 w-5" />
                Atributos Personalizados
              </CardTitle>
              <CardDescription className="text-amber-100">
                Información adicional del usuario en formato clave-valor
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <AttributesSection />
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80  dark:bg-black  backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-4 text-lg">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5" />
                Roles y Permisos
              </CardTitle>
              <CardDescription className="text-purple-100">
                Configure los roles y empresas asociadas
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <RoleAndBusinessSection
                control={control}
                isSubmitting={isSubmitting}
                onOpenRoleModal={() => setModalOpen("rol")}
                onOpenBusinessModal={() => setModalOpen("business")}
              />
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0 bg-white/80  dark:bg-black  backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg p-4 text-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Direcciones
              </CardTitle>
              <CardDescription className="text-green-100">
                Gestione las direcciones del usuario
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  {addressFields.length} dirección
                  {addressFields.length !== 1 ? "es" : ""} registrada
                  {addressFields.length !== 1 ? "s" : ""}
                </p>
                <Button
                  type="button"
                  onClick={() => setModalOpen("address")}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2 border-none"
                >
                  <PlusIcon className="h-4 w-4" />
                  Nueva Dirección
                </Button>
              </div>

              {addressFields.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addressFields.map((field, index) => (
                    <AdressField
                      key={field.id}
                      field={field}
                      index={index}
                      handleEditAddress={handleEditAddress}
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
            </CardContent>
          </Card>
          <FormActions
            isSubmitting={isSubmitting}
            onCancel={() => router.push(paths.dashboard.users.list)}
          />
        </FormProvider>

        <AddressModal
          open={modalOpen === "address"}
          onClose={() => setModalOpen("none")}
          onSave={handleAddressModalSave}
          editingAddress={editingAddress}
        />
        <RoleCreateModal
          open={modalOpen === "rol"}
          onClose={() => setModalOpen("none")}
          onSuccess={() => {
            console.log("Invalidating roles autocomplete");
            invalidateAutocomplete(["roles", "infinite-autocomplete"]);
          }}
        />
      </div>
    </div>
  );
};

export default UserEditForm;
