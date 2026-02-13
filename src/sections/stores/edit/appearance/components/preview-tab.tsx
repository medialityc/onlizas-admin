"use client";

import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";
import { ComputerDesktopIcon, DevicePhoneMobileIcon, DeviceTabletIcon } from "@heroicons/react/24/outline";
import { TemplateModern, TemplateClassic, TemplateMinimal, TemplateAudaz } from "./templates";

type Device = "desktop" | "tablet" | "mobile";

export default function PreviewTab() {
  const { watch } = useFormContext();

  // Watch appearance fields to style the preview live
  const primary = (watch("primaryColor") as string) || "#3B82F6"; // blue-500
  const secondary = (watch("secondaryColor") as string) || "#111827"; // gray-900
  const accent = (watch("accentColor") as string) || "#F59E0B"; // amber-500
  const font = (watch("font") as string) || "ARIAL";
  const template = (watch("template") as string) || "MODERNO";
  const banners = (watch("banners") as Array<any> | undefined) || [];

  const heroHomeBannerTitle = useMemo(() => {
    const hero = banners?.find((b) => {
      const pos = typeof b?.position === "number" ? b.position : parseInt(String(b?.position ?? 0), 10);
      return pos === 1;
    });
    return hero?.title || "HomeBanner Principal";
  }, [banners]);

  const [device, setDevice] = useState<Device>("desktop");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-start justify-between">
          <CardTitle>Vista Previa de la Tienda</CardTitle>
          <DeviceToggle device={device} onChange={setDevice} />
        </CardHeader>
        <CardContent>
          <PreviewSurface
            device={device}
            primary={primary}
            secondary={secondary}
            accent={accent}
            font={font}
            template={template}
            heroTitle={heroHomeBannerTitle}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function DeviceToggle({ device, onChange }: { device: Device; onChange: (d: Device) => void }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors";
  const active = "bg-gray-900 text-white border-gray-900";
  const idle = "bg-white text-gray-700 border-gray-200 hover:bg-gray-50";
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={`${base} ${device === "desktop" ? active : idle}`} onClick={() => onChange("desktop")}
        aria-pressed={device === "desktop"}>
        <ComputerDesktopIcon className="w-4 h-4" /> Desktop
      </button>
      <button type="button" className={`${base} ${device === "tablet" ? active : idle}`} onClick={() => onChange("tablet")}
        aria-pressed={device === "tablet"}>
        <DeviceTabletIcon className="w-4 h-4" /> Tablet
      </button>
      <button type="button" className={`${base} ${device === "mobile" ? active : idle}`} onClick={() => onChange("mobile")}
        aria-pressed={device === "mobile"}>
        <DevicePhoneMobileIcon className="w-4 h-4" /> Mobile
      </button>
    </div>
  );
}

function PreviewSurface({
  device,
  primary,
  secondary,
  accent,
  font,
  template,
  heroTitle,
}: {
  device: Device;
  primary: string;
  secondary: string;
  accent: string;
  font: string;
  template: string;
  heroTitle: string;
}) {
  // Map selected font to a visible stack so changes are noticeable even if a webfont isn't loaded
  const fontStacks: Record<string, string> = {
    ARIAL: 'Arial, Helvetica, sans-serif',
    ARGELIAN: '"Agency FB", "Georgia", serif',
  };
  const fontFamily = fontStacks[font] ?? fontStacks["ARIAL"];

  // Frame sizes to emulate devices
  const frameStyle: React.CSSProperties = useMemo(() => {
    const common: React.CSSProperties = { fontFamily, background: "#ffffff" };
    if (device === "mobile") return { ...common, width: 384, borderRadius: 12 };
    if (device === "tablet") return { ...common, width: 768, borderRadius: 14 };
    return { ...common, width: "100%", maxWidth: 1024, borderRadius: 16 };
  }, [device, fontFamily]);

  const headerRadius = template === "MINIMALISTA" ? 8 : template === "CLASICO" ? 0 : 10;
  const cardRadius = template === "CLASICO" ? 0 : 10;

  // Template-specific tweaks to make the differences obvious
  const headerStyle: React.CSSProperties =
  template === "MINIMALISTA"
      ? { background: "#F3F4F6", color: "#111827", borderBottom: `1px solid ${accent}` }
      : { background: primary, color: "#ffffff" };
  const heroStyle: React.CSSProperties =
  template === "CLASICO"
      ? { background: accent, borderRadius: 0 }
      : { background: accent, borderRadius: 8 };
  const cardClass =
  template === "CLASICO"
      ? "border-gray-400 shadow-sm"
  : template === "MINIMALISTA"
      ? "border-gray-200"
      : "border-gray-300 shadow-sm";

  const TemplateComponent =
    template === "CLASICO"
      ? TemplateClassic
      : template === "MINIMALISTA"
      ? TemplateMinimal
      : template === "AUDAZ"
      ? TemplateAudaz
      : TemplateModern;

  return (
    <div className="w-full overflow-x-auto">
      <div style={frameStyle} className="mx-auto border border-gray-200 shadow-sm">
        <TemplateComponent
          primary={primary}
          secondary={secondary}
          accent={accent}
          heroTitle={heroTitle}
          device={device}
          fontFamily={fontFamily}
        />
      </div>
    </div>
  );
}

// ProductCard moved into template components
