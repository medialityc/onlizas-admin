"use client";

import React from "react";
import type { TemplateProps } from "./template-modern";

export default function TemplateMinimal({ primary, secondary, accent, heroTitle, device, fontFamily }: TemplateProps) {
  const cardRadius = 8;
  const Card = ({ label, width }: { label: string; width?: number }) => (
    <div
      className="border border-gray-200 bg-white text-center text-[11px] h-16 flex items-center justify-center"
      style={{ borderRadius: cardRadius, width }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ fontFamily }}>
      <div className="px-4 py-4 text-sm font-medium" style={{ background: "#F9FAFB", color: "#111827", borderBottom: `2px solid ${accent}` }}>
        TechStore Premium
      </div>
      <div className="p-4">
        <div className="h-24 md:h-28 flex items-center justify-center text-[12px] font-medium text-white" style={{ background: accent, borderRadius: 10 }}>
          {heroTitle}
        </div>
        {device === "mobile" ? (
          <div className="mt-4 overflow-x-auto">
            <div className="flex gap-4 w-max pr-4" style={{ color: secondary }}>
              <Card label="Producto 1" width={240} />
              <Card label="Producto 2" width={240} />
              <Card label="Producto 3" width={240} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mt-4" style={{ color: secondary }}>
            <Card label="Producto 1" />
            <Card label="Producto 2" />
            <Card label="Producto 3" />
          </div>
        )}
      </div>
    </div>
  );
}
