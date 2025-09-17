"use client";

import React, { useState } from "react";
import { Cropper } from "@origin-space/image-cropper";
import SimpleModal from "../modal/modal";

interface CropDimensions {
  width: number;
  height: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function CropModal({
  isOpen,
  onClose,
  onCrop,
  imageSrc,
  fileName,
  cropDimensions = { width: 1024, height: 1024 },
}: {
  isOpen: boolean;
  onClose: () => void;
  onCrop: (croppedFile: File) => void;
  imageSrc: string;
  fileName: string;
  cropDimensions?: CropDimensions;
}) {
  const [cropData, setCropData] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [zoom, setZoom] = useState(1);

  const aspectRatio = cropDimensions.width / cropDimensions.height;

  const handleCrop = async () => {
    if (!cropData) return;

    setIsCropping(true);

    try {
      const canvas = document.createElement("canvas");
      // Explicitly request alpha channel when getting the context
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
        alpha: true,
      });
      if (!ctx) return;

      canvas.width = cropDimensions.width;
      canvas.height = cropDimensions.height;

      const img = new window.Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = imageSrc;
      });

      // Draw the cropped area into the canvas. Do NOT fill the canvas background — keep alpha.
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        img,
        cropData.x,
        cropData.y,
        cropData.width,
        cropData.height,
        0,
        0,
        cropDimensions.width,
        cropDimensions.height
      );

      // Export as PNG to preserve transparency
      canvas.toBlob((blob) => {
        if (blob) {
          // Ensure output filename has .png extension
          const baseName = fileName.replace(/\.[^/.]+$/, "");
          const croppedFile = new File([blob], `cropped-${baseName}.png`, {
            type: "image/png",
          });
          onCrop(croppedFile);
        }
        setIsCropping(false);
      }, "image/png");
    } catch (error) {
      console.error("Error al procesar el crop:", error);
      setIsCropping(false);
    }
  };

  return (
    <SimpleModal
    className="max-w-3xl"
      open={isOpen}
      onClose={onClose}
      title="Recortar imagen"
      subtitle={`Usa la rueda del mouse para hacer zoom y arrastra para mover la
            imagen. Resultado final: ${cropDimensions.width}×${cropDimensions.height}px`}
    >
      <Cropper.Root
        image={imageSrc}
        aspectRatio={aspectRatio}
        onCropChange={setCropData}
        // @ts-expect-error: `onZoomChange` is supported by the runtime Cropper implementation
        // (the library's compiled code exposes this prop) but its types are missing here.
        onZoomChange={setZoom}
        className="relative flex h-96 w-full cursor-move touch-none items-center justify-center overflow-hidden rounded-md border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        cropPadding={25}
        minZoom={1}
        maxZoom={3}
        zoom={zoom}
        zoomSensitivity={0.005}
        keyboardStep={10}
      >
        <Cropper.Description className="sr-only" />
        <span className="sr-only">
          Usa la rueda del mouse para hacer zoom. Arrastra para mover la imagen.
          Usa las teclas de flecha para ajustes finos.
        </span>
        {/* Allow pointer events on the image so wheel and drag events reach the cropper */}
        <Cropper.Image className="h-full w-full select-none object-contain origin-center" />
        {/* Keep crop area overlay interactive only as needed; remove pointer-events-none so wheel events reach underlying image */}
        <Cropper.CropArea className="absolute border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]" />
      </Cropper.Root>

      {/* Slider para zoom */}
      <div className="px-6 py-2 bg-gray-50 border-t">
        <label htmlFor="zoom-slider" className="text-sm text-gray-600">
          Zoom:
        </label>
        <input
          id="zoom-slider"
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      {/* Footer */}
      <div className="p-6 border-t flex gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={isCropping}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleCrop}
          disabled={isCropping || !cropData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isCropping ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            <>Aplicar recorte</>
          )}
        </button>
      </div>
    </SimpleModal>
  );
}
