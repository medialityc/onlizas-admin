import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { BannerItem, Store } from "@/types/stores";
import { AppearanceSchema, type AppearanceFormData, DEFAULT_APPEARANCE } from "../schemas/appearance-schema";
import { updateSupplierStore, createBannersStore, updateBannersStore } from "@/services/stores";
import { buildThemeFormData, buildBannersFormData } from "../utils/appearance-form-data";
import { normalizePosition } from "../banners/banner-utils";

interface UseAppearanceSaveProps {
  store: Store;
}

export function useAppearanceSave({ store }: UseAppearanceSaveProps) {
  // Normalizar banners del store para que coincidan con el schema
  const normalizeBanners = (banners: any[]) => {
    return banners.map(b => ({
      ...b,
      position: typeof b.position === "string" ? normalizePosition(b.position) : b.position,
      desktopImage: b.desktopImage || "",
      mobileImage: b.mobileImage || "",
    }));
  };

  const methods = useForm<any>({ // Tipo simple para evitar conflictos
    mode: "onBlur",
    defaultValues: {
      // Tema y colores desde store
      primaryColor: store.primaryColor ?? DEFAULT_APPEARANCE.primaryColor,
      secondaryColor: store.secondaryColor ?? DEFAULT_APPEARANCE.secondaryColor,
      accentColor: store.accentColor ?? DEFAULT_APPEARANCE.accentColor,
      font: store.font ?? DEFAULT_APPEARANCE.font,
      template: store.template ?? DEFAULT_APPEARANCE.template,
      
      // Banners desde store, normalizados
      banners: store.banners ? normalizeBanners(store.banners) : DEFAULT_APPEARANCE.banners,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // 1. Siempre guardar tema y colores (incluso si no hay banners)
      const themeFormData = buildThemeFormData({ store, data });
      const themeResponse = await updateSupplierStore(store.id, themeFormData);
      
      if (themeResponse.error) {
        throw new Error(themeResponse.message || "Error al guardar tema y colores");
      }
      
      console.log("✅ Tema guardado correctamente");
      
      // 2. Guardar banners solo si existen y tienen contenido válido
      if (data.banners && data.banners.length > 0) {
        // 🔧 NORMALIZAR: Crear array limpio sin prototipos anidados
        const cleanBanners = Array.isArray(data.banners) 
          ? data.banners.map((b: any) => ({...b})) // Crear objetos limpios
          : [];
       
        // Filtrar banners válidos (con título y URL)
        const validBanners = cleanBanners.filter((b: any) => 
          b.title && b.title.trim() !== '' && 
          b.urlDestinity && b.urlDestinity.trim() !== ''
        );
       
        if (validBanners.length > 0) {
          // Separar banners nuevos y existentes
          const bannersToCreate = validBanners.filter((b: any) => !b.id || (typeof b.id === "number" && b.id < 0));
          const bannersToUpdate = validBanners.filter((b: any) => b.id && typeof b.id === "string");
          
          // Crear nuevos banners (solo los que tienen imagen nueva)
          if (bannersToCreate.length > 0) {
            // Heurística: si desktopImage es string, asumimos que proviene del backend (existente sin id)
            const fromBackendNoId = bannersToCreate.filter((b: BannerItem) => typeof b.desktopImage === "string");
            const toCreateWithImage = bannersToCreate.filter((b: BannerItem) => b.desktopImage instanceof File);
            const trulyMissingImage = bannersToCreate.filter((b: BannerItem) => b.desktopImage == null);

            if (trulyMissingImage.length > 0) {
              const list = trulyMissingImage.map((b: any) => b.title || `[pos ${b.position}]`).join(", ");
              console.warn("⏭️ Banners nuevos omitidos por no tener imagen:", trulyMissingImage);
              toast.info(`Se omitieron ${trulyMissingImage.length} banner(s) nuevos sin imagen: ${list}`, {
                position: "top-right",
                autoClose: 4000,
              });
            }

            if (toCreateWithImage.length > 0) {
              const createFormData = await buildBannersFormData({ 
                banners: toCreateWithImage, 
                storeId: store.id, // 🔧 SOLO para CREATE
                isUpdate: false
              });
              console.log("Create FormData being sent to backend");
              Array.from(createFormData.entries()).forEach(([key, value]) => {
                console.log(`${key}:`, value);
              });
  
              const createResponse = await createBannersStore(createFormData);
              
              if (createResponse.error) {
                throw new Error(createResponse.message || "Error al crear nuevos banners");
              }
              console.log("✅ Banners creados correctamente");
            }
          }
          
          // Actualizar banners existentes
          if (bannersToUpdate.length > 0) {
            console.log("Banners to update:", bannersToUpdate);
            const updateFormData = await buildBannersFormData({ 
              banners: bannersToUpdate,
              isUpdate: true
              // 🔧 NO storeId para UPDATE - ya tienen ID del backend
            });
            console.log("Update FormData being sent to backend");
            // Log the FormData contents (as much as possible)
            Array.from(updateFormData.entries()).forEach(([key, value]) => {
              console.log(`${key}:`, value);
            });
            const updateResponse = await updateBannersStore(updateFormData);
            
            if (updateResponse.error) {
              throw new Error(updateResponse.message || "Error al actualizar banners existentes");
            }
            console.log("✅ Banners actualizados correctamente");
          }
        }
      }
      
      toast.success("Apariencia actualizada correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
      
      return { success: true };
    } catch (error) {
      console.error("❌ Error al guardar apariencia:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
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