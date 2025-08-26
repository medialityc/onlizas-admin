"use client";
import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import LongText from "@/components/long-text/long-text";
import { cn } from "@/lib/utils";
import { InventoryProvider } from "@/services/inventory-providers";
import { PencilIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

type Props = {
  item: InventoryProvider;
  className?: string;
};

const UserProviderCard = ({ item, className }: Props) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row gap-2 items-start justify-between">
        <div className="flex flex-row gap-2 items-center ">
          <div
            className={cn(
              "p-3 rounded-lg",
              "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            )}
          >
            <ClipboardDocumentIcon className="h-6 w-6" />
          </div>
          <div>
            <Link href={`/dashboard/inventory/${item?.id}/list`}>
              <CardTitle className="text-lg text-primary hover:underline font-bold leading-none mb-1">
                <LongText text={`Tienda: ${item?.storeName}`} lineClamp={1} />
              </CardTitle>
            </Link>
            <Badge
              className="bg-white"
              variant={item?.isActive ? "outline-success" : "outline-danger"}
            >
              {item?.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* actions */}
        <div className="flex flex-1 w-full mt-4 gap-4">
          <Link href={`/dashboard/inventory/${item?.id}/list`}>
            <Button className="w-full" variant="info">
              Detalles
            </Button>
          </Link>
          <Link href={`/dashboard/inventory/${item?.id}/list`}>
            <Button className="w-full" variant="secondary">
              <PencilIcon className="w-4 h-4" />
              Editar
            </Button>
          </Link>
        </div>
      </CardContent>
      <pre> {JSON.stringify(item, null, 2)} </pre>
    </Card>
  );
};

export default UserProviderCard;
