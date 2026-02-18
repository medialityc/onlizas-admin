import React from "react";
import type { UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";

import { BannerForm } from "../banners/banner-schema";

import { BannerItem } from "../../../../../../types/stores";
import type { AppearanceFormData } from "../schemas/appearance-schema";
import { createBannersStore, updateBannersStore } from "@/services/stores";
import { buildBannersFormData } from "../utils/appearance-form-data";
import { normalizePosition, createTempBannerId } from "../banners/banner-utils";

// Banner que llega desde el backend/form principal
export interface BackendBanner {
  id?: string | number;
  title?: string;
  urlDestinity?: string;
  position?: string | number;
  initDate?: string;
  endDate?: string;
  desktopImage?: File | string | null;
  mobileImage?: File | string | null;
  active?: boolean;
}

interface UseBannersProps {
  backendBanners?: BackendBanner[];
  setValue: UseFormSetValue<AppearanceFormData>;
  storeId: number | string;
}

export function useBanners({
  backendBanners,
  setValue,
  storeId,
}: UseBannersProps) {
  const [items, setItems] = React.useState<BannerItem[]>([]);
  const [editingBanner, setEditingBanner] = React.useState<BannerItem | null>(
    null,
  );
  const [open, setOpen] = React.useState(false);
  const initializedRef = React.useRef(false);
  // Inicializar banners desde el backend
  React.useEffect(() => {
    if (
      backendBanners &&
      backendBanners.length > 0 &&
      !initializedRef.current
    ) {
      initializedRef.current = true;
      const toNumberPosition = (pos: string | number | undefined): number => {
        if (typeof pos === "number" && Number.isFinite(pos)) return pos;
        if (typeof pos === "string") {
          const trimmed = pos.trim().toLowerCase();
          if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
          if (trimmed === "hero") return 0;
          if (trimmed === "sidebar") return 1;
          if (trimmed === "footer") return 2;
        }
        return 1;
      };

      const initial = backendBanners.map(
        (b): BannerItem => ({
          id: typeof b.id === "number" ? b.id : b.id, // Mantener ID del backend
          title: b.title ?? "",
          urlDestinity: b.urlDestinity ?? "",
          position: toNumberPosition(b.position),
          initDate: b.initDate,
          endDate: b.endDate,
          desktopImage: b.desktopImage,
          mobileImage: b.mobileImage,
          active: b.active ?? true,
        }),
      );
      setItems(initial);
    }
  }, [backendBanners]);

  // Sincronizar con el formulario principal
  React.useEffect(() => {
    const payload = items.map((b) => ({
      id: b.id,
      title: b.title ?? "",
      urlDestinity: b.urlDestinity ?? "",
      position:
        typeof b.position === "string" ? parseInt(b.position, 10) : b.position,
      initDate: b.initDate ?? "",
      endDate: b.endDate ?? "",
      desktopImage: b.desktopImage,
      mobileImage: b.mobileImage,
      active: b.active,
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

  const syncFromStoreBanners = (storeBanners?: any[]) => {
    if (!storeBanners || storeBanners.length === 0) {
      setItems([]);
      return;
    }

    const mapped: BannerItem[] = storeBanners.map((b: any) => ({
      id: b.id,
      title: b.title ?? "",
      urlDestinity: b.urlDestinity ?? "",
      position: normalizePosition(b.position),
      initDate: b.initDate ?? null,
      endDate: b.endDate ?? null,
      desktopImage: b.desktopImage ?? "",
      mobileImage: b.mobileImage ?? "",
      active: (b as any).active ?? true,
    }));

    setItems(mapped);
  };

  const handleCreateBanner = async (
    banner: BannerForm,
  ): Promise<{ success: boolean }> => {
    try {
      const payload: any = {
        title: banner.title,
        urlDestinity: banner.urlDestinity,
        position: Number(banner.position),
        initDate: banner.initDate.toISOString(),
        endDate: banner.endDate.toISOString(),
        desktopImage: banner.desktopImage,
        mobileImage: banner.mobileImage,
        active: banner.active ?? true,
      };

      const formData = await buildBannersFormData({
        banners: [payload],
        storeId,
        isUpdate: false,
      });

      const response = await createBannersStore(formData);

      if (response.error) {
        throw new Error(response.message || "Error al crear banner");
      }

      const updatedStore: any = response.data;

      // Si el backend devuelve la tienda completa con banners actualizados, la usamos
      if (updatedStore && Array.isArray((updatedStore as any).banners)) {
        syncFromStoreBanners((updatedStore as any).banners as any[]);
      } else {
        // Si no hay lista completa de banners en la respuesta,
        // integramos el nuevo banner en la lista actual sin borrarla.
        const createdId =
          updatedStore && typeof (updatedStore as any).id !== "undefined"
            ? (updatedStore as any).id
            : createTempBannerId();

        const newItem: BannerItem = {
          id: createdId,
          title: (updatedStore as any)?.title ?? banner.title,
          urlDestinity:
            (updatedStore as any)?.urlDestinity ?? banner.urlDestinity,
          position: normalizePosition(
            (updatedStore as any)?.position ?? banner.position,
          ),
          initDate:
            (updatedStore as any)?.initDate ?? banner.initDate.toISOString(),
          endDate:
            (updatedStore as any)?.endDate ?? banner.endDate.toISOString(),
          desktopImage:
            (updatedStore as any)?.desktopImage ?? banner.desktopImage,
          mobileImage: (updatedStore as any)?.mobileImage ?? banner.mobileImage,
          active: (updatedStore as any)?.active ?? banner.active ?? true,
        };

        setItems((prev) => [...prev, newItem]);
      }

      toast.success("Banner creado correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error desconocido al crear el banner";
      toast.error(`Error al crear el banner: ${message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      return { success: false };
    }
  };

  const handleUpdateBanner = async (
    id: string | number,
    banner: BannerForm,
  ): Promise<{ success: boolean }> => {
    try {
      const payload: any = {
        id,
        title: banner.title,
        urlDestinity: banner.urlDestinity,
        position: Number(banner.position),
        initDate: banner.initDate.toISOString(),
        endDate: banner.endDate.toISOString(),
        desktopImage: banner.desktopImage,
        mobileImage: banner.mobileImage,
        active: banner.active ?? true,
      };

      const formData = await buildBannersFormData({
        banners: [payload],
        isUpdate: true,
      });

      const response = await updateBannersStore(formData);

      if (response.error) {
        throw new Error(response.message || "Error al actualizar banner");
      }

      const updatedStore: any = response.data;

      // Si el backend devuelve la tienda con banners, sincronizamos desde ahí
      if (updatedStore && Array.isArray((updatedStore as any).banners)) {
        syncFromStoreBanners((updatedStore as any).banners as any[]);
      } else {
        // Si no hay lista completa, actualizamos solo el banner editado en memoria
        setItems((prev) =>
          prev.map((item) => {
            if (item.id !== id) return item;

            return {
              ...item,
              title: (updatedStore as any)?.title ?? banner.title,
              urlDestinity:
                (updatedStore as any)?.urlDestinity ?? banner.urlDestinity,
              position: normalizePosition(
                (updatedStore as any)?.position ?? banner.position,
              ),
              initDate:
                (updatedStore as any)?.initDate ??
                banner.initDate.toISOString(),
              endDate:
                (updatedStore as any)?.endDate ?? banner.endDate.toISOString(),
              desktopImage:
                (updatedStore as any)?.desktopImage ?? banner.desktopImage,
              mobileImage:
                (updatedStore as any)?.mobileImage ?? banner.mobileImage,
              active: (updatedStore as any)?.active ?? banner.active ?? true,
            } as BannerItem;
          }),
        );
      }

      toast.success("Banner actualizado correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error desconocido al actualizar el banner";
      toast.error(`Error al actualizar el banner: ${message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      return { success: false };
    }
  };

  const handleToggleBanner = (id: string | number) => {
    void (async () => {
      const current = items.find((x) => x.id === id);
      if (!current) return;

      // Optimistic update
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x)),
      );

      try {
        const payload: any = {
          id,
          title: current.title,
          urlDestinity: current.urlDestinity,
          position:
            typeof current.position === "number"
              ? current.position
              : parseInt(String(current.position), 10),
          initDate: current.initDate ?? undefined,
          endDate: current.endDate ?? undefined,
          desktopImage: current.desktopImage,
          mobileImage: current.mobileImage,
          active: !current.active,
        };

        const formData = await buildBannersFormData({
          banners: [payload],
          isUpdate: true,
        });

        const response = await updateBannersStore(formData);

        if (response.error) {
          throw new Error(
            response.message || "Error al actualizar estado del banner",
          );
        }

        const updatedStore: any = response.data;

        // Si hay lista completa de banners, sincronizamos; si no, mantenemos el update optimista
        if (updatedStore && Array.isArray((updatedStore as any).banners)) {
          syncFromStoreBanners((updatedStore as any).banners as any[]);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error desconocido al actualizar el banner";
        toast.error(`Error al cambiar el estado del banner: ${message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    })();
  };

  const handleDeleteBanner = (id: string | number) => {
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
