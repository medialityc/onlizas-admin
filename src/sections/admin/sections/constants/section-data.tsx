import { SectionFormData } from "../schema/section-schema";

export const setSectionFormData = async (
  section: SectionFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Datos básicos de la categoría
  formData.append("name", String(section.name));
  formData.append("description", String(section.description));
  formData.append("viewMoreUrl", String(section.viewMoreUrl));
  formData.append("active", String(section.active));
  formData.append("displayOrder", String(section.displayOrder));

  formData.append("templateType", String(section.templateType)); // todo section.templateType
  formData.append("defaultItemCount", String(section.defaultItemCount));
  formData.append("backgroundColor", String(section.backgroundColor));

  formData.append("textColor", String(section.textColor));
  formData.append("isPersonalized", String(section.isPersonalized));
  formData.append("targetUserSegment", String(section.targetUserSegment));
  formData.append("targetDeviceType", String("ALL"));
  formData.append(
    "startDate",
    String((section.startDate as any).toISOString())
  );
  formData.append("endDate", String((section.endDate as any).toISOString()));

  /* productos de la sección */
  if (section.products && section.products.length > 0) {
    const newProducts = section.products.filter((p: any) => !p?.id);
    if (newProducts.length > 0) {
      formData.append(
        `products`,
        JSON.stringify(
          newProducts.map((p, index) => ({ ...p, displayOrder: index + 1 }))
        )
      );
    }
  }

  return formData;
};
