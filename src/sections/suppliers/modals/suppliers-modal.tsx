"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { SuppliersFormData, suppliersSchema } from "./suppliers-schema";

import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import { RHFFileUpload } from "@/components/react-hook-form/rhf-file-upload";
import { Supplier } from "@/types/suppliers";
import { createSupplier, updateSupplierData } from "@/services/supplier";
import { TrashIcon, PlusIcon, DocumentIcon } from "@heroicons/react/24/outline";

interface SuppliersModalProps {
  open: boolean;
  onClose: () => void;
  supplier?: Supplier; // Opcional si se usa para editar
  loading: boolean;
  onSuccess?: () => void; // Opcional si se usa para editar
}

export default function SuppliersModal({
  open,
  onClose,
  supplier,
  loading,
  onSuccess,
}: SuppliersModalProps) {
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<SuppliersFormData>({
    resolver: zodResolver(suppliersSchema),
    defaultValues: {
      name: supplier?.name ?? "",
      supplierType: "Persona",
      email: supplier?.email ?? "",
      phone: "",
      address: "",
      createAutomaticAprovalProcess: false,
      documents: [],
    },
  });

  const {
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: SuppliersFormData) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("supplierType", data.supplierType);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append(
        "createAutomaticAprovalProcess",
        data.createAutomaticAprovalProcess.toString()
      );

      // Agregar documentos como array de objetos
      data.documents?.forEach((doc) => {
        formData.append(`contents`, doc.content);
        formData.append(`documentNames`, doc.fileName);
      });

      let response = null;
      if (supplier) {
        response = await updateSupplierData(supplier.id, formData);
      } else {
        response = await createSupplier(formData);
      }
      if (response && response.status === 200) {
        onSuccess?.();
        reset();
        toast.success(
          supplier
            ? "Proveedor editado exitosamente"
            : "Proveedor creado exitosamente"
        );
        handleClose();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar el proveedor";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={supplier ? "Editar Proveedor" : "Crear Nuevo Proveedor"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="space-y-4">
            {/* Name Input */}
            <RHFInputWithLabel
              name="name"
              label="Nombre del Proveedor"
              placeholder="Ej: Proveedor ABC S.A."
              autoFocus
              maxLength={100}
            />

            {/* Supplier Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Proveedor
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Persona"
                    {...methods.register("supplierType")}
                    className="mr-2"
                  />
                  Persona
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Empresa"
                    {...methods.register("supplierType")}
                    className="mr-2"
                  />
                  Empresa
                </label>
              </div>
            </div>

            {/* Email Input */}
            <RHFInputWithLabel
              name="email"
              label="Email"
              placeholder="contacto@proveedor.com"
              type="email"
            />

            {/* Phone Input */}
            <RHFInputWithLabel
              name="phone"
              label="Teléfono"
              placeholder="+1234567890"
              maxLength={20}
            />

            {/* Address Input */}
            <RHFInputWithLabel
              name="address"
              label="Dirección"
              placeholder="Calle Principal 123, Ciudad, País"
              maxLength={200}
              rows={3}
              type="textarea"
            />

            {/* Automatic Approval Process */}
            <RHFCheckbox
              name="createAutomaticAprovalProcess"
              label="Crear proceso de aprobación automático"
            />

            {/* Documents Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Documentos
                </label>
                <button
                  type="button"
                  onClick={() =>
                    append({ fileName: "", content: new File([], "") })
                  }
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  <PlusIcon className="size-4" />
                  Agregar Documento
                </button>
              </div>

              {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <DocumentIcon className="size-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay documentos agregados
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Haz clic en &ldquo;Agregar Documento&rdquo; para comenzar
                  </p>
                </div>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Documento #{index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <TrashIcon className="size-4" />
                      Eliminar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <RHFInputWithLabel
                      name={`documents.${index}.fileName`}
                      label="Nombre del archivo"
                      placeholder="Ej: Certificado_Calidad.pdf"
                      maxLength={100}
                    />

                    <div>
                      <RHFFileUpload
                        name={`documents.${index}.content`}
                        label="Archivo"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        maxSize={10 * 1024 * 1024}
                        placeholder="Seleccionar documento"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {fields.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Formatos aceptados: PDF, DOC, DOCX, JPG, JPEG, PNG (máx. 10MB
                  por archivo)
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <LoaderButton
              type="submit"
              loading={isSubmitting}
              className="btn btn-primary text-textColor"
            >
              {supplier ? "Editar" : "Crear"} Proveedor
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
