import { TEMPLATE_TYPE_ENUM } from "@/types/section";

export const TEMPLATE_TYPE_ENUM_OPTIONS: {
  value: TEMPLATE_TYPE_ENUM;
  label: string;
}[] = [
  { value: TEMPLATE_TYPE_ENUM.carousel, label: "Carrousel de Productos" },
  {
    value: TEMPLATE_TYPE_ENUM.featured,
    label: "Características de productos",
  },
  { value: TEMPLATE_TYPE_ENUM.list, label: "Lista de productos" },
  { value: TEMPLATE_TYPE_ENUM.masonry, label: "Masonería de productos" },
];

export const TARGET_USER_SEGMENT_OPTIONS = [
  { value: "ALL", label: "Todos" },
  { value: "YOUNG", label: "Jóvenes" },
  { value: "ADULT", label: "Adultos" },
];

export const TARGET_USER_DEVICE_OPTIONS = [
  { value: "ALL", label: "Todos" },
  { value: "MOBILE", label: "Móvil" },
  { value: "DESKTOP", label: "Escritorio" },
];
