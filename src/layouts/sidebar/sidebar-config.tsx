import { paths } from "@/config/paths";
import {
  BookOpenIcon,
  ArchiveBoxIcon,
  CubeIcon,
  CurrencyDollarIcon,
  LockOpenIcon,
  UserIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  BellIcon,
  DocumentChartBarIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import { SidebarSection } from "./types";
import { WarehouseIcon } from "lucide-react";

export const sidebarSections: SidebarSection[] = [
  {
    id: "dashboard",
    label: "Panel Principal",
    noSection: true,
    items: [
      {
        id: "dashboard-main",
        label: "Dashboard",
        path: paths.dashboard.root,
        icon: <CubeIcon className="h-4 w-4" />,
      },
    ],
  },

  {
    id: "nomenclators",
    label: "Nomencladores",
    items: [
      {
        id: "currencies",
        label: "Monedas",
        path: paths.dashboard.currencies.list,
        icon: <CurrencyDollarIcon className="h-4 w-4" />,
      },
      {
        id: "virtual-warehouse-types",
        label: "Tipos de almacenes virtuales",
        path: paths.dashboard.virtualWarehouseTypes.list,
        icon: <WarehouseIcon className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "catalog",
    label: "Catálogo",
    items: [
      {
        id: "departments",
        label: "Departamentos",
        path: paths.dashboard.departments.list,
        icon: <ArchiveBoxIcon className="h-4 w-4" />,
      },
      {
        id: "categories",
        label: "Categorías",
        path: paths.dashboard.categories.list,
        icon: <BookOpenIcon className="h-4 w-4" />,
      },
      {
        id: "products",
        label: "Productos",
        path: paths.dashboard.products.list,
        icon: <ShoppingBagIcon className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "logistics",
    label: "Logística",
    items: [
      {
        id: "inventory",
        label: "Inventario",
        path: paths.dashboard.inventory.all,
        icon: <ClipboardDocumentIcon className="h-4 w-4" />,
      },
      {
        id: "suppliers",
        label: "Solicitud de Proveedores",
        path: paths.dashboard.suppliers.list,
        icon: <DocumentChartBarIcon className="h-4 w-4" />,
      },

      {
        id: "warehouses",
        label: "Almacenes",
        path: paths.dashboard.warehouses.list,
        icon: <WarehouseIcon className="h-4 w-4" />,
      },
      {
        id: "stores",
        label: "Tiendas",
        path: paths.dashboard.stores.list,
        icon: <ShoppingBagIcon className="h-4 w-4" />,
      },
    ],
  },

  {
    id: "security",
    label: "Seguridad",
    items: [
      {
        id: "logs",
        label: "Logs",
        path: paths.dashboard.logs.list,
        icon: <DocumentChartBarIcon className="h-4 w-4" />,
      },
      {
        id: "users",
        label: "Usuarios",
        path: paths.dashboard.users.list,
        icon: <UserIcon className="h-4 w-4" />,
      },
      {
        id: "roles",
        label: "Roles",
        path: paths.dashboard.roles.list,
        icon: <LockOpenIcon className="h-4 w-4" />,
      },
      {
        id: "permissions",
        label: "Permisos",
        path: paths.dashboard.permissions.list,
        icon: <ShieldCheckIcon className="h-4 w-4" />,
      },
      {
        id: "business",
        label: "Negocios",
        path: paths.dashboard.business.list,
        icon: <BriefcaseIcon className="h-4 w-4" />,
      },
      {
        id: "notification",
        label: "Notificaciones",
        path: paths.dashboard.users.notification.list,
        icon: <BellIcon className="h-4 w-4" />,
      },
    ],
  },
  // {
  //   id: "administration",
  //   label: "Administración",
  //   items: [
  //     {
  //       id: "users",
  //       label: "Usuarios",
  //       path: paths.dashboard.users.list,
  //       icon: <UserCircleIcon className="h-4 w-4" />,
  //     },
  //     {
  //       id: "roles",
  //       label: "Roles",
  //       path: paths.dashboard.roles.list,
  //       icon: <ShieldCheckIcon className="h-4 w-4" />,
  //     },
  //     {
  //       id: "permissions",
  //       label: "Permisos",
  //       path: paths.dashboard.permissions.list,
  //       icon: <LockClosedIcon className="h-4 w-4" />,
  //     },
  //   ],
  // },
];

export const defaultExpandedSections = {
  dashboard: true,
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
