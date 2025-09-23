 
import { SectionFormData } from "../schema/section-schema"; 

export const setSectionFormData = async (
  section: SectionFormData
): Promise<FormData> => {
  const formData = new FormData();

  // Datos básicos de la categoría
  formData.append("name", String(section.name));
  formData.append("description", String(section.description));
  formData.append("viewMoreUrl", String(section.viewMoreUrl));
  formData.append("isActive", String(section.isActive));
  formData.append("displayOrder", String(section.displayOrder));

  formData.append("templateType", String(0)); // todo section.templateType
  formData.append("defaultItemCount", String(section.defaultItemCount));
  formData.append("backgroundColor", String(section.backgroundColor));

  formData.append("textColor", String(section.textColor));
  formData.append("isPersonalized", String(section.isPersonalized));
  formData.append("targetUserSegment", String(section.targetUserSegment));
  formData.append("targetDeviceType", String(section.targetDeviceType));
  formData.append("startDate", String((section.startDate as any).toISOString()));
  formData.append("endDate", String((section.endDate as any).toISOString()));

  /* productos de la sección */
  if (section.products && section.products.length > 0) {
    section.products?.forEach((prod, idx) => {
      formData.append(
        `products[${idx}][productGlobalId]`,
        String(prod.productGlobalId)
      );
      formData.append(`products[${idx}][displayOrder]`, String(idx + 1));
      formData.append(`products[${idx}][isFeatured]`, String(prod.isFeatured));
      formData.append(
        `products[${idx}][customLabel]`,
        String(prod.customLabel)
      );
      formData.append(
        `products[${idx}][customBackgroundColor]`,
        String(prod.customBackgroundColor)
      );
    });
  }

  return formData;
};
