import LoaderButton from "@/components/loaders/loader-button";
import {
  RHFFileUpload,
  RHFInputWithLabel,
  RHFSelectWithLabel,
} from "@/components/react-hook-form";
import { DocumentIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

function SupplierCreateForm({ handleClose }: { handleClose: () => void }) {
  const {
    watch,
    control,
    formState: { isSubmitting },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  return (
    <>
      <div className="space-y-4">
        {/* Name Input */}
        <RHFInputWithLabel
          name="name"
          label="Nombre del Proveedor"
          placeholder="Ej: Proveedor ABC S.A."
          autoFocus
          maxLength={100}
        />
        {/* Email Input */}
        <RHFInputWithLabel
          name="email"
          label="Email"
          placeholder="contacto@proveedor.com"
          type="email"
          required
        />

        {/* Phone Input */}
        <RHFInputWithLabel
          name="phone"
          label="Teléfono"
          type="tel"
          placeholder="+1234567890"
          maxLength={20}
          required
        />

        {/* Seller Type */}
        <RHFSelectWithLabel
          name="sellerType"
          label="Tipo de vendedor"
          options={[
            { value: "Mayorista", label: "Mayorista" },
            { value: "Minorista", label: "Minorista" },
            { value: "Ambos", label: "Ambos" },
          ]}
          placeholder="Seleccionar..."
          required
          variant="custom"
        />

        {/* Nacionality Type */}
        <RHFSelectWithLabel
          name="nacionalityType"
          label="Nacionalidad"
          options={[
            { value: "Nacional", label: "Nacional" },
            { value: "Extranjero", label: "Extranjero" },
            { value: "Ambos", label: "Ambos" },
          ]}
          placeholder="Seleccionar..."
          required
          variant="custom"
        />

        {/* Address Input */}
        <RHFInputWithLabel
          name="address"
          label="Dirección"
          placeholder="Calle Principal 123, Ciudad, País"
          maxLength={200}
          rows={3}
          type="textarea"
          required
        />

        {/* Mincex Code (conditional) */}
        {watch("nacionalityType") !== 0 && (
          <RHFInputWithLabel
            name="mincexCode"
            label="Código Mincex"
            placeholder="Ingresa el código Mincex"
            type="text"
            required
          />
        )}

        {/* Documents Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Documentos
            </label>
            <button
              type="button"
              onClick={() => append({ fileName: "", content: undefined })}
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
              Formatos aceptados: PDF, DOC, DOCX, JPG, JPEG, PNG (máx. 10MB por
              archivo)
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
          className="btn btn-primary "
        >
          Crear Proveedor
        </LoaderButton>
      </div>
    </>
  );
}

export default SupplierCreateForm;
