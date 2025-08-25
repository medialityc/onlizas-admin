"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SimpleModal from "@/components/modal/modal";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  userEditSchema,
  type UserEditFormData,
  defaultUserEditForm,
} from "./user-edit-schema";
import { Button } from "@/components/button/button";
import LoaderButton from "@/components/loaders/loader-button";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFImageUpload } from "@/components/react-hook-form/rhf-image-upload";
import { IUser } from "@/types/users";
import { updateUser } from "@/services/users";
import EmailSection from "./components/email-section";
import PhoneSection from "./components/phone-section";
import AddressSection from "./components/address-section";
import { AlertBox } from "@/components/alert/alert-box";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser | null;
  loading?: boolean;
  onSuccess?: () => void;
}

export default function UserEditModal({
  open,
  onClose,
  user,
  loading = false,
  onSuccess,
}: UserEditModalProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const methods = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: defaultUserEditForm,
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // Cargar datos del usuario cuando cambie
  useEffect(() => {
    if (user && open) {
      setValue("name", user.name || "");
      setValue("photo", user.photoUrl || undefined);
      setValue("emails", user.emails || []);
      setValue("phones", user.phones || []);
      setValue("addresses", user.addresses || []);
      setValue("attributes", user.attributes || {});
    }
  }, [user, open, setValue]);

  const onSubmit = async (data: UserEditFormData) => {
    setError(null);
    try {
      if (!user?.id) {
        throw new Error("No se encontró el ID del usuario");
      }

      // Preparar los datos en el formato UserUpdateData
      const updateData: any = {
        name: data.name,
      };

      // Contraseña (solo si se proporcionó)
      if (data.password && data.password.trim() !== "") {
        updateData.password = data.password;
      }

      // Foto (solo si se proporcionó como File)
      if (data.photo instanceof File) {
        updateData.photo = data.photo;
      }

      // Arrays de datos de contacto
      if (data.emails && data.emails.length > 0) {
        updateData.emails = data.emails;
      }

      if (data.phones && data.phones.length > 0) {
        updateData.phones = data.phones;
      }

      if (data.addresses && data.addresses.length > 0) {
        updateData.addresses = data.addresses;
      }

      // Atributos adicionales
      if (data.attributes) {
        updateData.attributes = data.attributes;
      }

      const response = await updateUser(user.id, updateData);

      if (response && !response.error) {
        // Invalidar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ["user", "profile", "me"] });
        queryClient.invalidateQueries({ queryKey: ["users"] });

        // Resetear formulario y cerrar modal
        reset(defaultUserEditForm);
        setError(null);
        onClose();

        // Callback de éxito
        if (onSuccess) {
          onSuccess();
        }

        toast.success("Perfil actualizado exitosamente");
      } else {
        throw new Error(response?.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar el perfil";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultUserEditForm);
    setError(null);
    onClose();
  };

  return (
    <SimpleModal
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white-light">
              Editar Perfil
            </h1>
            <p className="text-sm text-gray-500">
              Actualiza tu información personal y de contacto
            </p>
          </div>
        </div>
      }
      open={open}
      onClose={handleClose}
      loading={loading}
    >
      <div className="p-6">
        {error && (
          <div className="mb-6">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="space-y-8">
            {/* Información Básica */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Información Básica
                </h3>
                <p className="text-sm text-gray-500">
                  Actualiza tu nombre y foto de perfil
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RHFInputWithLabel
                  name="name"
                  label="Nombre completo"
                  placeholder="Ingresa tu nombre completo"
                  required
                />

                <RHFImageUpload
                  name="photo"
                  label="Foto de perfil"
                  defaultImage={user?.photoUrl}
                  variant="rounded"
                  size="lg"
                />
              </div>

              <div className="space-y-4">
                <RHFInputWithLabel
                  name="password"
                  label="Nueva contraseña"
                  type="password"
                  placeholder="Deja vacío para mantener la actual"
                />
                <p className="text-sm text-gray-500">
                  Debe tener al menos 8 caracteres, incluir mayúsculas, números
                  y símbolos
                </p>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Información de Contacto
                </h3>
                <p className="text-sm text-gray-500">
                  Gestiona tus emails y números de teléfono
                </p>
              </div>

              <EmailSection />
              <PhoneSection />
            </div>

            {/* Direcciones */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Direcciones
                </h3>
                <p className="text-sm text-gray-500">
                  Administra tus direcciones de entrega y facturación
                </p>
              </div>

              <AddressSection />
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                outline
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <LoaderButton
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </LoaderButton>
            </div>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
