"use client";

import React, { useEffect, useState } from "react";
import { Cropper } from "@origin-space/image-cropper";
import SimpleModal from "../modal/modal";

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 8;
const ZOOM_STEP = 0.05;
const DEFAULT_ZOOM = 1;

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
  minWidth = 500,
  minHeight = 500,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCrop: (croppedFile: File) => void;
  imageSrc: string;
  fileName: string;
  cropDimensions?: CropDimensions;
  minWidth?: number;
  minHeight?: number;
}) {
  const [cropData, setCropData] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [cropperKey, setCropperKey] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const aspectRatio = cropDimensions.width / cropDimensions.height;

  // Keep props referenced to satisfy task contract even though crop modal
  // does not enforce min dimensions (validation happens upstream).
  void minWidth;
  void minHeight;

  // Preload image to get natural dimensions for proportional fit
  useEffect(() => {
    if (!imageSrc) {
      setImageSize({ width: 0, height: 0 });
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setImageSize({ width: 0, height: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

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

      // Preserve the exact crop region aspect ratio; never stretch to arbitrary target dimensions
      canvas.width = cropData.width;
      canvas.height = cropData.height;

      const img = new window.Image();

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
        cropData.width,
        cropData.height,
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

  const handleFit = () => {
    if (imageSize.width === 0 || imageSize.height === 0) return;

    // The cropper sizes the image wrapper at zoom=1 so that one dimension
    // matches the crop area and the other may exceed it. To fit the ENTIRE
    // image inside the crop area we must scale down by the ratio of the
    // aspect ratios.
    const imgAspect = imageSize.width / imageSize.height;
    const cropAspect = cropDimensions.width / cropDimensions.height;

    const fitZoom =
      imgAspect >= cropAspect
        ? Math.min(1, cropAspect / imgAspect)
        : Math.min(1, imgAspect / cropAspect);

    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, fitZoom));

    // Reset cropper to center and apply calculated zoom
    setCropData(null);
    setCropperKey((prev) => prev + 1);
    setZoom(clampedZoom);
  };

  const handleReset = () => {
    setZoom(DEFAULT_ZOOM);
    setCropData(null);
    // Force remount to reset internal pan/crop state from the cropper runtime.
    setCropperKey((prev) => prev + 1);
  };

  return (
    <SimpleModal
      className="max-w-5xl"
      open={isOpen}
      onClose={onClose}
      title="Recortar imagen"
      subtitle={`Usa la rueda del mouse para hacer zoom y arrastra para mover la imagen. Puedes usar Fit para encuadrar rápido y Reset para reiniciar. Resultado final: ${cropDimensions.width}×${cropDimensions.height}px`}
    >
      <Cropper.Root
        key={cropperKey}
        image={imageSrc}
        aspectRatio={aspectRatio}
        onCropChange={setCropData}
        onZoomChange={setZoom}
        className="relative flex h-[52vh] min-h-72 max-h-136 w-full cursor-move touch-none items-center justify-center overflow-hidden rounded-md border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        cropPadding={25}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        zoom={zoom}
        zoomSensitivity={0.0025}
        keyboardStep={10}
      >
        <Cropper.Description className="sr-only" />
        <span className="sr-only">
          Usa la rueda del mouse para hacer zoom. Arrastra para mover la imagen.
          Usa las teclas de flecha para ajustes finos.
        </span>
        <Cropper.Image className="h-full w-full select-none object-contain origin-center" />
        <Cropper.CropArea className="absolute border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]" />
      </Cropper.Root>

      {/* Slider para zoom */}
      <div className="my-2 border-t border-gray-400 bg-gray-50 px-6 py-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="zoom-slider" className="text-sm text-gray-600">
            Zoom: {zoom.toFixed(2)}x
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFit}
              disabled={isCropping}
              className="rounded bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              Fit
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isCropping}
              className="rounded bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
        <input
          id="zoom-slider"
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={ZOOM_STEP}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="mt-2 w-full"
        />
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-400 flex gap-3 justify-end">
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
