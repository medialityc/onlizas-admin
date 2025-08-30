"use client";
import { Button } from "@/components/button/button";
import {
  useWarehouseInventoryActions,
  useInventoryStore,
} from "@/sections/warehouses/contexts/warehouse-inventory-transfer.stote";
import { PlusIcon, MinusIcon } from "lucide-react";
import React from "react";

type Props = {
  min?: number;
  max?: number;
  className?: string;
  inventoryId: number;
  productId: number;
};

const ProductCount = ({
  min = 0,
  max = 99,
  className = "",
  inventoryId,
  productId,
}: Props) => {
  const { incrementProduct, decrementProduct, updateProductCount } =
    useWarehouseInventoryActions();

  // Obtener el count actual directamente del store
  const count = useInventoryStore((state) => {
    const inventory = state.inventories.find((inv) => inv.id === inventoryId);
    return inventory?.products?.find((p) => p.id === productId)?.count || 0;
  });

  // Obtener la cantidad máxima disponible del producto
  const maxAvailable = useInventoryStore((state) => {
    const inventory = state.inventories.find((inv) => inv.id === inventoryId);
    return (
      inventory?.products?.find((p) => p.id === productId)?.quantity || max
    );
  });

  // El máximo real es el menor entre el max prop y la cantidad disponible
  const actualMax = Math.min(max, maxAvailable);

  const handleIncrement = () => {
    if (count < actualMax) {
      incrementProduct(inventoryId, productId);
    }
  };

  const handleDecrement = () => {
    if (count > min) {
      decrementProduct(inventoryId, productId);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.min(Math.max(value, min), actualMax);
    updateProductCount(inventoryId, productId, clampedValue);
  };

  const handleInputBlur = () => {
    // Asegurar que el valor esté dentro de los límites
    if (count < min) {
      updateProductCount(inventoryId, productId, min);
    } else if (count > actualMax) {
      updateProductCount(inventoryId, productId, actualMax);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Botón decrementar */}
      <Button
        variant="primary"
        onClick={handleDecrement}
        disabled={count <= min}
        className="h-8 w-8 p-0 rounded-full"
        aria-label="Decrementar cantidad"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>

      {/* Input cantidad */}
      <input
        type="number"
        value={count}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        min={min}
        max={actualMax}
        className="w-16 h-8 text-center border-0 bg-slate-200 dark:bg-slate-600 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm font-medium px-2 leading-none"
        aria-label="Cantidad de productos"
      />

      {/* Botón incrementar */}
      <Button
        size="sm"
        variant="primary"
        onClick={handleIncrement}
        disabled={count >= actualMax}
        className="h-8 w-8 p-0 rounded-full"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductCount;
