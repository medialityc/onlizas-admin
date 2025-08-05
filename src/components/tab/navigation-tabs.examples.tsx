import { NavigationTabs, TabItem } from "@/components/tab/navigation-tabs";
import {
  HomeIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Ejemplo de uso del componente NavigationTabs

// 1. Configuración básica de tabs
const basicTabs: TabItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    label: "Usuarios",
    href: "/dashboard/users",
    icon: UsersIcon,
    count: 42, // Opcional: mostrar contador
  },
  {
    label: "Reportes",
    href: "/dashboard/reports",
    icon: ChartBarIcon,
  },
  {
    label: "Configuración",
    href: "/dashboard/settings",
    icon: CogIcon,
    disabled: true, // Opcional: deshabilitar tab
  },
];

// 2. Uso en un componente
export function ExampleUsage() {
  return (
    <div>
      <h1>Mi Dashboard</h1>

      {/* Tabs de navegación */}
      <NavigationTabs tabs={basicTabs} className="mb-6" />

      {/* Contenido de la página */}
      <div>{/* Tu contenido aquí */}</div>
    </div>
  );
}

// 3. Tabs sin iconos (más simples)
const simpleTabs: TabItem[] = [
  { label: "Todos", href: "/products" },
  { label: "Activos", href: "/products/active", count: 125 },
  { label: "Inactivos", href: "/products/inactive", count: 8 },
  { label: "Pendientes", href: "/products/pending", count: 3 },
];

// 4. Tabs con estados específicos
const statusTabs: TabItem[] = [
  {
    label: "En Desarrollo",
    href: "/projects/development",
    count: 5,
  },
  {
    label: "En Revisión",
    href: "/projects/review",
    count: 2,
  },
  {
    label: "Completados",
    href: "/projects/completed",
    count: 15,
  },
  {
    label: "Beta (Próximamente)",
    href: "/projects/beta",
    disabled: true,
  },
];

export { basicTabs, simpleTabs, statusTabs };
