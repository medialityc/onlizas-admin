"use client";

import { AlertBox } from "@/components/alert/alert-box";
import SimpleModal from "@/components/modal/modal";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Category } from "@/types/categories";
import Link from "next/link";
import { usePermissions } from "zas-sso-client";

interface CategoriesModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category; // Opcional si se usa para editar
  loading: boolean;
}

export default function CategoriesModal({
  open,
  onClose,
  category,
  loading,
}: CategoriesModalProps) {
  const [error, setError] = useState<string | null>(null);
  useQueryClient();

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };
  const canEdit = hasPermission(["Update","Create"]) ;

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading}
      title={category ? "Ver Categoría" : "Categoría"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <AlertBox title="Error" variant="danger" message={error} />
          </div>
        )}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-outline-secondary"
          >
            Cerrar
          </button>
          {canEdit && (
            <Link
              href={
                category
                  ? `/dashboard/categories/${category.id}/edit`
                  : "/dashboard/categories/new"
              }
              className="btn btn-primary "
            >
              {category ? "Editar en vista" : "Crear en vista"}
            </Link>
          )}
        </div>
      </div>
    </SimpleModal>
  );
}
