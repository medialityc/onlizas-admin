"use client";
import { BusinessLogs } from "@/types/business";
import { formatDateTime } from "@/utils/format";
import DescriptionViewer from "@/components/logs/description-viewer";

export function BusinessLogDetail({ log }: { log: BusinessLogs }) {
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
            Empresa
          </div>
          <div
            className="text-sm font-medium truncate"
            title={log.businessName}
          >
            {log.businessName}
          </div>
          <div className="text-xs text-gray-500">
            Código: {log.businessCode}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Ubicación
          </div>
          <div className="text-sm">{log.locationName || "-"}</div>
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
            Propietario
          </div>
          <div className="text-sm">{log.ownerName || "-"}</div>
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
          <div className="truncate" title={`ownerId: ${log.ownerId}`}>
            ownerId: {log.ownerId}
          </div>
          <div className="truncate" title={`locationId: ${log.locationId}`}>
            locationId: {log.locationId}
          </div>
          <div className="truncate" title={`businessGuid: ${log.businessGuid}`}>
            businessGuid: {log.businessGuid}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessLogDetail;
