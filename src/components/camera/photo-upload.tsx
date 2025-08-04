"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import {
  CameraIcon as Camera,
  PhotoIcon as ImageIcon,
  InformationCircleIcon as Info,
  ArrowPathIcon as RotateCcw,
  PaperAirplaneIcon as Send,
  ArrowUpTrayIcon as Upload,
  XMarkIcon as X,
} from "@heroicons/react/24/outline";
import { FolderIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Badge from "../badge/badge";
import { Button } from "../button/button";
import { Card, CardContent } from "../cards/card";
import IconSend from "../icon/icon-send";

interface SelectedFile {
  file: File;
  preview: string;
  id: string;
}

interface PhotoUploadProps {
  multiple?: boolean;
  onSend: () => void;
  onCancel: () => void;
}

export default function PhotoUpload({
  multiple = true,
  onCancel,
  onSend,
}: PhotoUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // CAMBIO: la cámara inicia visible
  const [showWebcam, setShowWebcam] = useState(true);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [webcamLoading, setWebcamLoading] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [useBasicConfig, setUseBasicConfig] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [webcamKey, setWebcamKey] = useState(0); // Para forzar re-render del Webcam
  const fileInputRef = useRef<HTMLInputElement>(null);

  const playCameraSound = () => {
    const audio = new Audio("/camera-shutter.mp3"); // ruta en tu carpeta public
    audio.play();
  };

  // Función para cambiar de cámara
  const switchCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    setWebcamKey((prev) => prev + 1); // Forzar re-render del componente Webcam

    // Mostrar loading temporal
    setWebcamLoading(true);
    setTimeout(() => setWebcamLoading(false), 1000);
  };

  // Función mejorada para manejar la apertura de la cámara
  const handleOpenCamera = async () => {
    setWebcamLoading(true);
    setWebcamError(null);
    setUseBasicConfig(false); // Empezar con configuración avanzada

    // Intentar directamente sin verificación previa
    setShowWebcam(true);
  };

  // Manejar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showWebcam) {
        setShowWebcam(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showWebcam]);

  function capture() {
    if (!webcamRef.current) return;
    playCameraSound();
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);

    // Convertir la imagen capturada a File y agregarla a selectedFiles
    if (imageSrc) {
      // Convertir data URL a blob
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `captura-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          const preview = imageSrc;
          const newFile: SelectedFile = {
            file,
            preview,
            id: Math.random().toString(36).substr(2, 9),
          };
          setSelectedFiles((prev) => [...prev, newFile]);

          // Mostrar feedback de captura exitosa
          setCaptureSuccess(true);
          setTimeout(() => setCaptureSuccess(false), 1000);
        })
        .catch((err) =>
          console.error("Error al procesar la imagen capturada:", err)
        );
    }
  }

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newFiles: SelectedFile[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          const preview = URL.createObjectURL(file);
          newFiles.push({
            file,
            preview,
            id: Math.random().toString(36).substr(2, 9),
          });
        }
      });
      if (multiple) {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      } else {
        // Solo una foto
        // Limpiar previews anteriores
        selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
        setSelectedFiles(newFiles.slice(0, 1));
      }
    },
    [multiple, selectedFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = useCallback((id: string) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    setSelectedFiles([]);
  }, [selectedFiles]);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simular subida de archivos
    for (let i = 0; i < selectedFiles.length; i++) {
      // Aquí iría la lógica real de subida
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUploadProgress(((i + 1) / selectedFiles.length) * 100);
    }

    // Simular finalización
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      clearAll();
      alert("¡Fotos enviadas exitosamente!");
    }, 500);
  }, [selectedFiles, clearAll]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:space-y-6">
      <div className="text-center space-y-2">
        {/* <h1 className="text-2xl font-bold">Seleccionar y Enviar Fotos</h1> */}
        {/* CAMBIO: solo se muestra el botón para subir imagen si la cámara está cerrada */}
        {!showWebcam && (
          <div className="flex flex-col  items-center justify-center gap-3 max-w-3xl mx-auto">
            <div className="flex w-full justify-center sm:flex-1 sm:min-w-0 bg-blue-200 border border-blue-700 p-2 rounded text-center">
              <Info className="h-5 w-5 mr-2 text-blue-700 flex-shrink-0" />
              <p className="text-muted-foreground text-blue-700 text-sm">
                {multiple
                  ? "Arrastra y suelta tus fotos o haz clic para seleccionarlas"
                  : "Haz clic para seleccionar una foto"}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 hover:cursor-pointer bg-blue-600 text-white hover:bg-blue-400 hover:text-black duration-500 flex-shrink-0 w-full sm:w-auto"
                size="sm"
              >
                <Upload className="h-4 w-4" />
                {multiple ? "Subir Imagen" : "Seleccionar Imagen"}
              </Button>
              <Button
                onClick={async () => {
                  setShowWebcam(true);
                  setWebcamLoading(true);
                  setUseBasicConfig(false);
                  await handleOpenCamera();
                }}
                className="flex items-center justify-center gap-2 hover:cursor-pointer bg-green-600 text-white hover:bg-green-400 hover:text-black duration-500 flex-shrink-0 w-full sm:w-auto"
                size="sm"
                disabled={webcamLoading}
              >
                <Camera className="h-4 w-4" />
                Usar Cámara
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Vista para una sola foto */}
      {!showWebcam && !multiple && selectedFiles.length === 1 && (
        <div className="flex flex-col items-center justify-center py-8">
          <div
            className="w-full max-w-md aspect-square mx-auto mb-4"
            style={{ width: 400, height: 300 }}
          >
            <img
              src={selectedFiles[0].preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-xl border shadow"
              style={{
                width: 400,
                height: 300,
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </div>
          <div className="flex gap-2 mb-2">
            <Button
              size="sm"
              onClick={clearAll}
              className="hover:cursor-pointer bg-red-500 text-white hover:bg-red-400 hover:text-black duration-500"
            >
              <TrashIcon className="h-4 w-4" />
              Quitar
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {selectedFiles[0].file.name} (
            {formatFileSize(selectedFiles[0].file.size)})
          </div>
        </div>
      )}

      {/* Vista para varias fotos (como antes) */}
      {!showWebcam && (multiple || selectedFiles.length !== 1) && (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            selectedFiles.length > 0 && "border-primary/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-4">
              {selectedFiles.length > 0 ? (
                <ImageIcon className="h-12 w-12 text-primary" />
              ) : (
                <Upload className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} foto${
                      selectedFiles.length > 1 ? "s" : ""
                    } seleccionada${selectedFiles.length > 1 ? "s" : ""}`
                  : multiple
                    ? "Selecciona tus fotos"
                    : "Selecciona una foto"}
              </p>
              <p className="text-sm text-muted-foreground">
                {multiple
                  ? "Arrastra y suelta archivos aquí, o haz clic para seleccionar"
                  : "Haz clic para seleccionar una foto"}
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos soportados: JPG, PNG, GIF, WebP
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Componente de webcam - Modal para vista móvil */}
      {showWebcam && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/20 flex items-center justify-center p-4 min-h-screen md:relative md:bg-transparent md:backdrop-blur-none md:bg-opacity-100 md:inset-auto md:z-auto md:p-0 md:min-h-0">
          <div className="relative w-full h-full max-w-4xl mx-auto flex flex-col justify-center md:h-auto">
            <div className="flex flex-col gap-4 justify-center items-center h-full">
              {/* Botón Seleccionar Imagen: ahora se muestra abajo a la izquierda */}
              <div className="relative">
                {webcamLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl z-10">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p>Iniciando cámara...</p>
                    </div>
                  </div>
                )}

                {/* Mostrar la foto capturada si es single y ya hay una foto */}
                {!multiple && selectedFiles.length === 1 ? (
                  <div className="relative">
                    <img
                      src={selectedFiles[0].preview}
                      alt="Foto capturada"
                      className="rounded-2xl w-full object-contain "
                      style={{ width: 380, height: 215 }}
                    />
                    {/* Botón limpiar en la imagen capturada */}
                  </div>
                ) : (
                  <Webcam
                    key={webcamKey}
                    className="rounded-2xl w-full "
                    screenshotFormat="image/jpeg"
                    ref={webcamRef}
                    videoConstraints={
                      useBasicConfig
                        ? {
                            width: 640,
                            height: 480,
                            facingMode: facingMode,
                          }
                        : {
                            width: { ideal: 1280 },
                            height: { ideal: 720 },
                            facingMode: { ideal: facingMode },
                          }
                    }
                    audio={false}
                    mirrored={false}
                    onUserMedia={() => {
                      setWebcamLoading(false);
                      setWebcamError(null);
                    }}
                    onUserMediaError={(error) => {
                      setWebcamLoading(false);
                      if (!useBasicConfig) {
                        setUseBasicConfig(true);
                        setWebcamLoading(true);
                        return;
                      }
                      let errorMessage =
                        "Error desconocido al acceder a la cámara.";
                      if (error instanceof DOMException) {
                        if (error.name === "NotAllowedError") {
                          errorMessage =
                            "Permisos de cámara denegados. Habilítalos en la configuración del navegador.";
                        } else if (error.name === "NotFoundError") {
                          errorMessage =
                            "No se encontró ninguna cámara disponible. Asegúrate de que:\n• Tu dispositivo tenga una cámara\n• La cámara no esté siendo usada por otra aplicación\n• Los drivers de la cámara estén instalados correctamente";
                        } else if (error.name === "NotReadableError") {
                          errorMessage =
                            "La cámara está siendo usada por otra aplicación. Cierra otras aplicaciones que puedan estar usando la cámara (Zoom, Teams, Skype, etc.)";
                        } else if (error.name === "OverconstrainedError") {
                          errorMessage =
                            "La configuración de la cámara no es compatible con tu dispositivo. Tu cámara puede no soportar la resolución solicitada.";
                        }
                      }
                      setWebcamError(errorMessage);
                      alert(errorMessage);
                      setShowWebcam(false);
                      setUseBasicConfig(false);
                    }}
                  />
                )}

                {captureSuccess && (
                  <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-2xl">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                      Foto capturada
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-end justify-center gap-4 mt-4 w-full">
                {/* Botón Seleccionar Imagen abajo a la izquierda */}
                {!multiple && selectedFiles.length === 1 ? (
                  <Button
                    size="sm"
                    onClick={onCancel}
                    className="flex bg-white text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600 duration-500 items-center gap-2"
                  >
                    Cancelar
                  </Button>
                ) : (
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-full hover:cursor-pointer border-1 hover:bg-white hover:text-blue-500 border-blue-500 text-white  font-extrabold duration-500 text-lg shadow-lg bg-blue-500 flex items-center justify-center"
                    size="sm"
                  >
                    <FolderIcon className="h-6 w-6" />
                  </Button>
                )}
                {/* Botón Capturar y Cambiar cámara (centrados a la derecha) */}
                <div className="flex items-center gap-4">
                  {!multiple && selectedFiles.length === 1 ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        // Limpiar la imagen capturada
                        selectedFiles.forEach((file) =>
                          URL.revokeObjectURL(file.preview)
                        );
                        setSelectedFiles([]);
                      }}
                      className="flex bg-red-500 text-white hover:bg-white hover:text-red-500 border-red-500 duration-500 items-center gap-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Limpiar
                    </Button>
                  ) : (
                    <button
                      onClick={capture}
                      title="Capturar foto"
                      className={`w-16 h-16 rounded-full hover:cursor-pointer border-4 border-blue-500 hover:border-green-500 text-blue-600 hover:text-green-600 font-extrabold duration-500 text-lg shadow-lg bg-white flex items-center justify-center ${
                        captureSuccess ? "border-green-500 text-green-600" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-current"></div>
                    </button>
                  )}
                  {/* Botón para cambiar cámara */}
                  {!multiple && selectedFiles.length === 1 ? (
                    <Button
                      size="sm"
                      onClick={onSend}
                      className="flex bg-blue-500 text-white hover:bg-white hover:text-blue-500 border-blue-500 duration-500 items-center gap-2"
                    >
                      <IconSend className="h-4 w-4" />
                      Enviar
                    </Button>
                  ) : (
                    <button
                      onClick={switchCamera}
                      title="Cambiar cámara"
                      className="w-16 h-16 rounded-full hover:cursor-pointer bg-gray-600 text-white hover:bg-gray-400 hover:text-black duration-500 flex items-center justify-center shadow-lg"
                    >
                      <RotateCcw className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        {...(multiple ? { multiple: true } : {})}
      />

      {/* Vista previa de archivos seleccionados (solo para multiple o más de una foto) */}
      {((multiple && selectedFiles.length > 0) ||
        (!multiple && selectedFiles.length > 1)) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Fotos Seleccionadas:</h3>
              <Badge variant="info" className="rounded bg-blue-300">
                {selectedFiles.length}
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={clearAll}
              className="hover:cursor-pointer bg-red-500 text-white hover:bg-red-400 hover:text-black duration-500"
            >
              <TrashIcon className="h-4 w-4" />
              Limpiar Todo
            </Button>
          </div>

          {/* Grid responsive de previsualizaciones */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedFiles.map((selectedFile) => (
              <Card
                key={selectedFile.id}
                className="relative group overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <img
                      src={selectedFile.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      className="absolute top-2 bg-red-600 rounded text-white right-2 h-6 w-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:cursor-pointer hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(selectedFile.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-2 space-y-1">
                    <p className="text-xs font-medium truncate">
                      {selectedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.file.size)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Barra de progreso durante la subida */}
          {/* {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Enviando fotos...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )} */}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="w-full sm:flex-1 md:w-auto hover:cursor-pointer bg-blue-600 text-white hover:bg-blue-400 hover:text-black duration-500"
              size="lg"
            >
              <Send className="h-4 w-4 mr-2" />
              {isUploading
                ? "Enviando..."
                : `Enviar ${selectedFiles.length} foto${
                    selectedFiles.length > 1 ? "s" : ""
                  }`}
            </Button>
            <Button
              className="w-full sm:flex-1 md:w-auto hover:cursor-pointer hover:bg-gray-300 border hover:text-black duration-500"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              size="lg"
            >
              <Upload className="h-4 w-4 mr-2" />
              Agregar Más
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
