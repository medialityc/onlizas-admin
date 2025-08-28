"use client";

import React from "react";
import type { TemplateProps } from "./template-modern";

export default function TemplateClassic({ primary, secondary, accent, heroTitle, device, fontFamily }: TemplateProps) {
  const cardRadius = 0;
  const Card = ({ label, width }: { label: string; width?: number }) => (
    <div
      className="border border-gray-500 bg-white text-center text-[11px] h-20 flex items-center justify-center shadow-sm tracking-wide"
      style={{ borderRadius: cardRadius, width }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ fontFamily }}>
      <div className="px-4 py-3 text-white text-sm font-semibold uppercase tracking-wide" style={{ background: primary }}>
        NameStore
      </div>
      <div className="p-4">
        <div className="h-28 md:h-32 flex items-center justify-center text-[12px] font-semibold text-white" style={{ background: accent, borderRadius: 0, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.2)' }}>
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
