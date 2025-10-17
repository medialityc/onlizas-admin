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
          <InfoCard title="ID">{location?.id}</InfoCard>
          <InfoCard title="Global ID">{location?.globalId || '—'}</InfoCard>
          <InfoCard title="Nombre">{location?.name || '—'}</InfoCard>
          <InfoCard title="Código de País">
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="size-5 text-purple-500" />
              <span>{location?.countryCode || '—'}</span>
            </div>
          </InfoCard>
          <InfoCard title="Estado">{location?.state || '—'}</InfoCard>
          <InfoCard title="Distrito">{location?.district || '—'}</InfoCard>
          <InfoCard title="Dirección Original">{location?.addressRaw || '—'}</InfoCard>
          <InfoCard title="Dirección Normalizada">{location?.addressNormalized || '—'}</InfoCard>
          <InfoCard title="Código Postal">{location?.postalCode || '—'}</InfoCard>
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
          <InfoCard title="Geohash">{location?.geohash || '—'}</InfoCard>
          <InfoCard title="Place ID">{location?.placeId || '—'}</InfoCard>
          <InfoCard title="Tipo">{location?.type !== undefined ? location.type : '—'}</InfoCard>
          <InfoCard title="Estado">{location?.status !== undefined ? location.status : '—'}</InfoCard>
          <InfoCard title="Dirección Parcial">{location?.partialAddress ? 'Sí' : 'No'}</InfoCard>
          <InfoCard title="Corrección Manual">{location?.hasManualCorrection ? 'Sí' : 'No'}</InfoCard>
          <InfoCard title="Tags">
            {location?.tags && location.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {location.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            ) : '—'}
          </InfoCard>
          <InfoCard title="Versión">{location?.version !== undefined ? location.version : '—'}</InfoCard>
          <InfoCard title="Fecha de Creación">{location?.createdDatetime ? new Date(location.createdDatetime).toLocaleString() : '—'}</InfoCard>
          <InfoCard title="Fecha de Actualización">{location?.updatedDatetime ? new Date(location.updatedDatetime).toLocaleString() : '—'}</InfoCard>
          <InfoCard title="Fecha de Eliminación">{location?.deletedAt ? new Date(location.deletedAt).toLocaleString() : '—'}</InfoCard>
          <InfoCard title="Activo">{location?.active ? 'Sí' : 'No'}</InfoCard>
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
