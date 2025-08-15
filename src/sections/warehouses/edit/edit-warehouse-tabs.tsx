'use client';

import { Warehouse } from '@/types/warehouses';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface EditWarehouseTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  warehouse: Warehouse;
}

export function EditWarehouseTabs ({ activeTab, onTabChange, warehouse }: EditWarehouseTabsProps) {
  const tabs: Tab[] = [
    {
      id: 'general',
      label: 'Datos Generales',
    },
    {
      id: 'inventory',
      label: 'Inventarios',
    },
    {
      id: 'transfers',
      label: 'Transferencias',
    },
  ];
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            className={cn(
              'py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
              tab.disabled && 'opacity-50 cursor-not-allowed'
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
