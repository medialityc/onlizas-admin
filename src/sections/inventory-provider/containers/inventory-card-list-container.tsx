"use client";

import useFiltersUrl from "@/hooks/use-filters-url";
import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";

import { InventoryCardGrid } from "../components/inventory-provider-card-grid/inventory-card-grid";
import { useModalState } from "@/hooks/use-modal-state";
import CreateInventoryModal from "../modal/create-inventory-modal";
import { GetAllInventoryProviderResponse } from "@/types/inventory";
import { useEffect, useState } from "react";
import { getSupplierItemsCount } from "@/services/dashboard";
import Link from "next/link";
import { Button } from "@/components/button/button";
import { SupplierItemsCount } from "@/types/dashboard";

interface Props {
  inventories: ApiResponse<GetAllInventoryProviderResponse>;
  query: SearchParams;
  hideCreate?: boolean;
  providerId?: string; // s
  // upplier id for supplier create mode
  forProvider?: boolean;
  counters?: SupplierItemsCount;
  afterCreateRedirectTo?: string;
}

export default function InventoryCardListContainer({
  inventories: inventoriesResponse,
  query,
  hideCreate = false,
  providerId,
  forProvider,
  counters,
  afterCreateRedirectTo,
}: Props) {
  const { getModalState, openModal, closeModal } = useModalState();

  // Modal states controlled by URL
  const createPermissionModal = getModalState("create");
  const handleOpen = () => {
    if (hideCreate) return; // prevent opening if not allowed
    openModal("create");
  };
  const onCloseModal = () => {
    closeModal("create");
  };
  const { updateFiltersInUrl } = useFiltersUrl();
  const handleSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  const showBlockingOverlay =
    counters?.bankAccountCount === 0 ||
    counters?.productCount === 0 ||
    counters?.storeCount === 0 ||
    counters?.warehouseCount === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Gestión de Inventarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra los inventarios del sistema y sus datos asociados
          </p>
        </div>
      </div>

      <div className="relative">
        <InventoryCardGrid
          data={inventoriesResponse.data}
          searchParams={query}
          onSearchParamsChange={handleSearchParamsChange}
          onCreate={hideCreate || showBlockingOverlay ? () => {} : handleOpen}
        />

        {showBlockingOverlay && (
          <div className="pointer-events-auto absolute inset-0 z-20 flex items-start justify-center bg-white/70 p-4 pt-8 backdrop-blur-sm dark:bg-black/60">
            <div className="w-full max-w-3xl">
              <div className="rounded-2xl border border-info/30 bg-white/90 p-4 shadow-lg dark:border-info/40 dark:bg-gray-950/95">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                  Antes de crear un inventario
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Para poder crear inventarios primero debes completar algunos
                  pasos básicos de configuración:
                </p>

                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {counters?.productCount === 0 && (
                    <li>• Crear al menos un producto en tu catálogo.</li>
                  )}
                  {counters?.storeCount === 0 && (
                    <li>
                      • Configurar al menos una tienda donde mostrar tus
                      productos.
                    </li>
                  )}
                  {counters?.warehouseCount === 0 && (
                    <li>
                      • Registrar al menos un almacén desde el que saldrá el
                      stock.
                    </li>
                  )}
                  {counters?.bankAccountCount === 0 && (
                    <li>
                      • Configurar al menos una cuenta bancaria para recibir tus
                      cobros.
                    </li>
                  )}
                  {counters?.zoneCount === 0 && (
                    <li>
                      • (Opcional) Definir una o más zonas de entrega para tus
                      pedidos.
                    </li>
                  )}
                </ul>

                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                  <span>
                    Completa primero estos pasos y luego vuelve aquí para crear
                    tu inventario. Puedes seguir navegando usando el menú
                    lateral.
                  </span>
                  <Link href="/dashboard/welcome">
                    <Button size="sm" variant="outline">
                      Ver guía de configuración
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {!hideCreate && (
        <CreateInventoryModal
          forProvider={forProvider}
          open={createPermissionModal.open}
          onClose={onCloseModal}
          provider={providerId}
          afterCreateRedirectTo={afterCreateRedirectTo}
        />
      )}
    </div>
  );
}
