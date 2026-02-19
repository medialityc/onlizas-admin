"use client";
import { Store } from "@/types/stores";
import { Card, CardContent, CardHeader } from "@/components/cards/card";
import { Store as StoreIcon } from "lucide-react";
import ProgressiveImage from "@/components/image/progressive-image";

interface StoreCardProps {
  store: Store;
  onClick: (storeId: string) => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-border/70 bg-card/80 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg"
      onClick={() => onClick(store.id.toString())}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary group-hover:text-primary-foreground">
            {store.logoStyle ? (
              <ProgressiveImage
                src={store.logoStyle}
                alt={store.name}
                width={40}
                height={40}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <StoreIcon className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="line-clamp-1 text-sm font-semibold">{store.name}</h3>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {store.description || "Sin descripción disponible"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Negocio: <span className="font-medium">{store.businessName}</span>
            </p>
            {store.supplierName && (
              <p className="text-[11px] text-muted-foreground">
                Proveedor:{" "}
                <span className="font-medium">{store.supplierName}</span>
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 text-xs">
        <div className="grid grid-cols-1 gap-1.5">
          {store.email && (
            <p className="truncate text-muted-foreground">
              <span className="font-medium text-foreground">Email:</span>{" "}
              {store.email}
            </p>
          )}
          {store.phoneNumber && (
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Teléfono:</span>{" "}
              {store.phoneNumber}
            </p>
          )}
          {store.address && (
            <p className="line-clamp-2 text-muted-foreground">
              <span className="font-medium text-foreground">Dirección:</span>{" "}
              {store.address}
            </p>
          )}
          {store.url && (
            <p className="truncate text-muted-foreground">
              <span className="font-medium text-foreground">URL:</span>{" "}
              {store.url}
            </p>
          )}
        </div>
        {(store.template || store.primaryColor || store.accentColor) && (
          <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
            {store.template && (
              <span>
                Plantilla:{" "}
                <span className="font-medium capitalize">{store.template}</span>
              </span>
            )}
            <div className="flex items-center gap-1">
              {store.primaryColor && (
                <span
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: store.primaryColor }}
                  title={`Color primario ${store.primaryColor}`}
                />
              )}
              {store.accentColor && (
                <span
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: store.accentColor }}
                  title={`Color acento ${store.accentColor}`}
                />
              )}
            </div>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
          <span>
            Seguidores:{" "}
            <span className="font-semibold">
              {store.followers?.length || 0}
            </span>
          </span>
          <span
            className={
              store.active
                ? "inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
                : "inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700"
            }
          >
            {store.active ? "Activa" : "Inactiva"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
