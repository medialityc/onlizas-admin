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
import { IUser } from "@/types/users";
import { ChevronDownIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

type Props = {
  item: IUser;
  className?: string;
};

const UserProviderCard = ({ item, className }: Props) => {
  const { hasPermission } = usePermissions();
  const hasReadPermission = hasPermission([
    PERMISSION_ENUM.RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  ]);

  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5 h-full dark:border-slate-700",
        className,
      )}
    >
      <CardHeader className="flex flex-row gap-2 items-start justify-between">
        <div className="flex flex-row gap-2 items-center ">
          <div
            className={cn(
              "p-3 rounded-lg",
              "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
            )}
          >
            <UserGroupIcon className="h-6 w-6" />
          </div>
          <div>
            <Link href={`/dashboard/inventory/list/${item?.id}`}>
              <CardTitle className="text-lg text-primary hover:underline font-bold leading-none mb-1">
                <LongText text={item?.name} lineClamp={1} />
              </CardTitle>
            </Link>
            <Badge
              variant={item?.active ? "outline-success" : "outline-danger"}
            >
              {item?.active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>
        <Badge
          className="flex-nowrap text-nowrap"
          variant={item?.isVerified ? "outline-secondary" : "outline-danger"}
        >
          {item?.isVerified ? "Verificado" : "Sin verificar"}
        </Badge>
      </CardHeader>
      <CardContent>
        {/* emails */}
        <FlexItems title="Correos electrónicos:" total={item?.emails?.length}>
          <div className="flex flex-col gap-2">
            {item?.emails?.map((email) => (
              <div
                key={email?.id}
                className="flex flex-row gap-2 items-center justify-between px-2 py-1 bg-gray-50 rounded-sm"
              >
                <LongText text={email?.address} lineClamp={1} />
                <Badge variant="outline-info" className="p-0.5">
                  {email?.isVerified ? "Verificado" : "Sin verificar"}
                </Badge>
              </div>
            ))}
          </div>
        </FlexItems>

        {/* phone */}
        <FlexItems title="Teléfonos:" total={item?.phones?.length}>
          <div className="flex flex-col gap-2">
            {item?.phones?.map((phone) => (
              <div
                key={phone?.id}
                className="flex flex-row gap-2 items-center justify-between px-2 py-1 bg-gray-50 rounded-sm"
              >
                <LongText text={phone?.number} lineClamp={1} />
                <Badge variant="outline-info" className="p-0.5">
                  {phone?.isVerified ? "Verificado" : "Sin verificar"}
                </Badge>
              </div>
            ))}
          </div>
        </FlexItems>
      </CardContent>
      <CardFooter className=" mt-auto">
        {/* actions */}
        <div className="flex justify-end w-full">
          {hasReadPermission && (
            <Link href={`/dashboard/inventory/list/${item?.id}/${item?.name}`}>
              <Button className="w-full" variant="outline">
                Ver inventario
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserProviderCard;

const FlexItems = ({
  children,
  total,
  title,
}: React.PropsWithChildren & { total?: number; title: string }) => {
  const [active, setActive] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className={`p-2 bg-gray-100 rounded-md w-full flex items-center justify-between text-white-dark dark:bg-[#1b2e4b] `}
        onClick={() => setActive(!active)}
      >
        <p>{title}</p>

        <div className="flex flex-row gap-1 items-center">
          {total && <Badge>{total}</Badge>}

          <ChevronDownIcon
            className={cn("h-5 w-5  duration-150", active ? "rotate-180" : "")}
          />
        </div>
      </button>
      <AnimateHeight duration={300} height={active ? "auto" : 0}>
        {children}
      </AnimateHeight>
    </div>
  );
};
