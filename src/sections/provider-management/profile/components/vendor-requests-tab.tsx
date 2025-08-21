"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/cards/card";
import { Label } from "@/components/label/label";
import { Input } from "@mantine/core";

type FormData = {
  categories: string;
  expiryDate: string;
  notes: string;
};

export default function VendorRequestsTab() {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { categories: "", expiryDate: "", notes: "" },
  });

  const onSubmit = (data: FormData) => {
    // placeholder: will be wired to services later
    console.log("Vendor request submit", data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes de Aprobación</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Aquí el proveedor puede solicitar autorización para vender en
          categorías específicas, establecer fecha de expiración de la
          autorización y adjuntar notas o justificación.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Categorías solicitadas</Label>
            <Input
              {...register("categories")}
              placeholder="Ej: Electrónica, Hogar"
            />
          </div>

          <div>
            <Label>Fecha de expiración (opcional)</Label>
            <Input type="date" {...register("expiryDate")} />
          </div>

          <div>
            <Label>Notas / Justificación</Label>
            <textarea
              {...register("notes")}
              className="w-full rounded-md border px-3 py-2"
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Enviar Solicitud</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
