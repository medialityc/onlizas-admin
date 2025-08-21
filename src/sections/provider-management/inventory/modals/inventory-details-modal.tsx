"use client";

import { InventoryItem } from "@/types/inventory";
import TabsWithIcons from "@/components/tab/tabs";
import {
  XMarkIcon,
  InformationCircleIcon,
  Squares2X2Icon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import InventoryGeneralTab from "../components/inventory-general-tab";
import InventoryVariantsTab from "../components/inventory-variants-tab";
import InventoryHistoryTab from "../components/inventory-history-tab";

interface InventoryDetailsModalProps {
  open: boolean;
  onClose: () => void;
  item: InventoryItem | null;
}

export default function InventoryDetailsModal({
  open,
  onClose,
  item,
}: InventoryDetailsModalProps) {
  if (!open || !item) return null;

  const tabs = [
    {
      label: "General",
      icon: <InformationCircleIcon className="h-5 w-5" />,
      content: <InventoryGeneralTab item={item} />,
    },
    {
      label: "Variantes",
      icon: <Squares2X2Icon className="h-5 w-5" />,
      content: <InventoryVariantsTab item={item} />,
    },
    {
      label: "Historial",
      icon: <ClockIcon className="h-5 w-5" />,
      content: <InventoryHistoryTab />,
    },
  ];

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center p-4 md:p-8">
        <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-black-dark-light shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-xl font-semibold">Detalles del Inventario</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-100"
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="px-6 pt-3">
            <TabsWithIcons
              tabs={tabs}
              activeColorClass="bg-primary text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
