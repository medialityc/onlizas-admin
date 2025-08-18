import { paths } from "@/config/paths";
import {
  CubeIcon,
  UserIcon,
  BuildingStorefrontIcon,
  ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/solid";
import { SidebarSection } from "../types";
import IconCashBanknotes from "@/components/icon/icon-cash-banknotes";

export const sidebarProviderSections: SidebarSection[] = [
  {
    id: "provider",
    label: "Panel Principal",
    noSection: true,
    items: [
      {
        id: "provider-profile",
        label: "Mi Perfil",
        path: paths.provider.profile.list,
        icon: <UserIcon className="h-4 w-4" />,
      },
      {
        id: "provider-products",
        label: "Mis Productos",
        path: paths.provider.products.list,
        icon: <CubeIcon className="h-4 w-4" />,
      },
      {
        id: "provider-inventory",
        label: "Mi Inventario",
        path: paths.provider.inventory.list,
        icon: <ArchiveBoxXMarkIcon className="h-4 w-4" />,
      },
      {
        id: "provider-warehouse",
        label: "Mis Almacenes",
        path: paths.provider.warehouse.list,
        icon: <BuildingStorefrontIcon className="h-4 w-4" />,
      },
      {
        id: "provider-store",
        label: "Mis Tiendas",
        path: paths.provider.stores.list,
        icon: <IconCashBanknotes className="h-4 w-4" />,
      },
    ],
  },
];

export const defaultExpandedSections = {
  provider: true,
  "order-management": false,
  operations: false,
  financial: false,
  catalog: true,
  security: true,
  logistics: true,
  administration: false,
};

export const defaultExpandedItems = {
  "invoice-management": false,
  catalog: true,
  security: true,
  logistics: true,
};
