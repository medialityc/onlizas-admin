import { TEMPLATE_TYPE_ENUM } from "@/types/section";
import { SectionFormData } from "../schema/section-schema";

export const sectionAdapterEdit = (session: SectionFormData) => {
  return {
    ...session,
    startDate: new Date(session.startDate),
    endDate: new Date(session.endDate),
    banners: [],
    templateType:
      TEMPLATE_TYPE_ENUM[
        session.templateType as unknown as keyof typeof TEMPLATE_TYPE_ENUM
      ] || 0,
  };
};
