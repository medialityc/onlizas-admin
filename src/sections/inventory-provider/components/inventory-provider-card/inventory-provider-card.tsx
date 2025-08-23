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

import { UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  item: InventoryProvider;
};

const InventoryProviderCard = ({ item }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row gap-2 items-start justify-between">
        <div className="flex flex-row gap-2 items-center ">
          <div
            className={cn(
              "p-3 rounded-lg",
              "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            )}
          >
            <UserGroupIcon className="h-6 w-6" />
          </div>
          <div>
            <Link href={`/dashboard/inventory/${item?.id}/list`}>
              <CardTitle className="text-lg text-primary hover:underline font-bold leading-none mb-1">
                <LongText text={item?.name} lineClamp={1} />
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
        {/* stores and products */}
        <div></div>

        {/* actions */}
        <div className="flex flex-1 w-full mt-4">
          <Button className="w-full border border-primary bg-transparent shadow-none text-black">
            <Link href={`/dashboard/inventory/${item?.id}/inventory`}>
              Ver inventario
            </Link>
          </Button>
        </div>
      </CardContent>
      {/*  <pre> {JSON.stringify(item, null, 2)} </pre> */}
    </Card>
  );
};

export default InventoryProviderCard;
