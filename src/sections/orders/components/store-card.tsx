"use client";
import { Store } from "@/types/stores";
import { Card, CardContent, CardHeader } from "@/components/cards/card";
import { Store as StoreIcon } from "lucide-react";

interface StoreCardProps {
  store: Store;
  onClick: (storeId: string) => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(store.id.toString())}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <StoreIcon className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <h3 className="font-semibold">{store.name}</h3>
            <p className="text-sm text-muted-foreground">
              {store.description || "Sin descripción"}
            </p>
            <p className="text-xs text-muted-foreground">
              Negocio: {store.businessName}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-1 text-sm">
          {store.email && (
            <p>
              <strong>Email:</strong> {store.email}
            </p>
          )}
          {store.phoneNumber && (
            <p>
              <strong>Teléfono:</strong> {store.phoneNumber}
            </p>
          )}
          {store.address && (
            <p>
              <strong>Dirección:</strong> {store.address}
            </p>
          )}
          <p>
            <strong>Seguidores:</strong> {store.followers?.length || 0}
          </p>
          <p>
            <strong>Activa:</strong> {store.active ? "Sí" : "No"}
          </p>
        </div>
        
      </CardContent>
    </Card>
  );
}
