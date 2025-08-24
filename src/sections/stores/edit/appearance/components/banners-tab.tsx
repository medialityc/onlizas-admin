"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";
import MetricStatCard from "../../components/metric-stat-card";
import { EyeIcon, TvIcon, TrashIcon, PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import BannerCreateModal from "./banner-create-modal";
import { BannerItem, mockBanners } from "./banners-mock";

export default function BannersTab() {
  const { register, setValue, getValues } = useFormContext();
  // Preferir datos existentes del formulario si están presentes; si no, inicializar con store/mock
  const initial = (getValues("banners") as any[])?.length
    ? (getValues("banners") as any[]).map((b: any, idx) => ({
        id: idx + 1,
        title: b.title,
        url: b.urlDestinity ?? b.url ?? "",
        position: b.position ?? "hero",
        startDate: b.initDate ?? null,
        endDate: b.endDate ?? null,
        image: b.image ?? null,
        isActive: true,
      }))
    : mockBanners;
  const [items, setItems] = useState<BannerItem[]>(initial);
  const [open, setOpen] = useState(false);
  const [source] = useState<string>((getValues("banners") as any[])?.length ? "form" : "mock");

  // Register virtual field under appearance to sync into global form
  useEffect(() => {
    register("banners");
  }, [register]);

  useEffect(() => {
    // Map to backend contract keys
  const payload = items.map((b) => ({
      title: b.title,
  urlDestinity: b.url || "",
  position: b.position || "",
  initDate: b.startDate || "",
  endDate: b.endDate || "",
  image: typeof b.image === "string" ? b.image : b.image ? (b.image as File).name : "",
    }));
  setValue("banners", payload, { shouldDirty: true });
  }, [items, setValue]);

  const metrics = useMemo(() => {
    const total = items.length;
    const active = items.filter((x) => x.isActive).length;
    const positions = new Set(items.map((x) => x.position)).size;
    return { total, active, positions };
  }, [items]);

  return (
    <div className="space-y-4">
  {/* Indicador simple de fuente de datos para debugging */}
  <div className="text-xs text-gray-500">Fuente: {source === "form" ? "Formulario" : "Mock"}</div>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricStatCard label="Total Banners" value={metrics.total} icon={<PlusIcon className="text-indigo-600" />} />
        <MetricStatCard label="Banners Activos" value={metrics.active} icon={<EyeIcon className="text-emerald-600" />} />
        <MetricStatCard label="Posiciones" value={metrics.positions} icon={<TvIcon className="text-violet-600" />} />
      </div>

  <Header onNew={() => setOpen(true)} />

      {/* List */}
      <div className="space-y-3">
        {items.map((b) => (
          <BannerRow key={b.id} b={b} onToggle={(id) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, isActive: !x.isActive } : x)))} onDelete={(id) => setItems((prev) => prev.filter((x) => x.id !== id))} />
        ))}
      </div>

      <BannerCreateModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(banner) => {
          const toISO = (d?: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : null);
          setItems((prev) => [
            {
              id: Math.max(0, ...prev.map((x) => x.id)) + 1,
              title: banner.title,
              url: banner.url,
              position: banner.position,
              startDate: toISO(banner.startDate),
              endDate: toISO(banner.endDate),
              image: banner.image ?? null,
              isActive: banner.isActive ?? true,
            },
            ...prev,
          ]);
          setOpen(false);
        }}
      />
    </div>
  );
}

function Header({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex items-center justify-between mt-2">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Gestión de Banners</h3>
        <p className="text-xs text-gray-500">Crea y gestiona banners promocionales para tu tienda</p>
      </div>
      <button
        type="button"
        onClick={onNew}
        className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white text-xs font-medium px-3 py-2 hover:bg-gray-800"
      >
        <PlusIcon className="w-4 h-4" />
        Nuevo Banner
      </button>
    </div>
  );
}

function BannerRow({ b, onToggle, onDelete }: { b: BannerItem; onToggle: (id: number) => void; onDelete: (id: number) => void }) {
  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-300">🖼️</div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-gray-900">{b.title}</div>
                {b.isActive && (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    Activo
                  </span>
                )}
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 ring-1 ring-inset ring-gray-600/10">
                  {b.position}
                </span>
              </div>
              <div className="text-xs text-gray-500">{b.url}</div>
              {(b.startDate || b.endDate) && (
                <div className="text-xs text-gray-400 mt-0.5">
                  {b.startDate || ""} {b.endDate ? `- ${b.endDate}` : ""}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggle */}
            <button
              type="button"
              aria-label="Cambiar estado"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${b.isActive ? "bg-gradient-to-r from-secondary to-indigo-600" : "bg-gray-300"}`}
              onClick={() => onToggle(b.id)}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${b.isActive ? "translate-x-5" : "translate-x-1"}`} />
            </button>
            <button className="text-gray-500 hover:text-gray-700" aria-label="Editar" onClick={() => { /* TODO */ }}>
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            <button
              className="text-gray-500 hover:text-gray-700"
              aria-label="Eliminar"
              onClick={() => onDelete(b.id)}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
