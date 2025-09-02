// Función para obtener el primer campo anidado con error
const getFirstErrorField = (
  errors: Record<string, any>,
  prefix = ""
): string | null => {
  for (const key in errors) {
    if (!errors.hasOwnProperty(key)) continue;
    const error = errors[key];
    const path = prefix ? `${prefix}.${key}` : key;
    if (error?.types || error?.message) return path;
    if (typeof error === "object") {
      const child = getFirstErrorField(error, path);
      if (child) return child;
    }
  }
  return null;
};

// Hace focus y scroll al primer campo con error
export const focusFirstError = (errors: Record<string, any>, setFocus: any) => {
  if (!errors) return;
  const firstErrorField = getFirstErrorField(errors);
  if (firstErrorField) {
    setFocus(firstErrorField as any);
    // Scroll al campo si es posible
    const el = document.querySelector(`[name="${firstErrorField}"]`);
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
};
