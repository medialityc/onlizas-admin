"use client";
import Badge from "@/components/badge/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import WarehouseImage from "../../warehouse-image/warehouse-image";
import ProductCount from "./product-count";

import InventoryActon from "./inventory-action";
import {
  Inventory,
  Product,
  useWarehouseInventoryActions,
} from "@/sections/warehouses/contexts/warehouse-inventory-transfer.stote";
import { Switch } from "@/components/switch";
import { InfoIcon } from "lucide-react";
import Tippy from "@tippyjs/react";

type Props = {
  inventory: Inventory;
};

export const WarehouseInventoryItem = ({ inventory }: Props) => {
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 py-4">
      <CardHeader className="px-4 flex flex-row gap-2 justify-between">
        <CardTitle className="dark:text-white flex flex-col gap-1">
          <p>{inventory.parentProductName}</p>
          <p className="font-light text-sm text-gray-600 dark:text-gray-400">
            Proveedor: {inventory.supplierName}
          </p>
        </CardTitle>
        <InventoryActon inventoryId={inventory?.id} />
      </CardHeader>
      <CardContent className="px-4 space-y-3">
        {inventory?.products?.map((product, index) => (
          <InventoryVariantItem
            key={product?.id}
            product={product}
            inventoryId={inventory?.id}
            isLast={index === inventory.products.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
};

type ProductProps = {
  product: Product;
  inventoryId: number;
  isLast?: boolean;
};

const InventoryVariantItem = ({
  product,
  inventoryId,
  isLast = false,
}: ProductProps) => {
  const { toggleAllowPartialFulfillment, addSelectedProductsToItems } =
    useWarehouseInventoryActions();

  const isLowStock =
    (product?.quantity || 0) <= 5 && (product?.quantity || 0) > 0;
  const isOutOfStock = (product?.quantity || 0) === 0;

  return (
    <div
      className={`${!isLast ? "border-b border-gray-100 dark:border-gray-700 pb-3" : ""}`}
    >
      <div className="flex gap-3">
        {/* Imagen */}
        <div className="relative flex-shrink-0">
          <WarehouseImage
            alt={product?.productName}
            src={product?.images?.[0]}
            className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover"
          />
          <div
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
              isOutOfStock
                ? "bg-red-500"
                : isLowStock
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 leading-none">
              {product?.productName}
            </h3>
            <div className="flex flex-row gap-2 items-center">
              Disponibilidad:
              <span
                className={`text-lg font-medium flex-shrink-0 ${
                  isOutOfStock
                    ? "text-red-600 dark:text-red-400"
                    : isLowStock
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-green-600 dark:text-green-400"
                }`}
              >
                {product?.quantity || 0}
              </span>
            </div>
          </div>

          {/* Detalles */}
          <div className="flex flex-wrap gap-1 mb-1">
            {(product?.details as unknown as any[])
              ?.slice(0, 4)
              .map((detail: any, idx: number) => (
                <Badge
                  className="bg-gray-100 dark:bg-gray-700 border-0 text-xs text-gray-600 dark:text-gray-300 px-2 py-0.5"
                  key={`${detail?.key}-${idx}`}
                >
                  {detail?.key}: {detail?.value}
                </Badge>
              ))}
            {(product?.details as unknown as any[])?.length > 4 && (
              <Badge className="bg-gray-100 dark:bg-gray-700 border-0 text-xs text-gray-500 px-2 py-0.5">
                +{(product?.details as unknown as any[]).length - 4}
              </Badge>
            )}
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between gap-3">
            <ProductCount
              inventoryId={inventoryId}
              productId={product?.id}
              allowPartialFulfillment={product?.allowPartialFulfillment}
            />

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Parcial
                <Tippy
                  trigger="mouseenter focus"
                  content="Transferir todos. Si se habilita la transferencia parcial, se transferir 
                  la cantidad disponible en el inventario, si no se habilita, se transferir 
                  la cantidad completa del producto."
                >
                  <InfoIcon className="h-4 w-4" />
                </Tippy>
              </span>
              <Switch
                checked={product?.allowPartialFulfillment || false}
                onChange={() => {
                  toggleAllowPartialFulfillment(inventoryId, product?.id);
                  addSelectedProductsToItems();
                }}
                label=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
