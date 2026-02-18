"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import BannerCreateModal from "./banner-create-modal";
import BannerMetrics from "./banner-metrics";
import BannerHeader from "./banner-header";
import BannersList from "./banners-list";
import { getPositionLabel } from "./banner-utils";
import { AppearanceFormData } from "../schemas/appearance-schema";
import { useBanners } from "../hooks/use-banners";

interface BannersTabProps {
  storeId: number | string;
}

export default function BannersTab({ storeId }: BannersTabProps) {
  const { register, setValue, getValues } =
    useFormContext<AppearanceFormData>();

  // Solo usar datos del formulario (backend) o array vacío
  const backendBanners = getValues("banners") || [];

  // Register virtual field under appearance to sync into global form
  // useEffect(() => {
  //   register("banners");
  // }, [register]);

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
  } = useBanners({ backendBanners, setValue, storeId });

  // Calcular métricas
  const metrics = useMemo(() => {
    const total = items.length;
    const active = items.filter((x) => x.active).length;
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
