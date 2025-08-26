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

// Backend enums
const fonts = [
  { value: "ARIAL", label: "Arial" },
  { value: "ARGELIAN", label: "Argelian" },
];

const templates = [
  { value: "MODERNO", label: "Moderno" },
  { value: "CLASICO", label: "Clásico" },
  { value: "MINIMALISTA", label: "Minimalista" },
  { value: "AUDAZ", label: "Audaz" },
];

export default function ThemeAndColorsTab() {
  const { watch, setValue, getValues } = useFormContext();

  // Establecer valores por defecto si están vacíos, sin registrar manualmente campos controlados
  useEffect(() => {
    const f = getValues(FIELD_APPEARANCE.font) as string | undefined;
    const t = getValues(FIELD_APPEARANCE.template) as string | undefined;
    const p = getValues(FIELD_APPEARANCE.primary) as string | undefined;
    const s = getValues(FIELD_APPEARANCE.secondary) as string | undefined;
    const a = getValues(FIELD_APPEARANCE.accent) as string | undefined;
    if (!f) setValue(FIELD_APPEARANCE.font, "ARIAL", { shouldDirty: false });
    if (!t) setValue(FIELD_APPEARANCE.template, "MODERNO", { shouldDirty: false });
    if (!p) setValue(FIELD_APPEARANCE.primary, "#3B82F6", { shouldDirty: false });
    if (!s) setValue(FIELD_APPEARANCE.secondary, "#111827", { shouldDirty: false });
    if (!a) setValue(FIELD_APPEARANCE.accent, "#F59E0B", { shouldDirty: false });
    
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
