"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SimpleModal from "@/components/modal/modal";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { RHFDocumentUpload } from "@/components/react-hook-form/rhf-document-upload";
import LoaderButton from "@/components/loaders/loader-button";
import { Button } from "@/components/button/button";
import FormProvider from "@/components/react-hook-form/form-provider";
import { IDocument } from "@/types/users";
import { uploadOrUpdateUserDocument } from "@/services/users";
import showToast from "@/config/toast/toastConfig";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

const documentSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  file: z.instanceof(File).optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
  document?: IDocument;
  userId: number | string;
  onSuccess?: () => void;
}

export function DocumentModal({
  open,
  onClose,
  document,
  userId,
  onSuccess,
}: DocumentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!document;

  const methods = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: document?.name || "",
      description: document?.description || "",
    },
  });

  const { handleSubmit, reset } = methods;

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasUpdatePermission = hasPermission([
    PERMISSION_ENUM.RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
  ]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: DocumentFormData) => {
    if (!data.file && !isEditing) {
      showToast("Debe seleccionar un archivo", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (data.file) {
        await uploadOrUpdateUserDocument({
          file: data.file,
          name: data.name,
          description: data.description,
          userId,
        });
      }

      showToast(
        isEditing
          ? "Documento actualizado exitosamente"
          : "Documento creado exitosamente",
        "success"
      );

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error al procesar documento:", error);
      showToast("Error al procesar el documento", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      title={isEditing ? "Editar Documento" : "Subir Documento"}
      loading={isLoading}
    >
      <div className="p-5">
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <RHFInputWithLabel
              name="name"
              label="Nombre del documento"
              placeholder="Ej: Cédula de Identidad"
              required
            />

            <RHFInputWithLabel
              name="description"
              label="Descripción"
              placeholder="Descripción opcional del documento"
              type="textarea"
              rows={3}
            />

            <RHFDocumentUpload
              name="file"
              label={isEditing ? "Reemplazar archivo (opcional)" : "Archivo"}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" outline onClick={handleClose}>
                Cancelar
              </Button>
              {hasUpdatePermission && (
                <LoaderButton type="submit" loading={isLoading}>
                  {isEditing ? "Actualizar" : "Subir"}
                </LoaderButton>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
