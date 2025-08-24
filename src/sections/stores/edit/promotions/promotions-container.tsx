"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Promotion, Store } from "@/types/stores";
import { GiftIcon, UsersIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

import MetricStatCard from "../components/metric-stat-card";
import PromotionsToolbar from "./components/toolbar";
import PromotionRow from "./components/promotion-row";
import { mockPromotions } from "./mock";
import CreatePromotionModal from "./components/create-promotion-modal";

interface Props { store: Store }

export default function PromotionsContainer({ store }: Props) {
  const [open, setOpen] = useState(false);
  const { register, setValue, getValues } = useFormContext();
  const initial = (getValues("promotionsPayload") as any[])?.length
    ? (getValues("promotionsPayload") as any[])
    : mockPromotions;
  const [items, setItems] = useState<Promotion[]>(initial);
  const [source] = useState<string>((getValues("promotionsPayload") as any[])?.length ? "form" : "mock");

  
  useEffect(() => {
    register("promotionsPayload");
  }, [register]);

  useEffect(() => {
    setValue("promotionsPayload", items, { shouldDirty: true });
  }, [items, setValue]);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((x) => x.isActive).length;
    const uses = items.reduce((acc, x) => acc + (x.usedCount ?? 0), 0);
    const expired = items.filter((x) => x.endDate && new Date(x.endDate) < new Date()).length;
    return { total, active, uses, expired };
  }, [items]);

  return (
    <div className="p-6">
  <div className="text-xs text-gray-500 mb-2">Fuente: {source === "form" ? "Formulario" : "Mock"}</div>
      {/* Breadcrumb/title area could be outside - kept minimal here */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <MetricStatCard label="Total Promociones" value={stats.total} icon={<GiftIcon className="text-indigo-600" />} />
        <MetricStatCard label="Promociones Activas" value={stats.active} icon={<GiftIcon className="text-emerald-600" />} />
        <MetricStatCard label="Usos Totales" value={stats.uses} icon={<UsersIcon className="text-violet-600" />} />
        <MetricStatCard label="Promociones Vencidas" value={stats.expired} icon={<CalendarDaysIcon className="text-rose-600" />} />
      </div>

      <PromotionsToolbar onNew={() => setOpen(true)} />

      {/* Filters tabs placeholder */}
      <div className="flex gap-3 text-xs text-gray-600 mb-3">
        <button className="px-2 py-1 rounded bg-gray-100">Todas</button>
        <button className="px-2 py-1 rounded">Activas</button>
        <button className="px-2 py-1 rounded">Inactivas</button>
        <button className="px-2 py-1 rounded">Vencidas</button>
      </div>

      <div className="space-y-3">
        {items.map((p) => (
          <PromotionRow
            key={p.id}
            p={p}
            onToggle={(id, checked) =>
              setItems((prev) => prev.map((x) => (x.id === id ? { ...x, isActive: checked } : x)))
            }
          />
        ))}
      </div>

      <CreatePromotionModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(p) => setItems((prev) => [p, ...prev])}
      />
    </div>
  );
}
