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
  MapPinIcon,
  GlobeAltIcon,
  PhotoIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/solid";
import { SidebarSection } from "./types";

import {
  CreditCard,
  History,
  LayoutDashboard,
  ShieldCheck,
  Wallet,
  WarehouseIcon,
} from "lucide-react";
import { PERMISSION_ADMIN } from "@/lib/permissions";

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
        // Dashboard siempre visible para todos
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
        permissions: PERMISSION_ADMIN, // Admin puede gestionar monedas
      },
      {
        id: "virtual-warehouse-types",
        label: "Tipos de almacenes virtuales",
        path: paths.dashboard.virtualWarehouseTypes.list,
        icon: <WarehouseIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede gestionar tipos de almacenes
      },
      {
        id: "locations",
        label: "Localizaciones",
        path: paths.dashboard.locations.list,
        icon: <MapPinIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede gestionar localizaciones
      },
    ],
  },
  {
    id: "content",
    label: "Contenido",
    items: [
      {
        id: "content-banners",
        label: "Banners",
        path: paths.content.banners.list,
        icon: <PhotoIcon className="h-4 w-4" />,
      },
      {
        id: "content-sections",
        label: "Secciones de producto",
        path: paths.content.sections.list,
        icon: <PuzzlePieceIcon className="h-4 w-4" />,
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
        permissions: PERMISSION_ADMIN, // Admin puede gestionar departamentos
      },
      {
        id: "categories",
        label: "Categorías",
        path: paths.dashboard.categories.list,
        icon: <BookOpenIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede gestionar categorías
      },
      {
        id: "products",
        label: "Productos",
        path: paths.dashboard.products.list,
        icon: <ShoppingBagIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN,
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
        permissions: PERMISSION_ADMIN, // Admin puede ver inventario
      },
      {
        id: "regions",
        label: "Regiones",
        path: paths.dashboard.regions.list,
        icon: <GlobeAltIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede gestionar regiones
      },
      {
        id: "suppliers",
        label: "Solicitud de Proveedores",
        path: paths.dashboard.suppliers.list,
        icon: <DocumentChartBarIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede gestionar proveedores
      },
      {
        id: "warehouses",
        label: "Almacenes",
        path: paths.dashboard.warehouses.list,
        icon: <WarehouseIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN,
      },
      {
        id: "stores",
        label: "Tiendas",
        path: paths.dashboard.stores.list,
        icon: <ShoppingBagIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN,
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
        permissions: PERMISSION_ADMIN, // Admin puede ver logs
      },
      {
        id: "users",
        label: "Usuarios",
        path: paths.dashboard.users.list,
        icon: <UserIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN,
      },
      {
        id: "roles",
        label: "Roles",
        path: paths.dashboard.roles.list,
        icon: <LockOpenIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN,
      },
      {
        id: "permissions",
        label: "Permisos",
        path: paths.dashboard.permissions.list,
        icon: <ShieldCheckIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN,
      },
      {
        id: "system-configurations",
        label: "Config. del Sistema",
        path: paths.dashboard.systemConfigurations.list,
        icon: <ShieldCheckIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN,
      },
      {
        id: "business",
        label: "Negocios",
        path: paths.dashboard.business.list,
        icon: <BriefcaseIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN,
      },
      {
        id: "notification",
        label: "Notificaciones",
        path: paths.dashboard.users.notification.list,
        icon: <BellIcon className="h-4 w-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede gestionar notificaciones
      },
    ],
  },
  {
    id: "gatewaySettings",
    label: "Pagos",
    items: [
      {
        id: "overview",
        label: "Overview",
        path: paths.dashboard.gateways.overview,
        icon: <LayoutDashboard className="size-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede ver overview de gateways
      },
      {
        id: "payment-gateway",
        label: "Payment Gateway",
        path: paths.dashboard.gateways.paymentGateway,
        icon: <CreditCard className="size-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede gestionar payment gateway
      },
      {
        id: "payment-methods",
        label: "Payment Methods",
        path: paths.dashboard.gateways.paymentMethods,
        icon: <Wallet className="size-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede gestionar métodos de pago
      },
      {
        id: "testing-validation",
        label: "Testing & Validation",
        path: paths.dashboard.gateways.testingValidation,
        icon: <ShieldCheck className="size-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede hacer testing y validación
      },
      {
        id: "audit-history",
        label: "Audit & History",
        path: paths.dashboard.gateways.auditHistory,
        icon: <History className="size-4" />,
        permissions: PERMISSION_ADMIN, // Admin puede ver audit y history
      },
    ],
  },
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
