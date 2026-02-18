import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Store } from "@/types/stores";
import { DEFAULT_APPEARANCE } from "../schemas/appearance-schema";
import { updateSupplierStore } from "@/services/stores";
import { buildThemeFormData } from "../utils/appearance-form-data";
import { normalizePosition } from "../banners/banner-utils";

interface UseAppearanceSaveProps {
  store: Store;
}

export function useAppearanceSave({ store }: UseAppearanceSaveProps) {
  // Normalizar banners del store para que coincidan con el schema
  const normalizeBanners = (banners: any[]) => {
    return banners.map((b) => ({
      ...b,
      position:
        typeof b.position === "string"
          ? normalizePosition(b.position)
          : b.position,
      desktopImage: b.desktopImage || "",
      mobileImage: b.mobileImage || "",
    }));
  };

  const methods = useForm<any>({
    // Tipo simple para evitar conflictos
    mode: "onBlur",
    defaultValues: {
      // Tema y colores desde store
      primaryColor: store.primaryColor ?? DEFAULT_APPEARANCE.primaryColor,
      secondaryColor: store.secondaryColor ?? DEFAULT_APPEARANCE.secondaryColor,
      accentColor: store.accentColor ?? DEFAULT_APPEARANCE.accentColor,
      font: store.font ?? DEFAULT_APPEARANCE.font,
      template: store.template ?? DEFAULT_APPEARANCE.template,

      // Banners desde store, normalizados
      banners: store.banners
        ? normalizeBanners(store.banners)
        : DEFAULT_APPEARANCE.banners,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // Guardar solo tema y colores (los banners se gestionan de forma independiente)
      const themeFormData = buildThemeFormData({ store, data });
      const themeResponse = await updateSupplierStore(store.id, themeFormData);

      if (themeResponse.error) {
        throw new Error(
          themeResponse.message || "Error al guardar tema y colores",
        );
      }

      toast.success("Tema y colores actualizados correctamente", {
        position: "top-right",
        autoClose: 3000,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error al guardar la apariencia: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
      });
      return { success: false, error };
    }
  };

  return {
    methods,
    onSubmit,
    isLoading: methods.formState.isSubmitting,
    isDirty: methods.formState.isDirty,
  };
}
