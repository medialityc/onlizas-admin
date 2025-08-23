"use client";

import React from "react";
import type { Promotion } from "@/types/stores";
import SimpleModal from "@/components/modal/modal";
import { useForm } from "react-hook-form";
import { FormProvider, RHFInputWithLabel, RHFSelectWithLabel } from "@/components/react-hook-form";
import RHFDatePicker from "@/components/react-hook-form/rhf-date-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { promotionFormSchema, PromotionFormValues } from "../schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";
import { Button } from "@/components/button/button";
import LoaderButton from "@/components/loaders/loader-button";

const defaultValues: Partial<PromotionFormValues> = {
  type: "percent",
  value: 0,
  usageLimit: 100,
};

export default function CreatePromotionModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (p: Promotion) => void }) {
  const methods = useForm<PromotionFormValues>({
    defaultValues,
    resolver: zodResolver(promotionFormSchema),
    mode: "onChange",
  });

  const toYMD = (d?: Date) => (d ? new Date(d).toISOString().slice(0, 10) : undefined);

  const onSubmit = (data: PromotionFormValues) => {
    // Construcción de FormData pensada para API (stringy dates)
    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("type", data.type);
    if (data.description) fd.append("description", data.description);
    fd.append("value", String(data.value));
    if (data.usageLimit !== undefined && data.usageLimit !== "") {
      fd.append("usageLimit", String(data.usageLimit));
    }
    if (data.code) fd.append("code", data.code);
    if (data.startDate) fd.append("startDate", toYMD(data.startDate) as string);
    if (data.endDate) fd.append("endDate", toYMD(data.endDate) as string);

    // Por ahora trabajamos en mock, pero normalizamos el objeto para el estado local
    onCreate({
      id: Date.now(),
      name: data.name,
      description: data.description,
      type: data.type,
      value: Number(data.value),
      code: data.code,
      usageLimit: data.usageLimit !== undefined && data.usageLimit !== "" ? Number(data.usageLimit) : undefined,
      usedCount: 0,
      startDate: toYMD(data.startDate),
      endDate: toYMD(data.endDate),
      isActive: true,
    });

    methods.reset(defaultValues);
    onClose();
  };

  return (
    <SimpleModal open={open} onClose={onClose} title="Crear Nueva Promoción">
      <FormProvider methods={methods} onSubmit={onSubmit} className="space-y-5">
        {/* Básicos */}
        <Card>
          <CardHeader>
            <CardTitle>Datos básicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RHFInputWithLabel name="name" label="Nombre de la promoción" placeholder="Ej. Descuento verano" required />
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
            <RHFInputWithLabel name="description" label="Descripción" type="textarea" rows={3} />
          </CardContent>
        </Card>

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RHFInputWithLabel name="value" label="Valor" type="number" required />
              <RHFInputWithLabel name="usageLimit" label="Límite de Usos" type="number" />
            </div>
            <div className="flex gap-4 justify-between items-center">
              <RHFInputWithLabel name="code" label="Código Promocional" placeholder="Ej. SUMMER2025" />
              <div className="col-span-1 flex mt-7">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => methods.setValue("code", `CODIGO${Date.now()}`)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RHFDatePicker name="startDate" label="Fecha de Inicio" />
              <RHFDatePicker name="endDate" label="Fecha de Fin" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" outline variant="secondary" onClick={onClose} size="md">
            Cancelar
          </Button>
          <Button className="shadow-none"  type="submit">
            Guardar
          </Button>
        </div>
      </FormProvider>
    </SimpleModal>
  );
}
