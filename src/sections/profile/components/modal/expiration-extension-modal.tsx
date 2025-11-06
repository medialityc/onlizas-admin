"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button/button";
import { Label } from "@/components/label/label";
import { Input } from "@mantine/core";
import SimpleModal from "@/components/modal/modal";
import {
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import RHFInputWithLabel from "../../../../components/react-hook-form/rhf-input";
import { FormProvider } from "@/components/react-hook-form";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";
import LoaderButton from "@/components/loaders/loader-button";

interface ExpirationExtensionFormData {
  newExpirationDate?: Date;
  documentNames: string[];
  contents: File[];
  comments: string;
}

interface ExpirationExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: ExpirationExtensionFormData & { extendExpiration: boolean }
  ) => void;
  loading?: boolean;
  currentExpirationDate?: string;
}

export default function ExpirationExtensionModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  currentExpirationDate,
}: ExpirationExtensionModalProps) {
  const methods = useForm<ExpirationExtensionFormData>({
    defaultValues: {
      newExpirationDate: undefined,
      documentNames: [],
      contents: [],
      comments: "",
    },
  });
  const { register, handleSubmit, watch, setValue } = methods;

  const handleFormSubmit = (data: ExpirationExtensionFormData) => {
    onSubmit({
      ...data,
      extendExpiration: true,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const fileNames = files.map((file) => file.name);

    setValue("contents", files);
    setValue("documentNames", fileNames);
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <SimpleModal
      open={isOpen}
      onClose={onClose}
      title="Extender Fecha de Expiración"
      subtitle="Solicita una extensión para la fecha de expiración de tu autorización"
      className="max-w-2xl"
    >
      <FormProvider
        methods={methods}
        onSubmit={handleFormSubmit}
        className="space-y-6"
      >
        {/* Información actual */}
        {currentExpirationDate && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300 ">
              <strong>Fecha de expiración actual:</strong>{" "}
              {new Date(currentExpirationDate).toLocaleDateString("es-ES")}
            </p>
          </div>
        )}

        {/* Nueva fecha */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-blue-500 " />
            <Label className="font-semibold text-sm dark:text-black-light mt-3">
              Nueva fecha de expiración *
            </Label>
          </div>
          <RHFDateInput
            name="newExpirationDate"
            required
            minDate={new Date(tomorrow)}
            validate={(value?: Date) => {
              if (!value) return "La nueva fecha de expiración es obligatoria";
              const today = new Date();
              // comparar sin horas
              const sel = new Date(
                value.getFullYear(),
                value.getMonth(),
                value.getDate()
              );
              const t = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              if (sel <= t) return "La fecha debe ser posterior a hoy";
              if (currentExpirationDate) {
                const currentDate = new Date(currentExpirationDate);
                const c = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate()
                );
                if (sel <= c)
                  return "La nueva fecha debe ser posterior a la fecha actual de expiración";
              }
              return true;
            }}
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <p className="text-xs text-gray-500">
            Seleccione la nueva fecha hasta la cual desea que sea válida su
            autorización
          </p>
        </div>

        {/* Documentos */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5 text-green-500" />
            <Label className="font-semibold text-sm dark:text-black-light mt-3">
              Documentos de respaldo
            </Label>
          </div>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Suba los documentos que justifiquen la extensión (PDF, DOC, JPG,
              PNG)
            </p>
          </div>
          {watch("documentNames")?.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Archivos seleccionados:
              </p>
              <ul className="mt-1 space-y-1">
                {watch("documentNames").map((name, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    📄 {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Comentarios */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-purple-500" />
            <Label className="font-semibold text-sm dark:text-black-light mt-3">
              Justificación
            </Label>
          </div>
          <RHFInputWithLabel
            name="comments"
            type="textarea"
            // className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
            placeholder="Explique por qué necesita extender la fecha de expiración, cambios en su negocio, proyectos futuros, etc."
            required
          />
          <p className="text-xs text-gray-500">
            Proporcione una justificación detallada para la extensión solicitada
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </Button>
          <LoaderButton
            type="submit"
            disabled={loading}
            loading={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Enviando..." : "📅 Solicitar Extensión"}
          </LoaderButton>
        </div>
      </FormProvider>
    </SimpleModal>
  );
}
