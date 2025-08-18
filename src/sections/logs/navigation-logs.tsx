"use client";
import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserGroupIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
const modules = [
  {
    name: "Negocios",
    href: "/dashboard/businesslogs",
    icon: BuildingOfficeIcon,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "Categorías",
    href: "/dashboard/categorieslogs",
    icon: TagIcon,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    name: "Monedas",
    href: "/dashboard/currencieslogs",
    icon: CurrencyDollarIcon,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    name: "Departamento",
    href: "/dashboard/departmentlogs",
    icon: BuildingOffice2Icon,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    name: "Usuarios",
    href: "/dashboard/userslogs",
    icon: UserGroupIcon,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    name: "Permisos",
    href: "/dashboard/permissionslogs",
    icon: KeyIcon,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    name: "Roles",
    href: "/dashboard/roleslogs",
    icon: UserGroupIcon,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  // Agrega más módulos aquí cuando estén disponibles
];
function NavigationLogs() {
  const pathname = usePathname();
  return (
    <nav className="relative">
      <div className="flex items-center gap-2 overflow-x-auto py-1 -mx-2 px-2">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = pathname === m.href;
          return (
            <Link
              key={m.name}
              href={m.href}
              title={m.name}
              aria-current={isActive ? "page" : undefined}
              className={`group inline-flex items-center gap-2 rounded-full border bg-white dark:bg-gray-800 px-3 py-1.5 text-xs transition whitespace-nowrap
                ${isActive ? "border-primary/70 ring-1 ring-primary/10 bg-primary/5" : "border-gray-200 dark:border-gray-700 hover:border-primary/60 hover:shadow-sm"}
              `}
            >
              <span className={`rounded-full ${m.bg} p-1.5`}>
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-primary" : m.color}`}
                />
              </span>
              <span
                className={`font-medium ${isActive ? "text-primary" : "text-gray-800 dark:text-gray-200 group-hover:text-primary"}`}
              >
                {m.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default NavigationLogs;
