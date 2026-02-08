"use client";

import { Modal, Stack, Badge, Group } from "@mantine/core";
import type { ContractSupplier } from "@/services/importer-portal";

interface Props {
  open: boolean;
  onClose: () => void;
  supplier: ContractSupplier | null | undefined;
}

export default function SupplierDetailsModal({ open, onClose, supplier }: Props) {
  if (!supplier) return null;

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Información del Proveedor"
      size="lg"
      centered
      styles={{
        content: {
          backgroundColor: "light-dark(#ffffff, #0e1726)",
        },
        header: {
          backgroundColor: "light-dark(#ffffff, #0e1726)",
          borderBottom: "1px solid light-dark(#e5e7eb, #1b2e4b)",
        },
        title: {
          color: "light-dark(#000000, #ffffff)",
          fontWeight: 600,
        },
        close: {
          color: "light-dark(#374151, #e5e7eb)",
        },
        body: {
          backgroundColor: "light-dark(#ffffff, #0e1726)",
        },
      }}
    >
      <Stack gap="md">
        <Group grow>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Nombre
            </p>
            <p className="text-md font-medium text-gray-900 dark:text-gray-100">
              {supplier.supplierName || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Estado
            </p>
            <Badge
              color={supplier.isActive ? "green" : "red"}
              variant="filled"
              size="md"
            >
              {supplier.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </Group>

        <Group grow>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Correo Electrónico
            </p>
            <p className="text-md font-medium text-gray-900 dark:text-gray-100">
              {supplier.supplierEmail || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Teléfono
            </p>
            <p className="text-md font-medium text-gray-900 dark:text-gray-100">
              {supplier.phone || "-"}
            </p>
          </div>
        </Group>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Dirección
          </p>
          <p className="text-md font-medium text-gray-900 dark:text-gray-100">
            {supplier.address || "-"}
          </p>
        </div>

        <Group grow>
        <Group grow>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Tipo de Vendedor
            </p>
            <p className="text-md font-medium text-gray-900 dark:text-gray-100">
              {supplier.sellerType || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Nacionalidad
            </p>
            <p className="text-md font-medium text-gray-900 dark:text-gray-100">
              {supplier.nationality || "-"}
            </p>
          </div>
        </Group>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              País
            </p>
            <p className="text-md font-medium text-gray-900 dark:text-gray-100">
              {supplier.country || "-"}
            </p>
          </div>
        </Group>

        {supplier.requestedCategories && supplier.requestedCategories.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Categorías Solicitadas
            </p>
            <div className="flex flex-wrap gap-2">
              {supplier.requestedCategories.map((category) => (
                <Badge key={category.id} variant="light" color="blue" size="md">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Stack>
    </Modal>
  );
}
