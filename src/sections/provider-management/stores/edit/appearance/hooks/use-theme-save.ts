import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Store } from "@/types/stores";
import { ThemeSchema, type ThemeForm, DEFAULT_THEME } from "../theme/schemas/theme-schema";

interface UseThemeSaveProps {
  store: Store;
}

export function useThemeSave({ store }: UseThemeSaveProps) {
  const methods = useForm<ThemeForm>({
    resolver: zodResolver(ThemeSchema),
    mode: "onBlur",
    defaultValues: {
      primaryColor: store.primaryColor ?? DEFAULT_THEME.primaryColor,
      secondaryColor: store.secondaryColor ?? DEFAULT_THEME.secondaryColor,
      accentColor: store.accentColor ?? DEFAULT_THEME.accentColor,
      font: (store.font as ThemeForm['font']) ?? DEFAULT_THEME.font,
      template: (store.template as ThemeForm['template']) ?? DEFAULT_THEME.template,
    },
  });

  const onSubmit = async (data: ThemeForm) => {
    try {
      console.log("Guardando tema y colores:", data);     
      
      toast.success("Tema y colores actualizados correctamente");
      
      return { success: true };
    } catch (error) {
      console.error("Error al guardar tema:", error);
      toast.error("Error al guardar el tema y colores");
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
