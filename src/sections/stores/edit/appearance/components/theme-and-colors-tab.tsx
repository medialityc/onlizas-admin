"use client";

import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";
import { RHFSelectWithLabel } from "@/components/react-hook-form";
import RHFColorPicker from "@/components/react-hook-form/rhf-color-picker";

// Nombres de campos en el form
const FIELD_APPEARANCE = {
  primary: "primaryColor",
  secondary: "secondaryColor",
  accent: "accentColor",
  font: "font",
  template: "template",
} as const;

/* Datos de prueba */
const fonts = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
];

const templates = [
  { value: "modern", label: "Moderno" },
  { value: "classic", label: "Clásico" },
  { value: "minimal", label: "Minimal" },
  { value: "audaz", label: "Audaz" },
];

export default function ThemeAndColorsTab() {
  const { watch, setValue, getValues } = useFormContext();

  // Establecer valores por defecto si están vacíos, sin registrar manualmente campos controlados
  useEffect(() => {
    const current = getValues();
    if (!current?.appearance?.font) setValue(FIELD_APPEARANCE.font, "Inter", { shouldDirty: false });
    if (!current?.appearance?.template) setValue(FIELD_APPEARANCE.template, "modern", { shouldDirty: false });
    if (!current?.appearance?.primaryColor) setValue(FIELD_APPEARANCE.primary, "#3B82F6", { shouldDirty: false });
    if (!current?.appearance?.secondaryColor) setValue(FIELD_APPEARANCE.secondary, "#111827", { shouldDirty: false });
    if (!current?.appearance?.accentColor) setValue(FIELD_APPEARANCE.accent, "#F59E0B", { shouldDirty: false });
    
  }, []);

  // Valores actuales para previsualización
  const primary = watch(FIELD_APPEARANCE.primary) as string | undefined;
  const secondary = watch(FIELD_APPEARANCE.secondary) as string | undefined;
  const accent = watch(FIELD_APPEARANCE.accent) as string | undefined;

  const swatches = useMemo(() => [
    primary || "#3B82F6",
    secondary || "#1F2937",
    accent || "#F59E0B",
  ], [primary, secondary, accent]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Esquema de Colores */}
        <Card>
          <CardHeader>
            <CardTitle>Esquema de Colores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFColorPicker name={FIELD_APPEARANCE.primary} label="Color Primario" />
            <RHFColorPicker name={FIELD_APPEARANCE.secondary} label="Color Secundario" />
            <RHFColorPicker name={FIELD_APPEARANCE.accent} label="Color de Acento" />
          </CardContent>
        </Card>

        {/* Tipografía y Plantilla */}
        <Card>
          <CardHeader>
            <CardTitle>Tipografía y Plantilla</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSelectWithLabel name={FIELD_APPEARANCE.font} label="Fuente" variant="custom" options={fonts} />
            <RHFSelectWithLabel name={FIELD_APPEARANCE.template} label="Plantilla" variant="custom" options={templates} />

            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Vista Previa de Colores</div>
              <div className="flex gap-2">
                {swatches.map((c, i) => (
                  <div key={`${i}-${c}`} className="w-8 h-8 rounded" style={{ background: c }} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
