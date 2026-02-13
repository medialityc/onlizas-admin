"use client";

import React from "react";
import type { TemplateProps } from "./template-modern";

export default function TemplateMinimal({ primary, secondary, accent, heroTitle, device, fontFamily }: TemplateProps) {
  const Card = ({ label, width }: { label: string; width?: number }) => (
    <div
      className="bg-neutral-50 text-center text-[10px] h-16 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
      style={{ borderRadius: 14, width, color: secondary }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ fontFamily }} className="bg-white">
      {/* Glass Header */}
      <div
        className="px-4 py-3 text-[13px] font-semibold tracking-tight border-b border-neutral-200/60"
        style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", color: primary, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        TechStore Premium
      </div>

      {/* Hero with gradient bg */}
      <div className="p-4" style={{ background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)" }}>
        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="space-y-2">
            <span
              className="inline-block text-[8px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${primary}15`, color: primary }}
            >
              Nueva Colección
            </span>
            <p className="text-[11px] font-semibold tracking-tight text-neutral-900 leading-tight">
              {heroTitle}
            </p>
            <div
              className="inline-flex items-center text-[8px] font-medium text-white px-3 py-1 rounded-full shadow-sm"
              style={{ background: `linear-gradient(135deg, ${primary}, ${primary}cc)` }}
            >
              Descubrir →
            </div>
          </div>
          <div
            className="h-20 rounded-xl shadow-lg overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${accent}40, ${primary}30)` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {["128 Productos", "1.2k Seguidores", "890 Pedidos"].map((stat) => (
            <div key={stat} className="text-center py-2 rounded-xl bg-white/60 border border-neutral-100/80 shadow-sm">
              <p className="text-[9px] font-medium text-neutral-500">{stat}</p>
            </div>
          ))}
        </div>

        {/* Product Cards */}
        {device === "mobile" ? (
          <div className="mt-4 overflow-x-auto">
            <div className="flex gap-3 w-max pr-3">
              <Card label="Producto 1" width={180} />
              <Card label="Producto 2" width={180} />
              <Card label="Producto 3" width={180} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Card label="Producto 1" />
            <Card label="Producto 2" />
            <Card label="Producto 3" />
          </div>
        )}
      </div>
    </div>
  );
}
