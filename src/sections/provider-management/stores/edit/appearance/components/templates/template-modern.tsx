"use client";

import React from "react";

export type TemplateProps = {
  primary: string;
  secondary: string;
  accent: string;
  heroTitle: string;
  device: "desktop" | "tablet" | "mobile";
  fontFamily: string;
};

export default function TemplateModern({ primary, secondary, accent, heroTitle, device, fontFamily }: TemplateProps) {
  const cardRadius = 12;
  const Card = ({ label, width }: { label: string; width?: number }) => (
    <div
      className="border border-gray-200 rounded bg-white text-center text-[12px] h-20 flex items-center justify-center shadow"
      style={{ borderRadius: cardRadius, width }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ fontFamily }}>
  <div className="px-4 py-3 text-white text-sm font-semibold" style={{ background: `linear-gradient(90deg, ${primary}, ${primary}CC)`, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        TechStore Premium
      </div>
      <div className="p-4">
        <div className="h-24 md:h-28 flex items-center justify-center text-[13px] font-medium text-white" style={{ background: accent, borderRadius: 8 }}>
          {heroTitle}
        </div>

        {device === "mobile" ? (
          <div className="mt-4 overflow-x-auto">
            <div className="flex gap-4 w-max pr-4" style={{ color: secondary , fontFamily:fontFamily}}>
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
