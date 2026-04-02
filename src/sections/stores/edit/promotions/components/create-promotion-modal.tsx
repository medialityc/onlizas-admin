"use client";

import React from "react";

import SimpleModal from "@/components/modal/modal";
import { FormProvider as RHFFormProvider, useForm } from "react-hook-form";
import {
  RHFInputWithLabel,
  RHFSelectWithLabel,
} from "@/components/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promotionFormSchema, PromotionFormValues } from "../schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import { Button } from "@/components/button/button";
import { Promotion } from "@/types/promotions";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";

const emptyDefaults: Partial<PromotionFormValues> = {
  type: "percent",
  value: 0,
  usageLimit: 100,
};

function promotionToFormValues(p: Promotion): Partial<PromotionFormValues> {
  return {
    name: p.name,
    description: p.description ?? "",
    type: p.discountType === 0 ? "percent" : "amount",
    value: p.discountValue,
    code: p.code ?? "",
    usageLimit: p.usageLimit ?? 0,
    startDate: p.startDate ? new Date(p.startDate) : undefined,
    endDate: p.endDate ? new Date(p.endDate) : undefined,
  };
}

export default function CreatePromotionModal({
  open,
  onClose,
  onCreate,
  initialValues,
  onEdit,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (p: Promotion) => void;
  initialValues?: Promotion;
  onEdit?: (p: Promotion) => void;
}) {
  const isEditing = !!initialValues;

  const methods = useForm<PromotionFormValues>({
    defaultValues: emptyDefaults,
    resolver: zodResolver(promotionFormSchema),
    mode: "onChange",
  });

  // Reset form whenever the modal opens or the target promotion changes
  React.useEffect(() => {
    if (open) {
      methods.reset(
        isEditing ? promotionToFormValues(initialValues!) : emptyDefaults,
      );
    }
  }, [open, initialValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const toYMD = (d?: Date) =>
    d ? new Date(d).toISOString().slice(0, 10) : undefined;

  const onSubmit = (data: PromotionFormValues) => {
    const promotion: Promotion = {
      ...(initialValues ?? {
        id: Date.now().toString(),
        usedCount: 0,
        active: true,
        storeId: 0,
        storeName: "",
        mediaFile: "",
        promotionCategoriesDTOs: [],
        promotionProductsDTOs: [],
      }),
      name: data.name,
      description: data.description ?? "",
      discountType: data.type === "percent" ? 0 : 1,
      discountValue: Number(data.value),
      code: data.code ?? "",
      usageLimit: data.usageLimit ?? 0,
      startDate: toYMD(data.startDate),
      endDate: toYMD(data.endDate),
    };

    if (isEditing) {
      onEdit?.(promotion);
    } else {
      onCreate(promotion);
    }

    methods.reset(emptyDefaults);
    onClose();
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar Promoción" : "Crear Nueva Promoción"}
    >
      <RHFFormProvider {...methods}>
        <div className="space-y-5">
          {/* Básicos */}
          <Card>
            <CardHeader>
              <CardTitle>Datos básicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RHFInputWithLabel
                  name="name"
                  label="Nombre de la promoción"
                  placeholder="Ej. Descuento verano"
                  required
                />
                <RHFSelectWithLabel
                  name="type"
                  label="Tipo"
                  variant="native"
                  options={[
                    { value: "percent", label: "Descuento por Porcentaje" },
                    { value: "amount", label: "Monto Fijo" },
                  ]}
                  required
                />
              </div>
              <RHFInputWithLabel
                name="description"
                label="Descripción"
                type="textarea"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RHFInputWithLabel
                  name="value"
                  label="Valor"
                  type="number"
                  required
                />
                <RHFInputWithLabel
                  name="usageLimit"
                  label="Límite de Usos"
                  type="number"
                />
              </div>
              <div className="flex gap-4 justify-between items-center">
                <RHFInputWithLabel
                  name="code"
                  label="Código Promocional"
                  placeholder="Ej. SUMMER2025"
                />
                <div className="col-span-1 flex mt-7">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      methods.setValue("code", `CODIGO${Date.now()}`)
                    }
                  >
                    Generar código
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vigencia */}
          <Card>
            <CardHeader>
              <CardTitle>Vigencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <RHFDateInput name="startDate" label="Fecha de Inicio" />
                <RHFDateInput name="endDate" label="Fecha de Fin" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="shadow-none"
              type="button"
              onClick={() => methods.handleSubmit(onSubmit)()}
            >
              {isEditing ? "Guardar cambios" : "Guardar"}
            </Button>
          </div>
        </div>
      </RHFFormProvider>
    </SimpleModal>
  );
}
