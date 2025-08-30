"use client";
import Badge from "@/components/badge/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import WarehouseImage from "../../warehouse-image/warehouse-image";
import ProductCount from "./product-count";

import InventoryActon from "./inventory-action";
import {
  Inventory,
  Product,
} from "@/sections/warehouses/contexts/warehouse-inventory-transfer.stote";

type Props = {
  inventory: Inventory;
};
export const WarehouseInventoryItem = ({ inventory }: Props) => {
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <CardHeader className="px-4 flex flex-row gap-2 justify-between">
        <CardTitle className="dark:text-white flex flex-col gap-2">
          <p> {inventory.parentProductName}</p>
          <p className="font-light"> Proveedor: {inventory.supplierName}</p>
        </CardTitle>

        {/* general actions  */}
        <InventoryActon inventoryId={inventory?.id} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-4">
        {inventory?.products?.map((p) => (
          <InventoryVariantItem
            key={p?.id}
            product={p}
            inventoryId={inventory?.id}
          />
        ))}
      </CardContent>
    </Card>
  );
};

type ProductProps = {
  product: Product;
  inventoryId: number;
};

const InventoryVariantItem = ({ product, inventoryId }: ProductProps) => {
  return (
    <Card className="dark:bg-gray-700 border-0 bg-gray-100   py-2 gap-2">
      <CardContent className="px-2 flex flex-col-reverse xl:flex-row gap-2 items-end xl:items-center justify-between">
        <div className="flex w-full flex-row gap-2 items-start">
          {/* images */}
          <WarehouseImage
            alt={product?.productName}
            src={"/assets/images/placeholder-product.webp"}
            className="w-12 h-12"
          />
          <div className="leading-normal">
            <h3 className="dark:text-white text-[1rem] font-bold">
              {product?.productName}
            </h3>

            <p className="dark:text-white text-sm">
              Disponible: <span>{product?.quantity}</span>
            </p>
          </div>
        </div>

        {/* quantity */}
        <ProductCount inventoryId={inventoryId} productId={product?.id} />
      </CardContent>
      <CardFooter className="px-2 ">
        <div className="flex flex-row gap-1 items-center flex-wrap text-sm">
          {(product?.details as unknown as any[])?.map((detail: any) => (
            <Badge
              className="bg-transparent border font-normal dark:!text-gray-100 border-slate-300 dark:border-gray-600 px-2 py-0.5 text-sm !text-gray-600  "
              key={detail?.key}
            >
              {detail?.key} : {detail?.value}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
