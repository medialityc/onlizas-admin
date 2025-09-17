"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import {
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

interface RHFImageUploadProps extends UseControllerProps {
  label?: string;
  defaultImage?: string;
  variant?: "square" | "rounded" | "circle";
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
  disabled?: boolean;
  showDimensions?: boolean;
  showFileSize?: boolean;
}

interface ImageInfo {
  width: number;
  height: number;
  size: number;
  name: string;
}

export const RHFImageUpload = forwardRef<HTMLDivElement, RHFImageUploadProps>(
  function RHFImageUpload(
    {
      label,
      defaultImage,
      variant = "circle",
      size = "md",
      className,
      disabled = false,
      showDimensions = true,
      showFileSize = true,
      ...props
    },
    forwardedRef
  ) {
    const { field, fieldState } = useController(props);
    const { setError, clearErrors } = useFormContext();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [preview, setPreview] = useState<string | null>(defaultImage || null);
    const [isDragging, setIsDragging] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);

    // Combinar refs
    const combinedRef = (node: HTMLDivElement) => {
      (containerRef as any).current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
      // Asignar el mismo ref al field para que RHF pueda hacer focus
      field.ref(node);
    };

    useEffect(() => {
      // Limpiar preview anterior si no hay valor
      if (!field.value) {
        setPreview(defaultImage || null);
        setImageInfo(null);
        return;
      }

      // Si el valor es un File, crear object URL
      if (field.value instanceof File) {
        const objectUrl = URL.createObjectURL(field.value);
        setPreview(objectUrl);

        // Obtener información de la imagen
        const img = new window.Image();
        img.onload = () => {
          setImageInfo({
            width: img.width,
            height: img.height,
            size: field.value.size,
            name: field.value.name,
          });
        };
        img.src = objectUrl;

        return () => URL.revokeObjectURL(objectUrl);
      }

      // Si el valor es una string (URL), usarla directamente
      if (typeof field.value === "string") {
        setPreview(field.value);
        setImageInfo(null);
        return;
      }

      // Caso por defecto
      setPreview(defaultImage || null);
      setImageInfo(null);
    }, [field.value, defaultImage]);

    const validateImage = (file: File): Promise<string | null> => {
      return new Promise((resolve) => {
        // Validar tamaño del archivo (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB en bytes
        if (file.size > maxSize) {
          resolve("El archivo debe ser menor a 5MB");
          return;
        }

        // Validar que sea una imagen
        if (!file.type.startsWith("image/")) {
          resolve("Solo se permiten archivos de imagen");
          return;
        }

        // Validar dimensiones
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);

          if (img.width !== 1024 || img.height !== 1024) {
            resolve(
              `La imagen debe ser exactamente de 1024x1024 píxeles (actual: ${img.width}x${img.height})`
            );
            return;
          }

          resolve(null); // Sin errores
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(
            "Error al cargar la imagen. Verifica que el archivo no esté corrupto"
          );
        };

        img.src = objectUrl;
      });
    };

    const processFile = async (file: File) => {
      setIsValidating(true);
      clearErrors(field.name);

      try {
        const error = await validateImage(file);

        if (error) {
          // Establecer error usando React Hook Form
          setError(field.name, {
            type: "validation",
            message: error,
          });
          field.onChange(null);
          setImageInfo(null);
        } else {
          // Archivo válido
          field.onChange(file);
          clearErrors(field.name);
        }
      } catch (err) {
        console.log(err);
        setError(field.name, {
          type: "validation",
          message: "Error inesperado al procesar la imagen",
        });
        field.onChange(null);
        setImageInfo(null);
      } finally {
        setIsValidating(false);
      }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        processFile(file);
      }
    };

    const handleClick = () => {
      if (!disabled && !isValidating) {
        fileInputRef.current?.click();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!disabled && !isValidating && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    };

    const handleRemove = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (!disabled && !isValidating) {
        field.onChange(null);
        setPreview(defaultImage || null);
        setImageInfo(null);
        clearErrors(field.name);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Devolver el focus al contenedor después de remover
        setTimeout(() => {
          containerRef.current?.focus();
        }, 0);
      }
    };

    const handleRemoveKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRemove(e);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      if (!disabled && !isValidating) {
        e.preventDefault();
        setIsDragging(true);
      }
    };

    const handleDragLeave = () => {
      if (!disabled && !isValidating) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      if (!disabled && !isValidating) {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
          processFile(file);
        }
      }
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Tamaños según la prop
    const sizeClasses = {
      sm: "w-24 h-24",
      md: "w-32 h-32",
      lg: "w-40 h-40",
      full: "w-full h-40 min-h-40",
    };

    // Bordes según la variante
    const variantClasses = {
      square: "rounded-none",
      rounded: "rounded-lg",
      circle: "rounded-full",
    };

    const isDisabledOrValidating = disabled || isValidating;

    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {label && (
          <label className="font-medium text-sm" htmlFor={field.name}>
            {label}
            <span className="text-red-500 ml-1">*</span>
          </label>
        )}

        <div
          ref={combinedRef}
          className={cn(
            "relative border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden transition-all",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            sizeClasses[size],
            variantClasses[variant],
            isDragging &&
              !isDisabledOrValidating &&
              "border-blue-500 bg-blue-50",
            fieldState.error &&
              "border-red-500 focus:ring-red-500 focus:border-red-500",
            isDisabledOrValidating
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-gray-400"
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          tabIndex={isDisabledOrValidating ? -1 : 0}
          role="button"
          aria-label={label || "Subir imagen"}
          aria-describedby={
            fieldState.error ? `${field.name}-error` : undefined
          }
        >
          {isValidating ? (
            <div className="flex flex-col items-center justify-center text-center p-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
              <span className="text-xs text-gray-500 font-medium">
                Validando imagen...
              </span>
            </div>
          ) : preview ? (
            <>
              <Image
                src={preview}
                alt="Vista previa de imagen"
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />

              {/* Información de la imagen superpuesta */}
              {imageInfo && (showDimensions || showFileSize) && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2">
                  {showDimensions && (
                    <div className="flex items-center justify-between">
                      <span>
                        {imageInfo.width}x{imageInfo.height} px
                      </span>
                      {showFileSize && (
                        <span>{formatFileSize(imageInfo.size)}</span>
                      )}
                    </div>
                  )}
                  {!showDimensions && showFileSize && (
                    <div className="text-center">
                      <span>{formatFileSize(imageInfo.size)}</span>
                    </div>
                  )}
                </div>
              )}

              {!isDisabledOrValidating && (
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={handleRemove}
                  onKeyDown={handleRemoveKeyDown}
                  aria-label="Remover imagen"
                  tabIndex={0}
                >
                  <XMarkIcon className="text-gray-600 size-4" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <ArrowUpTrayIcon className="text-gray-400 size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {isDisabledOrValidating ? "Procesando..." : "Sube tu imagen"}
                </p>
                {!isDisabledOrValidating && (
                  <p className="text-xs text-gray-500">
                    1024×1024 px • Máx 5MB
                  </p>
                )}
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            disabled={isDisabledOrValidating}
            aria-hidden="true"
          />
        </div>

        {fieldState.error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <ExclamationTriangleIcon className="size-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 mb-1">
                Error de validación
              </p>
              <p id={`${field.name}-error`} className="text-xs text-red-600">
                {fieldState.error.message}
              </p>
            </div>
          </div>
        )}

        {/* Información adicional cuando hay una imagen válida */}
        {imageInfo && !fieldState.error && (
          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
            <div className="size-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-700 font-medium">
              Imagen válida: {imageInfo.name}
            </span>
          </div>
        )}
      </div>
    );
  }
);
