import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import type { ReactNode } from "react";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";

type Props = {
  /**
   * Lista de URLs de imágenes o rutas estáticas
   */
  images: (string | StaticImport)[];
  /**
   * Texto alternativo para todas las imágenes
   */
  alt: string;
  /**
   * Clases CSS adicionales para el contenedor
   */
  className?: string;
  /**
   * Habilita/deshabilita la funcionalidad de preview al hacer clic
   * @default true
   */
  previewEnabled?: boolean;
  /**
   * Icono a mostrar cuando no hay imágenes
   */
  defaultIcon?: ReactNode;
  /**
   * Callback cuando se abre/cierra el preview
   */
  onPreviewChange?: (isOpen: boolean) => void;
  /**
   * Callback cuando cambia la imagen actual en el preview
   */
  onImageChange?: (currentIndex: number) => void;
};

const ImagePreview = ({
  images,
  className,
  previewEnabled = true,
  defaultIcon,
  alt,
  onPreviewChange,
  onImageChange,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const hasImages = images && images.length > 0;
  // Si el array está vacío, usar solo la imagen por defecto o el icono
  const fallback = ["/assets/images/placeholder-product.webp"];
  const imagesToShow = hasImages ? images : fallback;
  const preview = imagesToShow[0];
  const showIcon = !hasImages && !!defaultIcon;
  const isDefaultImage = !hasImages && !showIcon;

  // Manejadores de eventos
  const handleLoad = () => setLoading(false);

  const handlePreviewToggle = (isOpen: boolean) => {
    setOpen(isOpen);
    onPreviewChange?.(isOpen);
  };

  const handleImageChange = (index: number) => {
    setCurrent(index);
    onImageChange?.(index);
  };

  return (
    <>
      <div
        className={cn(
          "object-contain w-14 h-14 flex-shrink-0 bg-slate-100 border-slate-400 dark:border-slate-700 dark:bg-slate-700 rounded-md overflow-hidden relative",
          previewEnabled &&
            !showIcon &&
            !isDefaultImage &&
            "cursor-pointer hover:opacity-90",
          className
        )}
        onClick={
          previewEnabled && !showIcon && !isDefaultImage
            ? () => handlePreviewToggle(true)
            : undefined
        }
        title={alt}
      >
        {showIcon ? (
          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-300 text-3xl">
            {defaultIcon}
          </div>
        ) : (
          <>
            <Image
              src={preview}
              alt={alt}
              fill
              onLoad={handleLoad}
              style={{
                filter: loading ? "blur(8px) grayscale(0.2)" : "none",
                transition: "filter 0.3s",
              }}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-slate-900/40">
                <span className="animate-spin rounded-full border-2 border-slate-400 border-t-transparent w-6 h-6"></span>
              </div>
            )}
          </>
        )}
      </div>
      {open && previewEnabled && !isDefaultImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => handlePreviewToggle(false)}
        >
          <div
            className="relative w-full max-w-2xl mx-auto flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-3xl text-white z-10 hover:text-gray-300 transition-colors"
              onClick={() => handlePreviewToggle(false)}
            >
              &times;
            </button>
            {/* Carrusel principal */}
            <div className="relative w-full h-[60vh] flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 dark:bg-slate-800/70 rounded-full p-2 shadow hover:bg-white transition-transform hover:scale-105   "
                onClick={() => {
                  const newIndex =
                    (current - 1 + imagesToShow.length) % imagesToShow.length;
                  handleImageChange(newIndex);
                }}
                aria-label="Anterior"
                style={{
                  display: imagesToShow.length > 1 ? undefined : "none",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {showIcon ? (
                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-300 text-7xl">
                  {defaultIcon}
                </div>
              ) : (
                <>
                  <Image
                    src={imagesToShow[current]}
                    alt={`${alt} - ${current + 1}/${imagesToShow.length}`}
                    fill
                    style={{ objectFit: "contain" }}
                    onLoad={handleLoad}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    priority={current === 0}
                  />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-slate-900/40">
                      <span className="animate-spin rounded-full border-2 border-slate-400 border-t-transparent w-8 h-8"></span>
                    </div>
                  )}
                </>
              )}
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 dark:bg-slate-800/70 rounded-full p-2 shadow hover:bg-white transition-transform hover:scale-105"
                onClick={() => {
                  const newIndex = (current + 1) % imagesToShow.length;
                  handleImageChange(newIndex);
                }}
                aria-label="Siguiente"
                style={{
                  display: imagesToShow.length > 1 ? undefined : "none",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            {/* Previews tipo carrusel */}
            {imagesToShow.length > 1 && !showIcon && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-full px-4 py-2 pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                {imagesToShow?.map((img, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      "w-16 h-16 border-2 rounded overflow-hidden flex-shrink-0 transition-all duration-200",
                      idx === current
                        ? "border-blue-500 scale-110 shadow-md"
                        : "border-slate-300 opacity-70 hover:opacity-100 hover:border-blue-300"
                    )}
                    onClick={() => handleImageChange(idx)}
                  >
                    <Image
                      src={img}
                      alt={`${alt} - Miniatura ${idx + 1}`}
                      width={64}
                      height={64}
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
