import { UsersIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { TabItem } from "@/components/tab/navigation-tabs";
import { UserGroupIcon } from "@heroicons/react/24/solid";

export const suppliersTabs: TabItem[] = [
  {
    label: "Todos los Proveedores",
    href: "/dashboard/suppliers",
    icon: UsersIcon,
  },
  {
    label: "Proveedores Pendientes",
    href: "/dashboard/suppliers/pending",
    icon: UserMinusIcon,
    disabled: true, // Deshabilitado hasta implementar
  },
  {
    label: "Proveedores Validos",
    href: "/dashboard/suppliers/valid",
    icon: UserGroupIcon,
    disabled: true, // Deshabilitado hasta implementar
  },
];
