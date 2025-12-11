"use client";

import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImporterSchema, ImporterInput } from "../schemas/importer";
import { createImporter, updateImporter } from "@/services/importers";
import { Importer } from "@/types/importers";
import { toast } from "react-toastify";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  importer?: Importer | null;
}

export default function ImporterModal({
  open,
  onClose,
  onSuccess,
  importer,
}: Props) {
  const methods = useForm<ImporterInput>({
    resolver: zodResolver(ImporterSchema),
    defaultValues: {
      name: importer?.name || "",
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

  const submit = async (data: ImporterInput) => {
    try {
      if (importer) {
        const res = await updateImporter(importer.id, data);
        if (!res.error) {
          toast.success("Importadora actualizada correctamente");
        } else if (res.message) {
          toast.error(res.message);
          return;
        }
      } else {
        const res = await createImporter(data);
        if (!res.error) {
          toast.success("Importadora creada correctamente");
        } else if (res.message) {
          toast.error(res.message);
          return;
        }
      }
      onSuccess?.();
      reset();
      onClose();
    } catch {
      toast.error("Error guardando la importadora");
    }
  };

  useEffect(() => {
    if (importer && open) {
      reset({
        name: importer.name,
      });
    }
    if (!open && !importer) {
      reset({
        name: "",
      });
    }
  }, [importer, open, reset]);

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      title={importer ? "Editar Importadora" : "Nueva Importadora"}
    >
      <div className="p-5">
        <FormProvider methods={methods} onSubmit={submit}>
          <div className="space-y-4 w-full">
            <RHFInputWithLabel
              name="name"
              label="Nombre de la Importadora"
              placeholder="Ej: Importadora Global S.A."
              type="text"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline-secondary"
            >
              Cancelar
            </button>
            <LoaderButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {importer ? "Actualizar" : "Crear"}
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
