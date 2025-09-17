"use client";

import { useEffect, useRef, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";
import Image from "next/image";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

interface RHFMultiImageUploadProps extends UseControllerProps {
  label?: string;
  className?: string;
  defaultImages?: string[];
}

type UploadValue = (File | string)[];

export function RHFMultiImageUpload({
  label,
  className,
  defaultImages = [],
  ...props
}: RHFMultiImageUploadProps) {
  const { field, fieldState } = useController(props);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string>("");

  // Sincroniza las imágenes: nuevas y por defecto
  useEffect(() => {
    const value = field.value as UploadValue;

    if (!value || value.length === 0) {
      setPreviews(defaultImages);
      field.onChange(defaultImages);
      return;
    }

    const previewUrls = value.map((item) =>
      typeof item === "string" ? item : URL?.createObjectURL(item)
    );

    setPreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(field.value), JSON.stringify(defaultImages)]);

  // Función para validar dimensiones de imagen
  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const isValid = img.width === 1024 && img.height === 1024;
        resolve(isValid);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  // Función para validar tamaño de archivo (5MB máximo)
  const validateFileSize = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    return file.size <= maxSize;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setValidationError(""); // Limpiar errores previos

    if (imageFiles.length === 0) {
      setValidationError("Por favor selecciona archivos de imagen válidos.");
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of imageFiles) {
      // Validar tamaño del archivo
      if (!validateFileSize(file)) {
        errors.push(`${file.name}: El archivo excede el límite de 5MB`);
        continue;
      }

      // Validar dimensiones
      const hasValidDimensions = await validateImageDimensions(file);
      if (!hasValidDimensions) {
        errors.push(`${file.name}: La imagen debe ser de 1024x1024 píxeles`);
        continue;
      }

      validFiles.push(file);
    }

    // Mostrar errores si los hay
    if (errors.length > 0) {
      setValidationError(errors.join(". "));
    }

    // Agregar archivos válidos
    if (validFiles.length > 0) {
      const current = (field.value as UploadValue) || [];
      field.onChange([...current, ...validFiles]);
    }

    // Limpiar el input para permitir seleccionar los mismos archivos nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const current = [...((field.value as UploadValue) || [])];
    current.splice(index, 1);
    field.onChange(current);

    // Limpiar error de validación si se remueve una imagen
    setValidationError("");
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {label && <label className="font-medium text-sm">{label}</label>}

      <div
        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <ArrowUpTrayIcon className="mx-auto text-gray-400 mb-2 size-5" />
        <p className="text-sm text-gray-500 font-medium">
          Haz clic o arrastra imágenes para subir
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Solo imágenes 1024x1024px, máximo 5MB cada una
        </p>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {previews.length > 0 && (
        <div className="flex gap-4 overflow-x-auto py-2">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden border"
            >
              <Image
                src={src}
                alt={`Preview ${index}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100"
              >
                <XMarkIcon className="text-gray-600 size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error de validación personalizada */}
      {validationError && (
        <p className="text-xs text-red-500">{validationError}</p>
      )}

      {/* Error del campo (react-hook-form) */}
      {fieldState.error && (
        <p className="text-xs text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
}
