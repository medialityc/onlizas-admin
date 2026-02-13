"use client";

import React from "react";
import type { TemplateProps } from "./template-modern";

export default function TemplateClassic({ primary, secondary, accent, heroTitle, device, fontFamily }: TemplateProps) {
  const Card = ({ label, width }: { label: string; width?: number }) => (
    <div
      className="bg-white text-center text-[10px] h-20 flex items-center justify-center border border-stone-200 hover:shadow-md transition-shadow"
      style={{ width, color: primary, fontFamily: "Georgia, serif" }}
    >
      <div>
        <p className="font-serif font-semibold text-[10px]">{label}</p>
        <p className="text-[8px] text-stone-400 mt-0.5">$29.99</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily }} className="bg-stone-50/50">
      {/* Top bar */}
      <div
        className="px-4 py-1.5 text-[8px] text-white/80 tracking-wide"
        style={{ backgroundColor: secondary }}
      >
        Envíos a todo el país
      </div>

      {/* Header with accent underline */}
      <div className="px-4 py-3 bg-white border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-sm border border-stone-200"
            style={{ background: `${primary}20` }}
          />
          <div>
            <p
              className="text-[12px] font-bold tracking-tight"
              style={{ color: primary, fontFamily: "Georgia, serif" }}
            >
              NameStore
            </p>
            <div className="flex items-center gap-1 mt-px">
              <div className="w-3 h-px" style={{ backgroundColor: accent }} />
              <p className="text-[7px] text-stone-400 tracking-widest uppercase">Tienda Oficial</p>
            </div>
          </div>
        </div>
        <div className="h-[1.5px] mt-2" style={{ backgroundColor: accent }} />
      </div>

      {/* Hero — full bleed with overlay */}
      <div className="relative h-28 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${primary}90, ${accent}70)` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-px bg-white/50" />
            <span className="text-[7px] text-white/70 tracking-widest uppercase">Colección</span>
          </div>
          <p className="text-[12px] font-bold text-white leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            {heroTitle}
          </p>
        </div>
      </div>

      <div className="p-4">
        {/* Stats with dividers */}
        <div className="flex justify-center items-center gap-4 py-3 mb-4">
          {["128", "1.2k", "890"].map((val, i) => (
            <React.Fragment key={val}>
              <div className="text-center">
                <p className="text-[11px] font-bold" style={{ color: primary, fontFamily: "Georgia, serif" }}>{val}</p>
                <p className="text-[7px] text-stone-400 tracking-wider uppercase">
                  {["Productos", "Seguidores", "Pedidos"][i]}
                </p>
              </div>
              {i < 2 && <div className="h-6 w-px bg-stone-200" />}
            </React.Fragment>
          ))}
        </div>

        {/* Section header */}
        <div className="text-center mb-3">
          <p className="text-[10px] font-bold" style={{ color: primary, fontFamily: "Georgia, serif" }}>
            Productos Destacados
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <div className="w-6 h-px bg-stone-300" />
            <div className="w-1 h-1 rotate-45" style={{ backgroundColor: accent }} />
            <div className="w-6 h-px bg-stone-300" />
          </div>
        </div>

        {/* Product Cards */}
        {device === "mobile" ? (
          <div className="overflow-x-auto">
            <div className="flex gap-3 w-max pr-3">
              <Card label="Producto 1" width={160} />
              <Card label="Producto 2" width={160} />
              <Card label="Producto 3" width={160} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <Card label="Producto 1" />
            <Card label="Producto 2" />
            <Card label="Producto 3" />
          </div>
        )}
      </div>
    </div>
  );
}
