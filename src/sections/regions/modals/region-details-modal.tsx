"use client";

import SimpleModal from "@/components/modal/modal";
import { Region } from "@/types/regions";
import RegionGeneralInfo from "./components/region-general-info";
import RegionCountriesSection from "./components/region-countries-section";

interface RegionDetailsModalProps {
  region: Region;
  open: boolean;
  onClose: () => void;
  loading: boolean;
}

export function RegionDetailsModal({
  region,
  open,
  onClose,
  loading,
}: RegionDetailsModalProps) {
  return (
    <SimpleModal
      title="Detalles de la Región"
      loading={loading}
      open={open}
      onClose={onClose}
    >
  <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <RegionGeneralInfo region={region} />
        <RegionCountriesSection region={region} />

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
