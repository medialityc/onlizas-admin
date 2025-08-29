"use client";
import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import LongText from "@/components/long-text/long-text";
import { cn } from "@/lib/utils";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Edit, EyeIcon, Package, Store, Warehouse } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InventoryProvider } from "@/types/inventory";

type Props = {
  item: InventoryProvider;
  className?: string;
};

const UserProviderCard = ({ item }: Props) => {
  return (
    <Card key={item.id} className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <div className="flex items-start space-x-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            )}
          >
            <ClipboardDocumentIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">
              <LongText
                text={item.parentProductName || "Producto Sin nombre"}
                lineClamp={1}
              />
            </CardTitle>
            <div className="flex flex-row gap-1 items-center">
              <p>Proveedor:</p>
              <Badge variant="outline-primary" className="mt-1">
                {item.supplierName}
              </Badge>
            </div>
          </div>
          <Badge variant={item.isActive ? "info" : "danger"}>
            {item.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex flex-row items-center justify-between  gap-1">
          <p className="!text-xl text-black">Total:</p>
          <p className="text-xl font-bold text-green-600 ">
            ${item.totalPrice}
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Store className="h-4 w-4 mr-2" />
            {item?.storeName}
          </div>
          <div className="flex items-center">
            <Warehouse className="h-4 w-4 mr-2" />
            {item?.warehouseName}
          </div>
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            {item.totalQuantity} unidades totales
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Variantes:</div>
          {item.products.slice(0, 2).map((variant, index: number) => (
            <div key={variant.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {variant.productName || `Variant ${index + 1}`}
              </span>
              <span className="font-medium text-green-600">
                $ {variant.price}
              </span>
            </div>
          ))}
          {item.products.length > 2 && (
            <div className="text-sm text-blue-600">
              +{item.products.length - 2} variantes más
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="!mt-auto w-full flex flex-row gap-4">
        <Link
          className="flex-1"
          href={`/dashboard/inventory/details/${item?.id}`}
        >
          <Button variant="primary" outline size="sm" className="w-full ">
            <EyeIcon className="h-4 w-4 mr-1" />
            Ver
          </Button>
        </Link>
        <Link className="flex-1" href={`/dashboard/inventory/${item?.id}`}>
          <Button variant="secondary" outline size="sm" className="  w-full ">
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default UserProviderCard;
