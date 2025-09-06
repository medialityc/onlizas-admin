"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";
import { RHFSelectWithLabel } from "@/components/react-hook-form";
import RHFColorPicker from "@/components/react-hook-form/rhf-color-picker";
import { AppearanceForm } from "../../schemas/appearance-schema";

// Backend font enums
export const FONT_OPTIONS = [
  { label: "Arial", value: "ARIAL" },
  { label: "Argelian", value: "ARGELIAN" },
];

// Backend template enums
export const TEMPLATE_OPTIONS = [
  { label: "Moderno", value: "MODERNO" },
  { label: "Clásico", value: "CLASICO" },
  { label: "Minimalista", value: "MINIMALISTA" },
  { label: "Audaz", value: "AUDAZ" },
];

export default function ThemeAndColorsTab() {
  const { watch } = useFormContext<AppearanceForm>();

  // Valores actuales para previsualización
  const primaryColor = watch("primaryColor");
  const secondaryColor = watch("secondaryColor");
  const accentColor = watch("accentColor");

  const swatches = useMemo(() => [
    primaryColor || "#3B82F6",
    secondaryColor || "#1F2937",
    accentColor || "#F59E0B",
  ], [primaryColor, secondaryColor, accentColor]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Esquema de Colores */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Esquema de Colores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFColorPicker name="primaryColor" label="Color Primario" />
            <RHFColorPicker name="secondaryColor" label="Color Secundario" />
            <RHFColorPicker name="accentColor" label="Color de Acento" />
          </CardContent>
        </Card>

        {/* Tipografía y Plantilla */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Tipografía y Plantilla</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSelectWithLabel name="font" label="Fuente" variant="custom" options={FONT_OPTIONS} />
            <RHFSelectWithLabel name="template" label="Plantilla" variant="custom" options={TEMPLATE_OPTIONS} />

            <div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Vista Previa de Colores</div>
              <div className="flex gap-2">
                {swatches.map((c, i) => (
                  <div key={`${i}-${c}`} className="w-8 h-8 rounded border border-gray-200 dark:border-gray-600" style={{ background: c }} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
