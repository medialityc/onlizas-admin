import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AdvancedSearchSelect } from "./advance-form-select";

interface SelectProps<T> extends AdvancedSearchSelect<T> {
  inputRef?: React.RefObject<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  options: T[];
  objectValueKey: keyof T;
  objectKeyLabel?: keyof T;
  exclude?: string[];
  loading?: boolean;
  required?: boolean;
  multiple?: boolean;
  value?: T[keyof T] | T[keyof T][];
  onChange?: (value: T[keyof T] | T[keyof T][]) => void;
  onChangeOptional?: () => void;
  onScrollEnd?: () => void;
  renderOption?: (option: T) => React.ReactNode;
  dataTest?: string;
  containerClassname?: string;
  pillsClassname?: string;
  inputClassname?: string;
  renderMultiplesValues?: (
    options: T[],
    removeSelected: (option: T) => void
  ) => React.ReactNode;
  error?: { message?: string };
  disabled?: boolean;
  displayValue?: (option: T) => string;
  /**
   * Props para el componente Select.
   * @template T Tipo de las opciones.
   * @property {React.RefObject<HTMLInputElement>} [inputRef] Referencia al input para manipulación directa (enfocar, limpiar, etc).
   * @property {string} [label] Texto que se muestra como etiqueta arriba del input.
   * @property {string} [placeholder] Texto de ayuda que aparece dentro del input cuando está vacío.
   * @property {T[]} options Arreglo de objetos que representan las opciones disponibles para seleccionar.
   * @property {keyof T} objectValueKey Propiedad del objeto opción que se usará como valor único (por ejemplo, "id").
   * @property {keyof T} [objectKeyLabel] Propiedad del objeto opción que se usará como texto visible en la lista (por ejemplo, "nombre"). Si no se especifica, se usa el valor.
   * @property {string[]} [exclude] Lista de valores (según objectValueKey) que se deben excluir de las opciones.
   * @property {boolean} [loading] Si es true, muestra un spinner de carga en el input.
   * @property {boolean} [required] Si es true, indica que el campo es obligatorio y muestra un asterisco en la etiqueta.
   * @property {boolean} [multiple] Si es true, permite seleccionar varias opciones a la vez (modo multiselección).
   * @property {T[keyof T] | T[keyof T][]} [value] Valor o valores actualmente seleccionados. Puede ser un solo valor o un array si es múltiple.
   * @property {(value: T[keyof T] | T[keyof T][]) => void} [onChange] Función que se llama cuando el usuario selecciona o deselecciona una opción. Recibe el nuevo valor o valores.
   * @property {() => void} [onChangeOptional] Función opcional que se ejecuta en cada cambio, útil para side effects.
   * @property {() => void} [onScrollEnd] Función que se llama cuando el usuario llega al final del scroll en la lista de opciones (útil para paginación o carga dinámica).
   * @property {(option: T) => React.ReactNode} [renderOption] Permite personalizar el renderizado de cada opción en la lista.
   * @property {string} [dataTest] Prop para agregar un atributo de testeo (data-test) al contenedor principal.
   * @property {string} [containerClassname] Clase CSS adicional para el contenedor principal del select.
   * @property {string} [pillsClassname] Clase CSS adicional para los "pills" (chips) de opciones seleccionadas en modo múltiple.
   * @property {string} [inputClassname] Clase CSS adicional para el input de búsqueda.
   * @property {(options: T[], removeSelected: (option: T) => void) => React.ReactNode} [renderMultiplesValues] Permite personalizar el renderizado de los valores seleccionados en modo múltiple.
   * @property {{ message?: string }} [error] Objeto de error, con mensaje a mostrar debajo del input si hay error de validación.
   * @property {boolean} [disabled] Si es true, deshabilita el input y no permite interacción.
   * @property {() => void} [displayValue] Valor que se muestra en el input.
   */
}

export function Select<T>({
  label,
  placeholder,
  options,
  objectValueKey,
  objectKeyLabel,
  exclude,
  loading,
  required,
  multiple = false,
  value,
  onChange,
  onChangeOptional,
  onScrollEnd,
  renderOption,
  dataTest,
  containerClassname,
  pillsClassname,
  renderMultiplesValues,
  error,
  disabled,
  inputClassName,
  inputRef,
  displayValue,
}: SelectProps<T>) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const isQuerySelected = () => {
    // Si no hay valor seleccionado, no hay coincidencia
    if (!value) return false;

    // Puede ser múltiple o simple
    const selectedValues = Array.isArray(value) ? value : [value];

    // Recorremos las opciones seleccionadas y comparamos el keyLabel con el query
    return options.some(
      (option) =>
        selectedValues.includes(option[objectValueKey]) &&
        getKeyLabelValue(option).toLowerCase() === query.trim().toLowerCase()
    );
  };

  // Get keyLabel value for an option (for filtering/search)
  const getKeyLabelValue = useCallback(
    (option: T): string => {
      return String(
        objectKeyLabel ? option[objectKeyLabel] : option[objectValueKey]
      );
    },
    [objectKeyLabel, objectValueKey]
  );
  // Get display value for an option (for input display)
  const getDisplayValue = useCallback(
    (option: T): string => {
      if (displayValue) {
        return displayValue(option);
      }
      if (renderOption) {
        const rendered = renderOption(option);
        if (typeof rendered === "string") {
          return rendered;
        }
      }
      return getKeyLabelValue(option);
    },
    [displayValue, renderOption, getKeyLabelValue]
  );

  // Filter options based on exclude and query
  const filteredOptions = (() => {
    const baseOptions = options.filter(
      (opt) => !exclude?.includes(String(opt[objectValueKey]))
    );
    if (query.trim() === "" || isQuerySelected()) {
      // Si no hay query o el query es igual a un seleccionado, muestra todas
      return baseOptions;
    }
    // Si no, filtra normalmente usando keyLabel
    return baseOptions.filter((opt) => {
      const keyLabelValue = getKeyLabelValue(opt).toLowerCase();
      return keyLabelValue.includes(query.toLowerCase());
    });
  })();
  const handleScroll = () => {
    if (!scrollRef.current || !onScrollEnd) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      onScrollEnd();
    }
  };

  const handleSelect = (option: T) => {
    const selectedValue = option[objectValueKey];

    if (multiple) {
      const currentArray = Array.isArray(value) ? value : [];
      const newValue = currentArray.includes(selectedValue)
        ? currentArray.filter((v) => v !== selectedValue)
        : [...currentArray, selectedValue];
      onChange?.(newValue);
      setQuery("");
    } else {
      onChange?.(selectedValue);
      setQuery(getDisplayValue(option));
      setIsOpen(false);
    }
    onChangeOptional?.();
  };

  const removeSelected = (valueToRemove: any) => {
    if (!multiple) return;

    const newValue = Array.isArray(value)
      ? value.filter((v) => v !== valueToRemove)
      : [];
    onChange?.(newValue);
    onChangeOptional?.();
  };

  const scrollPills = (direction: "left" | "right") => {
    if (!pillsRef.current) return;

    const scrollAmount = 200;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    pillsRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setScrollPosition(newPosition);
  };

  const getSelectedOptions = () => {
    if (!multiple || !value) return [];

    const selectedValues = Array.isArray(value) ? value : [value];
    return options.filter((opt) =>
      selectedValues.includes(opt[objectValueKey])
    );
  };

  // Sync query with value for single select
  const syncQueryWithValue = useCallback(
    (currentValue: any) => {
      if (!multiple && currentValue) {
        const selectedOption = options.find(
          (opt) => opt[objectValueKey] === currentValue
        );
        if (selectedOption) {
          // El valor mostrado en el input es displayValue
          setQuery(getDisplayValue(selectedOption));
        }
      } else if (!multiple && !currentValue) {
        setQuery("");
      }
    },
    [multiple, options, objectValueKey, getDisplayValue]
  );

  // Watch for value changes to sync with query
  useEffect(() => {
    syncQueryWithValue(value);
  }, [value, syncQueryWithValue]);

  const selectedOptions = getSelectedOptions();

  return (
    <div className={cn("w-full ", containerClassname)} data-test={dataTest}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 ">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const newValue = e.target.value;
            setQuery(newValue);
            setIsOpen(true);
            onChangeOptional?.();
          }}
          disabled={disabled}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          /**
           * Componente Select genérico para seleccionar una o varias opciones.
           * Permite búsqueda, renderizado personalizado y manejo de múltiples valores.
           * @template T Tipo de las opciones.
           * @param {SelectProps<T>} props Props del componente.
           * @returns {JSX.Element} Elemento JSX del select.
           */
          className={cn(
            "form-input w-full  h-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 ",
            inputClassName
          )}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (!isOpen) {
                setIsOpen(true);
                setFocusedIndex(0);
              } else {
                setFocusedIndex((prev) => {
                  const next = prev + 1;
                  return next >= filteredOptions.length ? 0 : next;
                });
              }
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              if (!isOpen) {
                setIsOpen(true);
                setFocusedIndex(filteredOptions.length - 1);
              } else {
                setFocusedIndex((prev) => {
                  const next = prev - 1;
                  return next < 0 ? filteredOptions.length - 1 : next;
                });
              }
            } else if (e.key === "Enter") {
              if (!isOpen) {
                setIsOpen(true);
                setFocusedIndex(0);
                // Opcional: seleccionar todo el texto del input
                e.currentTarget.select?.();
                return;
              }
                if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
                e.preventDefault();
                handleSelect(filteredOptions[focusedIndex]);
                // Mueve el foco al siguiente elemento del formulario
            // Mueve el foco al siguiente input/textarea/select en el DOM
            const focusable = Array.from(document.querySelectorAll('input, textarea, select, button'))
              .filter(el => !el.hasAttribute('disabled') && (el as HTMLElement).tabIndex !== -1) as HTMLElement[];
            const idx = focusable.indexOf(e.currentTarget);
            if (idx >= 0 && idx < focusable.length - 1) {
              focusable[idx + 1]?.focus();
            }
                }
            }
          }}
        />

        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          </div>
        )}

        {isOpen && (
          <ul
            ref={scrollRef}
            onScroll={handleScroll}
            className="absolute z-50 mt-1 w-full bg-white dark:bg-[#121c2c] border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => {
                const isSelected = multiple
                  ? Array.isArray(value) &&
                    value.includes(option[objectValueKey])
                  : value === option[objectValueKey];

                return (
                  <li
                    key={String(option[objectValueKey])}
                    className={cn(
                      "cursor-pointer px-4 py-2",
                      isSelected ? "bg-blue-100 ..." : "hover:bg-blue-100 ...",
                      focusedIndex === idx ? "bg-blue-300 dark:bg-blue-700" : ""
                    )}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    onClick={() => handleSelect(option)}
                  >
                    {renderOption
                      ? renderOption(option)
                      : getDisplayValue(option)}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                No hay opciones
              </li>
            )}
          </ul>
        )}
      </div>

      {multiple && selectedOptions.length > 0 && (
        <div className="relative mt-2">
          {renderMultiplesValues ? (
            renderMultiplesValues(selectedOptions, (option: T) => {
              removeSelected(option[objectValueKey]);
            })
          ) : (
            <div className="flex items-center">
              {scrollPosition > 0 && (
                <button
                  type="button"
                  onClick={() => scrollPills("left")}
                  className="p-1 mr-1 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              )}

              <div
                ref={pillsRef}
                className="flex-1 flex space-x-2 overflow-x-hidden scrollbar-hide"
              >
                {selectedOptions.map((option) => (
                  <div
                    key={String(option[objectValueKey])}
                    className={cn(
                      "flex-shrink-0 flex items-center bg-primary text-white rounded-full px-3 py-1 text-sm",
                      pillsClassname
                    )}
                  >
                    <span className="truncate max-w-xs">
                      {getDisplayValue(option)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelected(option[objectValueKey]);
                      }}
                      className="ml-2 p-0.5 rounded-full hover:bg-primary-dark"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {pillsRef.current &&
                scrollPosition <
                  pillsRef.current.scrollWidth -
                    pillsRef.current.clientWidth && (
                  <button
                    type="button"
                    onClick={() => scrollPills("right")}
                    className="p-1 ml-1 text-gray-600 hover:text-gray-900"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                )}
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
