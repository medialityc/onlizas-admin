"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { WarehouseFormData } from "../../schemas/warehouse-schema";
import { Tab } from "@/types/tabs";
import { WAREHOUSE_TYPE_ENUM } from "../../constants/warehouse-type";
import { warehouseTabs } from "../../constants/warehouse-tabs";

interface EditWarehouseTabsProps {
  warehouse: WarehouseFormData;
  onTabs?: (warehouseId: string, type: WAREHOUSE_TYPE_ENUM) => Tab[];
}

export function EditWarehouseTabs({
  warehouse,
  onTabs = warehouseTabs,
}: EditWarehouseTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const warehouseId = warehouse.id;
  const warehouseType = warehouse.type.toLowerCase();

  const tabs = onTabs(warehouseId!, warehouseType as WAREHOUSE_TYPE_ENUM);

  const handleTabChange = (tab: Tab) => {
    if (!tab.disabled) {
      router.push(tab.path);
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-4">
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
