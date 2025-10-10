"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import SimpleModal from "@/components/modal/modal";
import LoaderButton from "@/components/loaders/loader-button";
import { AlertBox } from "@/components/alert/alert-box";
import { ILocation } from "@/types/locations";
import { deleteLocation } from "@/services/locations";
import { getAllWarehouses } from "@/services/warehouses";
import { getAllBusiness } from "@/services/business";

interface LocationDeleteModalProps {
  open: boolean;
  onClose: () => void;
  location: ILocation | null;
  onSuccess?: () => void;
}

interface LocationReferences {
  warehouses: Array<{ id: number|string; name: string }>;
  businesses: Array<{ id: number|string; name: string }>;
  totalReferences: number;
}

export default function LocationDeleteModal({
  open,
  onClose,
  location,
  onSuccess,
}: LocationDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [checkingReferences, setCheckingReferences] = useState(false);
  const [references, setReferences] = useState<LocationReferences>({
    warehouses: [],
    businesses: [],
    totalReferences: 0,
  });
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();

  // Check references when modal opens
  useEffect(() => {
    if (!open || !location) return;

    const checkReferences = async () => {
      setCheckingReferences(true);
      try {
        const [warehousesRes, businessRes] = await Promise.all([
          getAllWarehouses({ pageSize: 100, locationId: location.id }),
          getAllBusiness({ pageSize: 100, locationId: location.id }),
        ]);

        const warehouses = warehousesRes?.data?.data?.filter(w => w.locationId === location.id) || [];
        const businesses = businessRes?.data?.data?.filter(b => b.locationId === location.id) || [];

        setReferences({
          warehouses: warehouses.map(w => ({ id: w.id || 0, name: w.name || '' })),
          businesses: businesses.map(b => ({ id: b.id || 0, name: b.name || '' })),
          totalReferences: warehouses.length + businesses.length,
        });
      } catch (error) {
        console.error("Error checking location references:", error);
        toast.error("Error al verificar referencias de la ubicación");
      } finally {
        setCheckingReferences(false);
      }
    };

    checkReferences();
  }, [open, location]);

  const handleDelete = async () => {
    if (!location) return;

    // Block deletion if there are references
    if (references.totalReferences > 0) {
      toast.error("No se puede eliminar una ubicación con referencias activas");
      return;
    }

    setLoading(true);
    try {
      const response = await deleteLocation(location.id);
      
      if (!response.error) {
        queryClient.invalidateQueries({ queryKey: ["locations"] });
        toast.success("Ubicación eliminada exitosamente");
        onSuccess?.();
        onClose();
      } else {
        toast.error(response.message || "Error al eliminar la ubicación");
      }
    } catch (error) {
      console.error("Delete location error:", error);
      toast.error("Error al eliminar la ubicación");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setReferences({ warehouses: [], businesses: [], totalReferences: 0 });
    onClose();
  };

  if (!open || !location) return null;

  const canDelete = references.totalReferences === 0 && !checkingReferences;
  const hasReferences = references.totalReferences > 0;

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading || checkingReferences}
      title="Eliminar Ubicación"
    >
      <div className="p-6">
        {checkingReferences ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando referencias...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                ¿Está seguro que desea eliminar esta ubicación?
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                <p className="font-medium text-gray-900 dark:text-white">{location.name}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{location.addressRaw}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {location.district}, {location.state} - {location.countryCode}
                </p>
              </div>
            </div>

            {hasReferences ? (
              <AlertBox
                variant="danger"
                title="No se puede eliminar"
                message={
                  <div>
                    <div>Esta ubicación tiene {references.totalReferences} referencia(s) activa(s) y no puede ser eliminada.</div>
                    <div className="mt-3 space-y-2">
                      {references.warehouses.length > 0 && (
                        <div>
                          <p className="font-medium">
                            Almacenes ({references.warehouses.length}):
                          </p>
                          <ul className="text-sm ml-4">
                            {references.warehouses.map(w => (
                              <li key={w.id}>• {w.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {references.businesses.length > 0 && (
                        <div>
                          <p className="font-medium">
                            Negocios ({references.businesses.length}):
                          </p>
                          <ul className="text-sm ml-4">
                            {references.businesses.map(b => (
                              <li key={b.id}>• {b.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            ) : (
              <>
                <AlertBox
                  variant="warning"
                  title="Eliminación permanente"
                  message="Esta acción no se puede deshacer. La ubicación será marcada como eliminada pero se conservará en el historial."
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Razón de eliminación (opcional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="form-input w-full"
                    rows={3}
                    placeholder="Ingrese el motivo de la eliminación..."
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline-secondary"
                disabled={loading}
              >
                Cancelar
              </button>
              
              {canDelete && (
                <LoaderButton
                  onClick={handleDelete}
                  loading={loading}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  Eliminar Ubicación
                </LoaderButton>
              )}
            </div>
          </>
        )}
      </div>
    </SimpleModal>
  );
}
