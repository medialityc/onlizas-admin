"use client";
import Badge from "@/components/badge/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/cards/card";
import ImagePreview from "@/components/image/image-preview";
import { InventoryProvider } from "@/types/inventory";
import { Edit, EyeIcon, Package } from "lucide-react";
import Link from "next/link";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/button/button";
import { PERMISSION_ENUM } from "@/lib/permissions";

type Props = {
  item: InventoryProvider;
  className?: string;
};

const InventoryProviderCard = ({ item }: Props) => {
  const { hasPermission } = usePermissions();
  const hasReadPermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasUpdatePermission = hasPermission([PERMISSION_ENUM.UPDATE]);

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5 h-full dark:border-slate-700">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg">
            <ImagePreview
              alt={item?.parentProductName}
              images={item.products?.[0]?.images || []}
              previewEnabled
              className="h-full w-full object-cover"
            />
            {item.products[0]?.isPrime && (
              <Badge variant="warning" className="absolute bottom-1 right-1">
                Prime
              </Badge>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-medium line-clamp-2 text-foreground">
              {item.parentProductName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{item.totalQuantity} unidades</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              variant={item.active ? "info" : "danger"}
              className="size-fit"
            >
              {item.active ? "Activo" : "Inactivo"}
            </Badge>
            {item.isPacking && (
              <Badge variant="outline-warning" className="size-fit">
                Paquetería
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Variantes</p>
            <p className="font-medium">{item.products.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Precio base</p>
            <p className="font-medium">${item.products[0]?.price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Almacén</p>
            <p className="font-medium line-clamp-1">{item.warehouseName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tienda</p>
            <p className="font-medium line-clamp-1">{item.storeName}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 pt-2">
        {hasReadPermission && (
          <Link href={`/dashboard/inventory//${item?.id}/details`}>
            <Button
              outline
              variant="secondary"
              className="w-full justify-center py-1.5 px-3 text-sm"
              size="sm"
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              Ver
            </Button>
          </Link>
        )}
        {hasUpdatePermission && (
          <Link href={`/dashboard/inventory/${item?.id}/edit`}>
            <Button variant="primary" size="sm" className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default InventoryProviderCard;
