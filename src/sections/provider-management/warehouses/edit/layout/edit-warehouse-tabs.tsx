"use client";

import { Warehouse } from "@/types/warehouses";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

interface Tab {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface EditWarehouseTabsProps {
  warehouse: Warehouse;
}

export function EditWarehouseTabs({ warehouse }: EditWarehouseTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const warehouseId = warehouse.id;

  const tabs: Tab[] = [
    {
      id: "general",
      label: "Datos Generales",
      path: `/dashboard/warehouses/${warehouseId}/edit`,
    },
    {
      id: "inventory",
      label: "Inventarios",
      path: `/dashboard/warehouses/${warehouseId}/edit/inventory`,
    },
    {
      id: "transfers",
      label: "Transferencias",
      path: `/dashboard/warehouses/${warehouseId}/edit/transfers`,
    },
  ];

  const handleTabChange = (tab: Tab) => {
    if (!tab.disabled) {
      router.push(tab.path);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab)}
            className={cn(
              "py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap",
              pathname === tab.path
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600",
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={tab.disabled}
          >
            <div className="flex items-center space-x-2">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
