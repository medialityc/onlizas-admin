"use client";

import { AlertBox } from "@/components/alert/alert-box";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import { createUnit, updateUnit } from "@/services/units/units";
import { Units } from "@/types/units";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { UnitsFormData, unitsSchema } from "./units-schema";

interface UnitsModalProps {
  open: boolean;
  onClose: () => void;
  unit?: Units; // Opcional si se usa para editar
  loading: boolean;
  onSuccess?: () => void; // Opcional si se usa para editar
}

export default function UnitsModal({
  open,
  onClose,
  unit,
  loading,
  onSuccess,
}: UnitsModalProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const methods = useForm<UnitsFormData>({
    resolver: zodResolver(unitsSchema),
    defaultValues: {
      name: unit?.name ?? "",
      abbreviation: unit?.abbreviation ?? "",
    },
  });

  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: UnitsFormData) => {
    setError(null);
    let response;
    try {
      if (unit) {
        response = await updateUnit(unit.id, data);
      } else {
        response = await createUnit(data);
      }

      if (!response.error) {
        queryClient.invalidateQueries({ queryKey: ["units"] });
        onSuccess?.();
        reset();
        toast.success(
          unit ? "Unidad editada exitosamente" : "Unidad creada exitosamente"
        );
        handleClose();
      } else {
        if (response.status === 409) {
          toast.error("Ya existe una unidad con ese nombre o abreviación");
        } else {
          toast.error(response.message || "No se pudo procesar la unidad");
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la unidad";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={unit ? "Editar Unidad" : "Crear Nueva Unidad"}
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
              label="Nombre de la Unidad"
              placeholder="Ej: Kilogramos, Metros, Piezas"
              autoFocus
            />

            {/* Abbreviation Input */}
            <RHFInputWithLabel
              name="abbreviation"
              label="Abreviación"
              placeholder="Ej: kg, m, pza"
              maxLength={10}
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
              className="btn btn-primary text-textColor"
            >
              {unit ? "Editar" : "Crear"} Unidad
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
