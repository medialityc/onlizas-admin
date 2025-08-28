"use client";

import { useState, useEffect } from "react";

import { BannerForm } from "../banners/banner-schema";
import { BannerItem } from '../../../../../../types/stores';

interface BackendBanner {
  id?: number;
  title: string;
  urlDestinity: string;
  position: string | number;
  initDate: string;
  endDate: string;
  image: string;
}

interface UseBannersParams {
  backendBanners: BackendBanner[] | undefined;
  setValue: (name: string, value: any, options?: any) => void;
}

const normalizePosition = (pos: unknown): number => {
  if (typeof pos === "number" && Number.isFinite(pos)) return pos;
  if (typeof pos === "string") {
    const num = parseInt(pos, 10);
    if (!Number.isNaN(num) && Number.isFinite(num)) return num;
    
    const normalized = pos.toLowerCase().trim();
    if (normalized === "hero" || normalized === "1") return 1;
    if (normalized === "sidebar" || normalized === "2") return 2;
    if (normalized === "slideshow" || normalized === "3") return 3;
  }
  return 1;
};

export function useBanners({ backendBanners, setValue }: UseBannersParams) {
  // Estado para el modal
  const [open, setOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  // Estado para los banners
  const initial = backendBanners?.length
    ? backendBanners.map((b, idx) => ({
        id: typeof b.id === "number" ? b.id : idx + 1,
        title: b.title,
        urlDestinity: b.urlDestinity ?? "",
        position: normalizePosition(b.position),
        initDate: b.initDate ?? null,
        endDate: b.endDate ?? null,
        image: b.image ?? null,
        isActive: true,
      }))
    : [];

  const [items, setItems] = useState<BannerItem[]>(initial);

  // Sincronizar con el formulario cada vez que cambian los items
  useEffect(() => {
    const payload = items.map((b) => ({
      id: b.id,
      title: b.title || "",
      urlDestinity: b.urlDestinity || "",
      position: Number.isFinite(b.position) ? Number(b.position) : 1,
      initDate: b.initDate || "",
      endDate: b.endDate || "",
      image: b.image,
      isActive:b.isActive??true
    }));
    setValue("banners", payload, { shouldDirty: true });
  }, [items, setValue]);

  // Funciones del modal
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

  // Funciones de CRUD
  const handleCreateBanner = (banner: BannerForm) => {
    const toISO = (d?: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : null);
    
    setItems((prev) => [
      {
        //id: Math.max(0, ...prev.map((x) => x.id)) + 1,
        title: banner.title,
        urlDestinity: banner.urlDestinity,
        position: Number(banner.position),
        initDate: toISO(banner.initDate) as any,
        endDate: toISO(banner.endDate) as any,
        image: banner.image ?? null,
        isActive: banner.isActive ?? true,
      },
      ...prev,
    ]);
  };

  const handleUpdateBanner = (id:number,banner: BannerForm) => {
    if (!editingBanner) return;
    
    const toISO = (d?: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : null);
    
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: banner.title,
              urlDestinity: banner.urlDestinity,
              position: Number(banner.position),
              initDate: toISO(banner.initDate) as any,
              endDate: toISO(banner.endDate) as any,
              image: banner.image ?? item.image,
              isActive: banner.isActive ?? true,
            }
          : item
      )
    );
  };

  const handleToggleBanner = (id: number) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, isActive: !x.isActive } : x))
    );
  };

  const handleDeleteBanner = (id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return {
    items,
    open,
    editingBanner,
    handleNewBanner,
    handleEditBanner,
    handleCloseModal,
    handleCreateBanner,
    handleUpdateBanner,
    handleToggleBanner,
    handleDeleteBanner,
  };
}
