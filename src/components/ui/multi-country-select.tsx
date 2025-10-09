import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMultiCountrySelect } from "@/sections/regions/hooks/use-multi-country-select";

interface CountryFlagProps {
  code: string;
  className?: string;
  height?: number;
  width?: number;
}

function CountryFlag({ code, className, height = 20, width = 30 }: CountryFlagProps) {
  const [src, setSrc] = useState(`/assets/images/flags/${String(code || "").toUpperCase()}.svg`);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={String(code)}
      onError={() => {
        if (src !== "/assets/images/flags/EN.svg") {
          setSrc("/assets/images/flags/EN.svg");
        }
      }}
      className={className}
      height={height}
      width={width}
    />
  );
}

interface MultiCountrySelectProps {
  selectedCountryIds: string[];
  onSelectionChange: (countryIds: string[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export default function MultiCountrySelect({
  selectedCountryIds,
  onSelectionChange,
  placeholder = "Selecciona países",
  label,
  required = false,
  disabled = false,
  error,
}: MultiCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showExpandedView, setShowExpandedView] = useState(false);

  const {
    selectedCountries,
    loading,
    error: hookError,
    searchTerm,
    setSearchTerm,
    filteredCountries,
    toggleCountry,
    removeCountry,
    selectedCountryIds: hookSelectedIds,
    setSelectedCountryIds,
  } = useMultiCountrySelect({
    initialCountryIds: selectedCountryIds,
  });

  // Notify parent when selection changes in the hook
  const prevHookSelectedIds = useRef<string[]>([]);
  useEffect(() => {
    // Only notify if the hook's selection actually changed
    if (!arraysEqual(hookSelectedIds, prevHookSelectedIds.current)) {
      onSelectionChange(hookSelectedIds);
      prevHookSelectedIds.current = [...hookSelectedIds];
    }
  }, [hookSelectedIds, onSelectionChange]);

  // Sync external changes with hook state - use ref to avoid infinite loop
  const prevSelectedCountryIds = useRef<string[]>([]);
  useEffect(() => {
    if (!arraysEqual(selectedCountryIds, prevSelectedCountryIds.current)) {
      // Only update if external prop actually changed
      if (!arraysEqual(selectedCountryIds, hookSelectedIds)) {
        setSelectedCountryIds(selectedCountryIds);
      }
      prevSelectedCountryIds.current = [...selectedCountryIds];
    }
  }, [selectedCountryIds, setSelectedCountryIds]);

  // Helper function to compare arrays
  function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort((x, y) => x.localeCompare(y));
    const sortedB = [...b].sort((x, y) => x.localeCompare(y));
    return sortedA.every((val, index) => val === sortedB[index]);
  }

  const displayError = error || hookError;

  const handleToggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [disabled, isOpen]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleCountrySelect = useCallback((countryId: string) => {
    toggleCountry(countryId);
  }, [toggleCountry]);

  const handleRemoveCountry = useCallback((countryId: string) => {
    removeCountry(countryId);
  }, [removeCountry]);

  // Determinar si mostrar modo compacto (más de 3 países para testing)
  const shouldShowCompactMode = selectedCountries.length > 3;
  const maxVisibleTags = 2;

  // Debug logs
  // console.log('MultiCountrySelect Debug:', {
  //   selectedCountriesCount: selectedCountries.length,
  //   shouldShowCompactMode,
  //   selectedCountryIds,
  //   hookSelectedIds,
  // });

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={`form-input w-full min-h-[42px] cursor-pointer ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } ${displayError ? "border-red-500 ring-red-500" : ""}`}
          onClick={handleToggleDropdown}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {selectedCountries.length === 0 ? (
                <span className="text-gray-500">{placeholder}</span>
              ) : shouldShowCompactMode ? (
                // Modo compacto para muchas selecciones
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {selectedCountries.slice(0, maxVisibleTags).map((country) => (
                      <div
                        key={country.id}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        <CountryFlag
                          code={country.code}
                          className="h-3 w-4 object-cover rounded-sm"
                          height={12}
                          width={16}
                        />
                        <span>{country.name}</span>
                        {!disabled && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCountry(country.id);
                            }}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                            title="Quitar país"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      +{selectedCountries.length - maxVisibleTags} más
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowExpandedView(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Ver todos
                    </button>
                  </div>
                </div>
              ) : (
                // Modo normal para pocas selecciones
                <div className="flex flex-wrap gap-1">
                  {selectedCountries.map((country) => (
                    <div
                      key={country.id}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      <CountryFlag
                        code={country.code}
                        className="h-3 w-4 object-cover rounded-sm"
                        height={12}
                        width={16}
                      />
                      <span>{country.name}</span>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCountry(country.id);
                          }}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          title="Quitar país"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <ChevronDownIcon
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <input
                type="text"
                placeholder="Buscar país..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <span className="mt-2 block">Cargando países...</span>
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No se encontraron países
                </div>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = hookSelectedIds.includes(country.id);
                  return (
                    <div
                      key={country.id}
                      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        isSelected ? "bg-blue-50 dark:bg-blue-900" : ""
                      }`}
                      onClick={() => handleCountrySelect(country.id)}
                    >
                      <CountryFlag
                        code={country.code}
                        className="h-5 w-6 object-cover rounded-sm"
                        height={20}
                        width={30}
                      />
                      <span className="flex-1">{country.name}</span>
                      {isSelected && (
                        <span className="text-blue-600 font-medium">✓</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p className="mt-1 text-sm text-red-600">{displayError}</p>
      )}

      {/* Modal de vista expandida para muchas selecciones */}
      {showExpandedView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Países seleccionados ({selectedCountries.length})
                </h3>
                <button
                  onClick={() => setShowExpandedView(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Cerrar modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Barra de búsqueda dentro del modal */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar en países seleccionados..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lista de países seleccionados */}
              <div className="max-h-96 overflow-y-auto">
                {selectedCountries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No hay países seleccionados
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {selectedCountries
                      .filter(country =>
                        !searchTerm ||
                        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        country.code.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((country) => (
                        <div
                          key={country.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <CountryFlag
                              code={country.code}
                              className="h-6 w-8 object-cover rounded-sm"
                              height={24}
                              width={32}
                            />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {country.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {country.code}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveCountry(country.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Quitar país"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Acciones del modal */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowExpandedView(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
