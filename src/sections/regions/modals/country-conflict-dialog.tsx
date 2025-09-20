"use client";

import SimpleModal from "@/components/modal/modal";

interface CountryConflictDialogProps {
  open: boolean;
  onClose: () => void;
  onMoveCountries: () => void;
  errorMessage: string;
}

export default function CountryConflictDialog({
  open,
  onClose,
  onMoveCountries,
  errorMessage
}: CountryConflictDialogProps) {
  // Extraer el nombre del país del mensaje de error
  const extractCountryName = (message: string) => {
    try {
      // Buscar patrones como "Countries already associated to other regions: Equatorial Guinea"
      const match = message.match(/:\s*([^(]+)(?:\s*\(|$)/);
      return match ? match[1].trim() : "el país seleccionado";
    } catch {
      return "el país seleccionado";
    }
  };

  const countryName = extractCountryName(errorMessage);

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Países ya asociados"
      loading={false}
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Conflicto de países
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    El país <strong>{countryName}</strong> ya está asociado a otra región.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                ¿Qué deseas hacer?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Puedes mover el país desde su región actual a esta nueva región, o cancelar la operación.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onMoveCountries}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Mover país a esta región
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}