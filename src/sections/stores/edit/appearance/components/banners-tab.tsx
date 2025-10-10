"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cards/card";
import MetricStatCard from "../../components/metric-stat-card";
import { EyeIcon, TvIcon, TrashIcon, PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import HomeBannerCreateModal from "./banner-create-modal";
import { HomeBannerItem, mockHomeBanners } from "./banners-mock";

export default function HomeBannersTab() {
  const { register, setValue, getValues } = useFormContext();
  // Preferir datos existentes del formulario si están presentes; si no, inicializar con store/mock
  const initial = (getValues("banners") as any[])?.length
    ? (getValues("banners") as any[]).map((b: any, idx) => ({
        id: idx + 1,
        title: b.title,
        url: b.urlDestinity ?? b.url ?? "",
        position: typeof b.position === "number" ? b.position : parseInt(b.position ?? "0", 10) || 0,
        startDate: b.initDate ?? null,
        endDate: b.endDate ?? null,
        image: b.image ?? null,
        active: true,
      }))
    : mockHomeBanners;
  const [items, setItems] = useState<HomeBannerItem[]>(initial);
  const [open, setOpen] = useState(false);
  const [source] = useState<string>((getValues("banners") as any[])?.length ? "form" : "mock");

  // Register virtual field under appearance to sync into global form
  useEffect(() => {
    register("banners");
  }, [register]);

  useEffect(() => {
    // Map to backend contract keys with correct types
    const toISO = (d?: string | null) => (d ? d : "");
    const payload = items.map((b) => ({
      title: b.title,
      urlDestinity: b.url || "",
      position: Number.isFinite(b.position as any) ? Number(b.position) : 0,
      initDate: toISO(b.startDate),
      endDate: toISO(b.endDate),
      image:
        typeof b.image === "string"
          ? b.image
          : b.image
          ? (b.image as File).name
          : "",
    }));
    setValue("banners", payload, { shouldDirty: true });
  }, [items, setValue]);

  const metrics = useMemo(() => {
    const total = items.length;
    const active = items.filter((x) => x.active).length;
    const positions = new Set(items.map((x) => x.position)).size;
    return { total, active, positions };
  }, [items]);

  return (
    <div className="space-y-4">
  {/* Indicador simple de fuente de datos para debugging */}
  <div className="text-xs text-gray-500">Fuente: {source === "form" ? "Formulario" : "Mock"}</div>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricStatCard label="Total HomeBanners" value={metrics.total} icon={<PlusIcon className="text-indigo-600" />} />
        <MetricStatCard label="HomeBanners Activos" value={metrics.active} icon={<EyeIcon className="text-emerald-600" />} />
        <MetricStatCard label="Posiciones" value={metrics.positions} icon={<TvIcon className="text-violet-600" />} />
      </div>

  <Header onNew={() => setOpen(true)} />

      {/* List */}
      <div className="space-y-3">
        {items.map((b) => (
          <HomeBannerRow key={b.id} b={b} onToggle={(id) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x)))} onDelete={(id) => setItems((prev) => prev.filter((x) => x.id !== id))} />
        ))}
      </div>

      <HomeBannerCreateModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(banner) => {
          const toISO = (d?: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : null);
          setItems((prev) => [
            {
              id: Math.max(0, ...prev.map((x) => x.id)) + 1,
              title: banner.title,
              url: banner.url,
              position: Number(banner.position),
              startDate: toISO(banner.startDate),
              endDate: toISO(banner.endDate),
              image: banner.image ?? null,
              active: banner.active ?? true,
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
        <h3 className="text-sm font-medium text-gray-900">Gestión de HomeBanners</h3>
        <p className="text-xs text-gray-500">Crea y gestiona banners promocionales para tu tienda</p>
      </div>
      <button
        type="button"
        onClick={onNew}
        className="inline-flex items-center gap-2 rounded-md bg-gray-900 text-white text-xs font-medium px-3 py-2 hover:bg-gray-800"
      >
        <PlusIcon className="w-4 h-4" />
        Nuevo HomeBanner
      </button>
    </div>
  );
}

function HomeBannerRow({ b, onToggle, onDelete }: { b: HomeBannerItem; onToggle: (id: number) => void; onDelete: (id: number) => void }) {
  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-300">🖼️</div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-gray-900">{b.title}</div>
                {b.active && (
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${b.active ? "bg-gradient-to-r from-secondary to-indigo-600" : "bg-gray-300"}`}
              onClick={() => onToggle(b.id)}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${b.active ? "translate-x-5" : "translate-x-1"}`} />
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
