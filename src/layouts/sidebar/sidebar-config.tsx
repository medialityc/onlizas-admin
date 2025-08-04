import { paths } from "@/config/paths";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import {
  BookOpenIcon,
  CubeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { SidebarSection } from "./types";

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
    id: "financial",
    label: "Gestión Financiera",
    items: [],
  },
  {
    id: "catalog",
    label: "Catálogo",
    items: [
      {
        id: "products",
        label: "Productos",
        path: paths.dashboard.products.list,
        icon: <ArchiveBoxIcon className="h-4 w-4" />,
      },
      {
        id: "categories",
        label: "Categorías",
        path: paths.dashboard.categories.list,
        icon: <BookOpenIcon className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "administration",
    label: "Administración",
    items: [
      {
        id: "users",
        label: "Usuarios",
        path: paths.dashboard.users.list,
        icon: <UserCircleIcon className="h-4 w-4" />,
      },
      {
        id: "roles",
        label: "Roles",
        path: paths.dashboard.roles.list,
        icon: <ShieldCheckIcon className="h-4 w-4" />,
      },
      {
        id: "permissions",
        label: "Permisos",
        path: paths.dashboard.permissions.list,
        icon: <LockClosedIcon className="h-4 w-4" />,
      },
    ],
  },
];

export const defaultExpandedSections = {
  dashboard: true,
  "order-management": false,
  operations: false,
  financial: false,
  catalog: false,
  administration: false,
};

export const defaultExpandedItems = {
  "invoice-management": false,
};
