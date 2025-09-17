"use client";

import { useEffect, useRef, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";
import Image from "next/image";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
import CropModal from "@/components/image/crop-modal";
import { Button } from "../button/button";
import { CropIcon } from "lucide-react";

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

  // Crop modal state
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState<string>("");
  const [cropTargetIndex, setCropTargetIndex] = useState<number | null>(null);
  const [pendingCropQueue, setPendingCropQueue] = useState<
    Array<{
      file: File;
      src: string;
      name: string;
      suggestedSize: { width: number; height: number };
    }>
  >([]);

  // Abre el modal para la siguiente imagen en la cola
  const openNextCrop = () => {
    const next = pendingCropQueue[0];
    if (!next) {
      setIsCropOpen(false);
      setCropImageSrc(null);
      setCropFileName("");
      return;
    }
    setCropImageSrc(next.src);
    setCropFileName(next.name);
    setIsCropOpen(true);
  };

  // Handler que recibe el File recortado desde CropModal
  const handleCroppedFile = (croppedFile: File) => {
    // Si hay un índice objetivo, reemplazar ese elemento
    const current = [...((field.value as UploadValue) || [])];
    if (cropTargetIndex !== null && typeof cropTargetIndex === "number") {
      // Reemplazar
      current[cropTargetIndex] = croppedFile;
      field.onChange(current);
      // Si la imagen previa era blob:, revocarla
      const prev = previews[cropTargetIndex];
      if (prev && prev.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(prev);
        } catch {}
      }
      // cerrar modal
      setIsCropOpen(false);
      setCropImageSrc(null);
      setCropFileName("");
      setCropTargetIndex(null);
      // Forzar actualización inmediata de previews
      const newPreviews = current.map((item) => (typeof item === "string" ? item : URL.createObjectURL(item as File)));
      setPreviews(newPreviews);
      return;
    }

    // Si no hay índice objetivo, añadimos al final (caso de cola)
    const after = [...current, croppedFile];
    field.onChange(after);
    // Forzar actualización inmediata de previews
    setPreviews(after.map((item) => (typeof item === "string" ? item : URL.createObjectURL(item as File))));

    // Si venimos de la cola, limpiar el primer elemento en pendings
    if (pendingCropQueue.length > 0) {
      const removed = pendingCropQueue.shift();
      if (removed?.src && removed.src.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(removed.src);
        } catch {}
      }
      setPendingCropQueue([...pendingCropQueue]);
      if (pendingCropQueue.length > 0) {
        openNextCrop();
      } else {
        setIsCropOpen(false);
        setCropImageSrc(null);
        setCropFileName("");
      }
    } else {
      setIsCropOpen(false);
      setCropImageSrc(null);
      setCropFileName("");
    }
  };

  const handleCropCancel = () => {
    // Si hay un índice objetivo, solo cerramos el modal y limpiamos el src temporal
    if (cropTargetIndex !== null) {
      if (cropImageSrc && cropImageSrc.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(cropImageSrc);
        } catch {}
      }
      setIsCropOpen(false);
      setCropImageSrc(null);
      setCropFileName("");
      setCropTargetIndex(null);
      return;
    }

    // Caso cola: removemos el primer de la cola y continuamos
    const [removed] = pendingCropQueue.splice(0, 1);
    if (removed?.src && removed.src.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(removed.src);
      } catch {}
    }
    setPendingCropQueue([...pendingCropQueue]);
    if (pendingCropQueue.length > 0) {
      openNextCrop();
    } else {
      setIsCropOpen(false);
      setCropImageSrc(null);
      setCropFileName("");
    }
  };

  // Sincroniza las imágenes: nuevas y por defecto
  useEffect(() => {
    let mounted = true;
    const value = (field.value as UploadValue) || [];

    // Si no hay value, usar defaultImages (strings)
    if (!value || value.length === 0) {
      setPreviews(defaultImages);
      // evitar override de field si defaultImages está vacío
      if (defaultImages && defaultImages.length > 0) {
        field.onChange(defaultImages);
      }
      return;
    }

    // Mantener lista previa para revocar objectURLs que queden obsoletas
    const old = previews.slice();

    const previewUrls = value.map((item) => (typeof item === "string" ? item : URL.createObjectURL(item)));

    if (mounted) setPreviews(previewUrls);

    // Revocar URLs antiguas que ya no estén en la nueva lista
    const toRevoke = old.filter((u) => u.startsWith("blob:") && !previewUrls.includes(u));
    toRevoke.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {}
    });

    return () => {
      mounted = false;
      // Al desmontar, revocar las URLs creadas en este efecto
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(url);
          } catch {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  // Carga una imagen desde File y devuelve dimensiones + objectURL
  const loadImageFromFile = (
    file: File
  ): Promise<{ width: number; height: number; src: string }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const src = URL.createObjectURL(file);
      img.onload = () => {
        resolve({ width: img.width, height: img.height, src });
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(src);
        reject(e);
      };
      img.src = src;
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
    const pendingCrop: typeof pendingCropQueue = [];

    for (const file of imageFiles) {
      // Validar tamaño del archivo
      if (!validateFileSize(file)) {
        errors.push(`${file.name}: El archivo excede el límite de 5MB`);
        continue;
      }

      try {
        const { width, height, src } = await loadImageFromFile(file);

        // Reglas: mínimo 500x500, máximo 3200x3200
        if (width < 500 || height < 500) {
          errors.push(
            `${file.name}: La imagen es demasiado pequeña (mínimo 500×500).`
          );
          URL.revokeObjectURL(src);
          continue;
        }

        if (width > 3200 || height > 3200) {
          // Encolar para recorte antes de añadirse
          const suggested = Math.min(1024, width, height);
          pendingCrop.push({
            file,
            src,
            name: file.name,
            suggestedSize: {
              width: Math.max(500, Math.floor(suggested)),
              height: Math.max(500, Math.floor(suggested)),
            },
          });
          continue;
        }

        // Dentro del rango permitido
        validFiles.push(file);
        // no revocar src aquí porque preview manager se encargará
      } catch {
        errors.push(`${file.name}: No se pudo procesar la imagen.`);
      }
    }

    // Mostrar errores si los hay
    if (errors.length > 0) {
      setValidationError(errors.join(" "));
    }

    // Agregar archivos válidos directamente
    if (validFiles.length > 0) {
      const current = (field.value as UploadValue) || [];
      field.onChange([...current, ...validFiles]);
    }

    // Si hay imágenes que requieren recorte, iniciar cola de crop
    if (pendingCrop.length > 0) {
      setPendingCropQueue(pendingCrop);
      const first = pendingCrop[0];
      setCropImageSrc(first.src);
      setCropFileName(first.name);
      setCropTargetIndex(null); // null => append after crop
      setIsCropOpen(true);
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
          Solo imágenes entre 500×500 y 3200×3200px, máximo 5MB cada una
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
              {src.startsWith("blob:") ? (
                // Use native img for blob: URLs to avoid next/image optimizations which can interfere with objectURLs
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              ) : (
                <Image src={src} alt={`Preview ${index}`} fill className="object-cover" />
              )}
              <div className="absolute top-1 right-1 flex gap-1 flex-row items-center">
                <Button
                  type="button"
                  onClick={() => {
                    // Abrir modal para recortar esta preview
                    const value = (field.value as UploadValue) || [];
                    const item = value[index];
                    if (typeof item === "string") {
                      // Si es URL (ya sea remota o blob), usarla directamente
                      setCropImageSrc(item);
                      setCropFileName(`preview-${index}`);
                      setCropTargetIndex(index);
                      setIsCropOpen(true);
                    } else {
                      // Es File
                      const src = URL.createObjectURL(item as File);
                      setCropImageSrc(src);
                      setCropFileName((item as File).name || `file-${index}`);
                      setCropTargetIndex(index);
                      // Asegurar que la cola lo contiene si queremos procesar en orden
                      setIsCropOpen(true);
                    }
                  }}
                  className="bg-white p-0.5 rounded-full shadow hover:bg-gray-100 h-5 w-5"
                >
                  <CropIcon className="text-gray-600 size-4" />
                </Button>
                <Button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="bg-white w-5 h-5 p-0.5 rounded-full shadow hover:bg-gray-100"
                >
                  <XMarkIcon className="text-gray-600 size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop modal: se abre para cada imagen en la cola */}
      {cropImageSrc && (
        <CropModal
          isOpen={isCropOpen}
          onClose={handleCropCancel}
          onCrop={handleCroppedFile}
          imageSrc={cropImageSrc}
          fileName={cropFileName}
          cropDimensions={{ width: 1024, height: 1024 }}
        />
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
