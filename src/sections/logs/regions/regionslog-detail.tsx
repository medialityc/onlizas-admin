"use client";
import { RegionLogs } from "@/types/regions";
import { formatDateTime } from "@/utils/format";
import DescriptionViewer from "@/components/logs/description-viewer";

export function RegionLogDetail({ log }: { log: RegionLogs }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Fecha/Hora
        </div>
        <div className="text-sm font-medium">
          {formatDateTime(log.timestamp)}
        </div>
      </div>

      <DescriptionViewer text={log.description} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Región
          </div>
          <div
            className="text-sm font-medium truncate"
            title={log.regionName}
          >
            {log.regionName}
          </div>
          <div className="text-xs text-gray-500">
            Código: {log.regionCode}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Acción
          </div>
          <div className="text-sm">{log.action || "-"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Usuario
          </div>
          <div className="text-sm">{log.userName || "-"}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Tipo de Entidad
          </div>
          <div className="text-sm">{log.entityType || "-"}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          IDs
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="truncate" title={`userId: ${log.userId}`}>
            userId: {log.userId}
          </div>
          <div className="truncate" title={`regionId: ${log.regionId}`}>
            regionId: {log.regionId}
          </div>
          {log.entityId && (
            <div className="truncate" title={`entityId: ${log.entityId}`}>
              entityId: {log.entityId}
            </div>
          )}
        </div>
      </div>

      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Metadatos
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegionLogDetail;