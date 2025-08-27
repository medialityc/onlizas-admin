"use client";

import React, { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { StoreEditFormData } from "../../../modals/store-edit-form.schema";
import BannerCreateModal from "./banner-create-modal";
import BannerMetrics from "./banner-metrics";
import BannerHeader from "./banner-header";
import BannersList from "./banners-list";
import { getPositionLabel } from "./banner-utils";
import { useBanners } from "./use-banners";

export default function BannersTab() {
  const { register, setValue, getValues } = useFormContext<StoreEditFormData>();

  // Tipar correctamente los banners del backend
  interface BackendBanner {
    id?: number;
    title: string;
    urlDestinity: string;
    position: string | number;
    initDate: string;
    endDate: string;
    image: string;
  }

  // Solo usar datos del formulario (backend) o array vacío, NO usar mock
  const backendBanners = getValues("banners") as BackendBanner[] | undefined;

  // Register virtual field under appearance to sync into global form
  useEffect(() => {
    register("banners");
  }, [register]);

  // Hook personalizado para manejar banners
  const {
    items,
    editingBanner,
    open,
    handleNewBanner,
    handleEditBanner,
    handleCloseModal,
    handleCreateBanner,
    handleUpdateBanner,
    handleToggleBanner,
    handleDeleteBanner,
  } = useBanners({ backendBanners, setValue });

  // Calcular métricas
  const metrics = useMemo(() => {
    const total = items.length;
    const active = items.filter((x) => x.isActive).length;
    const positions = new Set(items.map((x) => x.position)).size;
    return { total, active, positions };
  }, [items]);

  return (
    <div className="space-y-4">
      <BannerMetrics 
        total={metrics.total}
        active={metrics.active}
        positions={metrics.positions}
      />

      <BannerHeader onNew={handleNewBanner} />

      <BannersList
        banners={items}
        getPositionLabel={getPositionLabel}
        onToggle={handleToggleBanner}
        onDelete={handleDeleteBanner}
        onEdit={handleEditBanner}
      />

      <BannerCreateModal
        open={open}
        onClose={handleCloseModal}
        onCreate={handleCreateBanner}
        onUpdate={handleUpdateBanner}
        editingBanner={editingBanner}
      />
    </div>
  );
}
