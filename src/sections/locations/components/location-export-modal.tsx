"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import SimpleModal from "@/components/modal/modal";
import LoaderButton from "@/components/loaders/loader-button";
import { getAllLocations } from "@/services/locations";
import { ILocation } from "@/types/locations";
import { IQueryable } from "@/types/fetch/request";

interface LocationExportModalProps {
  open: boolean;
  onClose: () => void;
  appliedFilters?: IQueryable;
}

export default function LocationExportModal({
  open,
  onClose,
  appliedFilters = {},
}: LocationExportModalProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const queryParams = { ...appliedFilters, pageSize: 10 };
      const response = await getAllLocations(queryParams);
      console.log("Respuesta del servicio:", response);

      if (response.error) {
        toast.error(response.message || "Error al obtener los datos para exportar");
        return;
      }

      if (!response.data?.data) {
        toast.error("No se encontraron datos para exportar");
        return;
      }

      const locations = response.data.data;
      
      if (locations.length === 0) {
        toast.warning("No hay datos para exportar");
        return;
      }

      downloadCSV(locations);
      toast.success(`${locations.length} localizaciones exportadas`);
      onClose();
    } catch (error) {
      console.error("Export error:", error);
      const errorMessage = error instanceof Error ? error.message : "Error durante la exportación";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const safeString = (value: any): string => {
    if (value === null || value === undefined) return "";
    return String(value).replace(/"/g, '""');
  };

  const downloadCSV = (locations: ILocation[]) => {
    const headers = ["ID", "Nombre", "País", "Estado", "Distrito", "Dirección", "Latitud", "Longitud", "Tipo", "Estado", "Tags"];
    
    const csvContent = [
      headers.join(","),
      ...locations.map(location => [
        location.id || "",
        `"${safeString(location.name)}"`,
        `"${safeString(location.countryCode)}"`,
        `"${safeString(location.state)}"`,
        `"${safeString(location.district)}"`,
        `"${safeString(location.addressRaw)}"`,
        location.latitude || "",
        location.longitude || "",
        `"${safeString(location.type)}"`,
        `"${safeString(location.status)}"`,
        `"${location.tags?.join(';') || ''}"`
      ].join(","))
    ].join("\n");

    // Add UTF-8 BOM for proper Excel recognition
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `localizaciones_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      loading={loading}
      title="Exportar Localizaciones"
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Los datos se descargarán como archivo CSV con los filtros aplicados actualmente.
            </p>
          </div>
        </div>

        {Object.keys(appliedFilters).length > 0 && (
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Filtros aplicados:
            </p>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              {Object.entries(appliedFilters).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          
          <LoaderButton
            onClick={handleExport}
            loading={loading}
            className="btn btn-primary"
            disabled={loading}
          >
            Exportar CSV
          </LoaderButton>
        </div>
      </div>
    </SimpleModal>
  );
}
