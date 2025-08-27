
import React from "react";
import type { UseFormSetValue } from "react-hook-form";

import { BannerForm } from "./banner-schema";

import { BannerItem } from "@/types/stores";
import type { StoreEditFormData } from "../../../modals/store-edit-form.schema";

// Banner que llega desde el backend/form principal
export interface BackendBanner {
  id?: number;
  title: string;
  urlDestinity: string;
  position: string | number;
  initDate?: string;
  endDate?: string;
  image?: File | string;
}

interface UseBannersProps {
  backendBanners?: BackendBanner[];
  setValue: UseFormSetValue<StoreEditFormData>;
}

export function useBanners({ backendBanners, setValue }: UseBannersProps) {
  const [items, setItems] = React.useState<BannerItem[]>([]);
  const [editingBanner, setEditingBanner] = React.useState<BannerItem | null>(null);
  const [open, setOpen] = React.useState(false);

  // Inicializar banners desde el backend
  React.useEffect(() => {
    if (backendBanners && backendBanners.length > 0) {
      const toNumberPosition = (pos: string | number): number => {
        if (typeof pos === "number") return pos;
        const trimmed = pos.trim().toLowerCase();
        if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
        if (trimmed === "hero") return 1;
        if (trimmed === "sidebar") return 2;
        if (trimmed === "slideshow") return 3;
        return 1;
      };

      const initial = backendBanners.map((b, idx): BannerItem => ({
        id: typeof b.id === "number" ? b.id : idx + 1,
        title: b.title,
        urlDestinity: b.urlDestinity ?? "",
        position: toNumberPosition(b.position),
        initDate: b.initDate,
        endDate: b.endDate,
        image: b.image,
        isActive: true,
      }));
      setItems(initial);
    }
  }, [backendBanners]);

  // Sincronizar con el formulario principal
  React.useEffect(() => {
    const payload = items.map((b) => ({
      id: b.id,
      title: b.title ?? "",
      urlDestinity: b.urlDestinity ?? "",
      position: typeof b.position === "string" ? parseInt(b.position, 10) : b.position,
      initDate: b.initDate ?? "",
      endDate: b.endDate ?? "",
      
      image: (b.image instanceof File || typeof b.image === "string") ? b.image : null,
      isActive: b.isActive,
    }));
    setValue("banners", payload, { shouldDirty: true });
  }, [items, setValue]);

  const handleNewBanner = () => {

    setEditingBanner(null);
    setOpen(true);
  };

  const handleEditBanner = (banner: BannerItem) => {

    setEditingBanner(banner);
    setOpen(true);

  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingBanner(null);
  };

  const handleCreateBanner = (banner: BannerForm) => {


    const newBanner = {
      id: Math.max(0, ...items.map((x) => x.id)) + 1,
      title: banner.title,
      urlDestinity: banner.urlDestinity,
      position: Number(banner.position),
      initDate: banner.initDate.toISOString().split('T')[0], // Solo la fecha YYYY-MM-DD
      endDate: banner.endDate.toISOString().split('T')[0],   // Solo la fecha YYYY-MM-DD
      image: banner.image,
      isActive: banner.isActive ?? true,
    };


    setItems((prev) => [newBanner, ...prev]);
  };

  const handleUpdateBanner = (id: number, banner: BannerForm) => {

    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? {
            ...item,
            title: banner.title,
            urlDestinity: banner.urlDestinity,
            position: Number(banner.position),
            initDate: banner.initDate.toISOString().split('T')[0], // Solo la fecha YYYY-MM-DD
            endDate: banner.endDate.toISOString().split('T')[0],   // Solo la fecha YYYY-MM-DD
            // MANTENER imagen existente si no se cambió
            image: banner.image || item.image,
            isActive: banner.isActive ?? true,
          }
          : item
      );
      
      return updated;
    });
  };

  const handleToggleBanner = (id: number) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, isActive: !x.isActive } : x)));
  };

  const handleDeleteBanner = (id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return {
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
  };
}
