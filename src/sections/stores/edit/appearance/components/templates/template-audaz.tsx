"use client";

import React from "react";
import type { TemplateProps } from "./template-modern";

export default function TemplateAudaz({ primary, secondary, accent, heroTitle, device, fontFamily }: TemplateProps) {
  const cardRadius = 16;
  const Card = ({ label, width }: { label: string; width?: number }) => (
    <div
      className="border bg-white text-center text-[12px] h-24 flex items-center justify-center shadow-lg"
      style={{ borderRadius: cardRadius, width, borderColor: accent, borderWidth: 2, color: secondary }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ fontFamily }}>
      <div className="px-4 py-4 text-white text-sm font-extrabold uppercase tracking-widest" style={{ background: primary, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        TechStore Premium
      </div>
      <div className="p-4">
        <div className="h-32 md:h-36 flex items-center justify-center text-[13px] font-bold text-white"
             style={{ background: `linear-gradient(135deg, ${accent}, ${primary})`, borderRadius: 14 }}>
          {heroTitle}
        </div>
        {device === "mobile" ? (
          <div className="mt-5 overflow-x-auto">
            <div className="flex gap-5 w-max pr-5">
              <Card label="Producto 1" width={260} />
              <Card label="Producto 2" width={260} />
              <Card label="Producto 3" width={260} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5 mt-5">
            <Card label="Producto 1" />
            <Card label="Producto 2" />
            <Card label="Producto 3" />
          </div>
        )}
      </div>
    </div>
  );
}
