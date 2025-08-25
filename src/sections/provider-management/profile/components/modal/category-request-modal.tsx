"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button/button";
import { Label } from "@/components/label/label";
import SimpleModal from "@/components/modal/modal";
import { getAllCategories } from "@/services/categories";

import {
  DocumentTextIcon,
  FolderIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import LoaderButton from "@/components/loaders/loader-button";
import InputWithLabel from "@/components/input/input-with-label";
import { FormProvider } from "@/components/react-hook-form";
import RHFInputWithLabel from "../../../../../components/react-hook-form/rhf-input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryRequestModalFormData,
  categoryRequestModalSchema,
} from "../../schemas/category-request-modal-schema";

interface CategoryRequestFormData {
  categoryIds: string[];
  documentNames: string[];
  contents: File[];
  comments: string;
}

interface CategoryRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CategoryRequestFormData & { extendCategories: boolean }
  ) => void;
  loading?: boolean;
  existingIds: string[];
}

export default function CategoryRequestModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  existingIds,
}: CategoryRequestModalProps) {
  const methods = useForm<CategoryRequestModalFormData>({
    resolver: zodResolver(categoryRequestModalSchema),
    defaultValues: {
      categoryIds: [],
      documentNames: [],
      contents: [],
      comments: "",
    },
  });

  const { register, handleSubmit, watch, setValue } = methods;

  const handleFormSubmit = (data: CategoryRequestFormData) => {
    onSubmit({
      ...data,
      extendCategories: true,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const fileNames = files.map((file) => file.name);
    setValue("contents", files);
    setValue("documentNames", fileNames);
  };

  return (
    <SimpleModal
      open={isOpen}
      onClose={onClose}
      title="Solicitar Categorías"
      subtitle="Solicita autorización para vender en nuevas categorías"
      loading={loading}
      className="max-w-2xl"
    >
      <FormProvider methods={methods} onSubmit={handleFormSubmit}>
        {/* Categorías */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <FolderIcon className="h-5 w-5 text-blue-500" />
            <Label className="font-semibold text-sm dark:text-black-light mt-3">
              Categorías solicitadas *
            </Label>
          </div>
          <RHFAutocompleteFetcherInfinity
            name="categoryIds"
            placeholder="Seleccione las categorías que desea solicitar"
            onFetch={getAllCategories}
            required
            exclude={existingIds}
            multiple
            renderOption={(category) => (
              <div className="flex flex-col">
                <span className="font-medium">{category.name}</span>
                {category.description && (
                  <span className="text-xs text-gray-500">
                    {category.description}
                  </span>
                )}
              </div>
            )}
          />
          <p className="text-xs text-gray-500">
            Seleccione las categorías en las que desea obtener autorización para
            vender
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
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-2">
              Suba los documentos que avalen su solicitud (PDF, DOC, JPG, PNG)
            </p>
          </div>
          {(watch("documentNames")?.length ?? 0) > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Archivos seleccionados:
              </p>
              <ul className="mt-1 space-y-1">
                {watch("documentNames")?.map((name, index) => (
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
            <Label className="font-semibold text-sm dark:text-black-light mt-3 ">
              Comentarios
            </Label>
          </div>
          <RHFInputWithLabel
            name="comments"
            type="textarea"
            // className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
            placeholder="Explique por qué necesita autorización para estas categorías, su experiencia previa, planes de negocio, etc."
            required
          />
          <p className="text-xs text-gray-500">
            Proporcione una justificación detallada de su solicitud
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Enviando..." : "📤 Enviar Solicitud"}
          </LoaderButton>
        </div>
      </FormProvider>
    </SimpleModal>
  );
}
