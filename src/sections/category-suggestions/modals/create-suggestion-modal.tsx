"use client";

import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  createSuggestionSchema,
  CreateSuggestionFormData,
} from "../schemas/suggestion-schema";
import { createCategorySuggestion } from "@/services/category-suggestions";
import { getAllDepartments } from "@/services/department";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { Department } from "@/types/departments";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateSuggestionModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [defaultDepartments, setDefaultDepartments] = useState<Department[]>([]);

  useEffect(() => {
    if (open) {
      getAllDepartments({ pageSize: 35 }).then((res) => {
        if (!res.error && res.data?.data) {
          setDefaultDepartments(res.data.data);
        }
      });
    }
  }, [open]);

  const methods = useForm<CreateSuggestionFormData>({
    resolver: zodResolver(createSuggestionSchema),
    defaultValues: {
      name: "",
      description: "",
      departmentId: undefined,
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    onClose();
  };

  const fetchDepartments = async (params: any) => {
    const res = await getAllDepartments(params);
    return res;
  };

  const submit = async (data: CreateSuggestionFormData) => {
    try {
      const res = await createCategorySuggestion(data);
      if (!res.error) {
        toast.success("Sugerencia enviada correctamente");
        onSuccess?.();
        handleClose();
      } else {
        toast.error(res.message || "No se pudo enviar la sugerencia");
      }
    } catch {
      toast.error("Error enviando la sugerencia");
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      title="Sugerir categoría"
      size="md"
    >
      <div className="p-5">
        <FormProvider methods={methods} onSubmit={submit}>
          <div className="space-y-4 w-full">
            <RHFAutocompleteFetcherInfinity
              name="departmentId"
              label="Departamento"
              placeholder="Selecciona un departamento"
              onFetch={fetchDepartments}
              defaultOptions={defaultDepartments}
              required
            />
            <RHFInputWithLabel
              name="name"
              label="Nombre"
              placeholder="Ej: Electrónica"
              type="text"
              required
            />
            <RHFInputWithLabel
              name="description"
              label="Descripción"
              placeholder="Describe la categoría sugerida..."
              type="textarea"
            />
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
              disabled={isSubmitting}
            >
              Enviar
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
