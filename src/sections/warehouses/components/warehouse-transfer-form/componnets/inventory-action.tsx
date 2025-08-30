"use client";
import { Button } from "@/components/button/button";
import { useWarehouseInventoryActions } from "@/sections/warehouses/contexts/warehouse-inventory-transfer.stote";
import Tippy from "@tippyjs/react";

import { ChevronsUp, RefreshCcwIcon } from "lucide-react";

type Props = {
  inventoryId: number;
};
const InventoryActon = ({ inventoryId }: Props) => {
  const {
    selectAllProducts,
    addSelectedProductsToItems,
    getInventoryTotalSelected,
    resetInventory,
    removeItemsByInventory,
  } = useWarehouseInventoryActions();
  return (
    <div className="flex items-center flex-row gap-2 [&>button]:rounded-full">
      <h2> Sel..: {getInventoryTotalSelected(inventoryId) || 0}</h2>

      <Tippy trigger="mouseenter focus" content="Transferir todos">
        <Button
          onClick={() => {
            selectAllProducts(inventoryId);
            addSelectedProductsToItems();
          }}
          outline
          className="px-2   bg-transparent  "
        >
          <ChevronsUp className="h-4 w-4" />
        </Button>
      </Tippy>

      <Tippy trigger="mouseenter focus" content="Limpiar">
        <Button
          onClick={() => {
            resetInventory(inventoryId);
            removeItemsByInventory(inventoryId);
          }}
          outline
          className="px-2   bg-transparent  "
        >
          <RefreshCcwIcon className="h-4 w-4" />
        </Button>
      </Tippy>
    </div>
  );
};

export default InventoryActon;
