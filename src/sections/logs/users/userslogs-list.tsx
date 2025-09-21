"use client";
import { DataGrid } from "@/components/datagrid";
import { GetAllUsersLogsResponse, UserLogs } from "@/types/users";
import { SearchParams } from "@/types/fetch/request";
import { formatDate, formatDateTime } from "@/utils/format";
import { DataTableColumn } from "mantine-datatable";
import React, { useMemo, useState, useCallback } from "react";

import SimpleModal from "@/components/modal/modal";
import DescriptionViewer from "@/components/logs/description-viewer";
import { InformationCircleIcon, EyeIcon } from "@heroicons/react/24/outline";
import { extractRecord } from "../utils";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

function UsersLogsContent({
  data,
  searchParams,
  onSearchParamsChange,
}: {
  data: GetAllUsersLogsResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<UserLogs | null>(null);

  // Control de permisos
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) => permissions.some((p) => p.code === perm));
  };
  const hasReadPermission = hasPermission(["READ_ALL"]);

  const handleRowClick = useCallback((rowOrWrapper: any) => {
    const row = extractRecord<UserLogs>(rowOrWrapper);
    setSelected(row);
    setOpen(true);
  }, []);

  const grouped = useMemo(() => {
    const groups: Record<string, UserLogs[]> = {};
    (data.data || []).forEach((row) => {
      const d = new Date(row.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; // YYYY-MM-DD
      groups[key] = groups[key] || [];
      groups[key].push(row);
    });
    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [data]);

  const columns: DataTableColumn<UserLogs>[] = [
    {
      accessor: "timestamp",
      title: "Fecha/Hora",
      sortable: true,
      render: (row) => formatDateTime(row.timestamp),
    },
    { accessor: "userId", title: "ID", sortable: true },
    { accessor: "userName", title: "Usuario", sortable: true },
    { accessor: "userEmail", title: "Email", sortable: false },
    { accessor: "apiRole", title: "Rol API", sortable: true },
    {
      accessor: "isBlocked",
      title: "Bloqueado",
      render: (row) => (row.isBlocked ? "Sí" : "No"),
      sortable: true,
    },
    {
      accessor: "isVerified",
      title: "Verificado",
      render: (row) => (row.isVerified ? "Sí" : "No"),
      sortable: true,
    },
    {
      accessor: "actions",
      title: "",
      render: (row) => (
        hasReadPermission ? (
          <button
            type="button"
            onClick={() => handleRowClick(row)}
            className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:border-primary/60 hover:text-primary"
            aria-label="Ver detalles"
            title="Ver detalles"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
        ) : null
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <InformationCircleIcon className="h-4 w-4" />
        Haz clic en una fila para ver los detalles del log.
      </div>
      {grouped.length > 0 ? (
        <div className="space-y-8">
          {grouped.map(([dayKey, rows]) => (
            <div key={dayKey} className="space-y-3">
              <div className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/60 backdrop-blur py-1 px-2 rounded border border-gray-200 dark:border-gray-700 w-fit">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(dayKey)}
                </div>
              </div>
              <DataGrid
                simpleData={rows}
                columns={columns}
                searchParams={searchParams}
                onSearchParamsChange={onSearchParamsChange}
                searchPlaceholder="Buscar usuarios..."
                emptyText="No se encontraron logs de usuarios"
                enablePagination={false}
                onRowClick={hasReadPermission ? handleRowClick : undefined}
              />
            </div>
          ))}
          <SimpleModal
            open={open}
            onClose={() => setOpen(false)}
            title="Detalle del Log de Usuario"
            subtitle={
              selected
                ? `${selected.userName} · ${selected.userEmail}`
                : undefined
            }
            className="max-w-3xl"
          >
            {selected && (
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Fecha/Hora
                  </div>
                  <div className="font-medium">
                    {formatDateTime(selected.timestamp)}
                  </div>
                </div>
                <DescriptionViewer text={selected.description} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Usuario
                    </div>
                    <div
                      className="font-medium truncate"
                      title={selected.userName}
                    >
                      {selected.userName}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {selected.userId}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Email
                    </div>
                    <div className="truncate" title={selected.userEmail}>
                      {selected.userEmail}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="truncate">Rol API: {selected.apiRole}</div>
                  <div className="truncate">
                    Bloqueado: {selected.isBlocked ? "Sí" : "No"}
                  </div>
                  <div className="truncate">
                    Verificado: {selected.isVerified ? "Sí" : "No"}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div
                    className="truncate"
                    title={`changedById: ${selected.changedById}`}
                  >
                    changedById: {selected.changedById}
                  </div>
                  <div
                    className="truncate"
                    title={`changedByName: ${selected.changedByName}`}
                  >
                    changedByName: {selected.changedByName}
                  </div>
                </div>
              </div>
            )}
          </SimpleModal>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-sm text-gray-600 dark:text-gray-400">
          No hay registros para mostrar
        </div>
      )}
    </div>
  );
}

export default UsersLogsContent;
