import { TabItem } from "@/components/tab/navigation-tabs";

export const suppliersTabs: TabItem[] = [
  {
    label: "Todas las solicitudes",
    href: "/dashboard/suppliers",
    icon: "users",
    id: "all",
  },
  {
    label: "Solicitudes Pendientes",
    href: "/dashboard/suppliers/pending",
    icon: "userMinus",
    id: "pending",
  },
  {
    label: "Solicitudes Válidos",
    href: "/dashboard/suppliers/valid",
    icon: "userGroup",
    id: "valid",
  },
];
