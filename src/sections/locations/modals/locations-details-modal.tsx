"use client";

import { ILocation } from "@/types/locations";
import SimpleModal from "@/components/modal/modal";
import { TagIcon, MapPinIcon, GlobeAltIcon } from "@heroicons/react/24/solid";

interface LocationsDetailsModalProps {
  open: boolean;
  onClose: () => void;
  location: ILocation;
  loading: boolean;
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </label>
      <div className="text-sm text-gray-900 dark:text-gray-100">{children}</div>
    </div>
  );
}

export function LocationsDetailsModal({
  open,
  onClose,
  location,
  loading,
}: LocationsDetailsModalProps) {
  if (!open) return null;

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      loading={loading}
      title="Detalles de Localización"
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard title="ID">#{location?.id}</InfoCard>
          <InfoCard title="Nombre">{location?.name || '—'}</InfoCard>
          <InfoCard title="Dirección">{location?.address_raw || '—'}</InfoCard>
          <InfoCard title="País">
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="size-5 text-purple-500" />
              <span>{location?.country_code || '—'}</span>
            </div>
          </InfoCard>
          <InfoCard title="Estado">{location?.state || '—'}</InfoCard>
          <InfoCard title="Distrito">{location?.district || '—'}</InfoCard>
          <InfoCard title="Coordenadas">
            {typeof location?.latitude === 'number' && typeof location?.longitude === 'number' ? (
              <div className="flex flex-col">
                <span className="font-mono">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
                <a
                  className="text-xs text-primary mt-1"
                  href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver en Google Maps
                </a>
              </div>
            ) : (
              '—'
            )}
          </InfoCard>
          <InfoCard title="Tipo">{location?.type || 'N/A'}</InfoCard>
          <InfoCard title="Estado del Registro">{location?.status || '—'}</InfoCard>
        </div>
                        
        <div className="pt-4 flex justify-end">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}
