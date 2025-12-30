import {
  Squares2X2Icon,
  TagIcon,
  UsersIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { SidebarSection } from "@/layouts/sidebar/types";

export const getImporterSidebarSections = (importerId: string): SidebarSection[] => [
  {
    id: "importer-dashboard",
    label: "Navegación",
    noSection: true,
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: `/importadora/${importerId}/dashboard`,
        icon: <Squares2X2Icon className="h-4 w-4" />,
      },
      {
        id: "nomencladores",
        label: "Nomencladores",
        path: `/importadora/${importerId}/nomencladores`,
        icon: <TagIcon className="h-4 w-4" />,
      },
      {
        id: "proveedores",
        label: "Proveedores",
        path: `/importadora/${importerId}/proveedores`,
        icon: <UsersIcon className="h-4 w-4" />,
      },
      {
        id: "solicitudes",
        label: "Solicitudes",
        path: `/importadora/${importerId}/solicitudes`,
        icon: <DocumentTextIcon className="h-4 w-4" />,
      },
      {
        id: "contratos",
        label: "Contratos",
        path: `/importadora/${importerId}/contratos`,
        icon: <DocumentCheckIcon className="h-4 w-4" />,
      },
    ],
  },
];
