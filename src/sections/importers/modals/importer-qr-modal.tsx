"use client";

import { useState, useRef } from "react";
import {
  Modal,
  Stack,
  Text,
  Button,
  Alert,
  LoadingOverlay,
  CopyButton,
  ActionIcon,
  Tooltip,
  Group,
  Switch,
} from "@mantine/core";
import { Importer } from "@/types/importers";
import showToast from "@/config/toast/toastConfig";
import { generateImporterQRCode } from "@/services/importers";
import IconInfoCircle from "@/components/icon/icon-info-circle";
import {
  CheckIcon,
  ClipboardIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

interface Props {
  open: boolean;
  onClose: () => void;
  importer: Importer | null;
}

interface QRData {
  importerId: string;
  importerName: string;
  secretKey: string;
  qrCodeUrl: string;
  qrCodeImageBase64: string;
  createdAt: string;
  instructions: string;
}

export default function ImporterQRModal({ open, onClose, importer }: Props) {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const [forceRegenerate, setForceRegenerate] = useState(false);

  const generateQR = async () => {
    if (!importer) return;

    console.log("🔄 [Generate QR] Iniciando generación de QR para:", {
      importerId: importer.id,
      importerName: importer.name,
    });

    setIsLoading(true);
    try {
      const result = await generateImporterQRCode(importer.id, forceRegenerate);

      console.log("📦 [Generate QR] Respuesta completa de la API:", {
        hasError: !!result.error,
        hasData: !!result.data,
        message: result.message,
        fullResult: result,
      });

      if (result.error || !result.data) {
        console.error("❌ [Generate QR] Error en la respuesta:", result);
        showToast(result.message || "Error al generar el código QR", "error");
        onClose();
        return;
      }

      setQrData(result.data);
      console.log("✅ [Generate QR] QR Data recibida exitosamente:", {
        importerId: result.data.importerId,
        importerName: result.data.importerName,
        secretKey: result.data.secretKey,
        qrCodeUrl: result.data.qrCodeUrl,
        createdAt: result.data.createdAt,
        hasQrCodeImage: !!result.data.qrCodeImageBase64,
        qrCodeImagePreview:
          result.data.qrCodeImageBase64?.substring(0, 100) + "...",
      });

      showToast("Código QR generado exitosamente", "success");
    } catch (error) {
      console.error("💥 [Generate QR] Excepción capturada:", error);
      showToast("Error al generar el código QR", "error");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrData || !qrData.qrCodeImageBase64) return;

    try {
      const base64Image = qrData.qrCodeImageBase64.startsWith("data:image")
        ? qrData.qrCodeImageBase64
        : `data:image/png;base64,${qrData.qrCodeImageBase64}`;

      const link = document.createElement("a");
      link.download = `qr-${importer?.name || "importadora"}-${Date.now()}.png`;
      link.href = base64Image;
      link.click();
      showToast("Imagen descargada", "success");
    } catch (error) {
      console.error("Error downloading QR:", error);
      showToast("Error al descargar la imagen", "error");
    }
  };

  const handleClose = () => {
    setQrData(null);
    onClose();
  };

  // Construir URL de acceso usando la variable de entorno
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const accessUrl = importer ? `${baseUrl}/importadora/${importer.id}` : "";

  if (!importer) return null;

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      size="lg"
      title={`Código QR - ${importer.name}`}
      styles={{
        content: {
          backgroundColor: "light-dark(#ffffff, #0e1726)",
        },
        header: {
          backgroundColor: "light-dark(#ffffff, #0e1726)",
          borderBottom: "1px solid light-dark(#e5e7eb, #1b2e4b)",
        },
        title: {
          color: "light-dark(#000000, #ffffff)",
          fontWeight: 600,
        },
        close: {
          color: "light-dark(#374151, #e5e7eb)",
          backgroundColor: "transparent",
        },
      }}
    >
      <LoadingOverlay visible={isLoading} />

      {qrData ? (
        <Stack gap="md">
          <div className="p-4 rounded-lg border bg-gray-50 dark:bg-[#1b2e4b] dark:border-[#17263c]">
            <Text
              size="sm"
              fw={500}
              mb="xs"
              className="text-gray-900 dark:!text-white"
            >
              Instrucciones:
            </Text>
            <Text size="sm" className="text-gray-600 dark:!text-white" style={{ whiteSpace: "pre-line" }}>
              {qrData.instructions}
            </Text>
          </div>

          <Stack align="center" gap="md" py="md">
            {qrData.qrCodeImageBase64 ? (
              <>
                <div ref={qrRef} className="bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src={
                      qrData.qrCodeImageBase64.startsWith("data:image")
                        ? qrData.qrCodeImageBase64
                        : `data:image/png;base64,${qrData.qrCodeImageBase64}`
                    }
                    alt="Código QR de la Importadora"
                    className="w-[280px] h-[280px] object-contain"
                    onError={(e) => {
                      console.error("❌ Error al cargar la imagen QR");
                      e.currentTarget.style.display = "none";
                    }}
                    onLoad={() => {
                      console.log("✅ Imagen QR cargada correctamente");
                    }}
                  />
                </div>

                <Button
                  leftSection={<ArrowDownTrayIcon className="w-4 h-4" />}
                  onClick={handleDownloadQR}
                  variant="light"
                >
                  Descargar Imagen QR
                </Button>
              </>
            ) : (
              <Alert color="red" variant="light">
                <Text size="sm">
                  No se pudo cargar la imagen del código QR. Use la clave
                  secreta para configurar manualmente.
                </Text>
              </Alert>
            )}
          </Stack>

          <div className="p-4 rounded-lg border bg-gray-50 dark:bg-[#1b2e4b] dark:border-[#17263c]">
            <Text
              size="sm"
              fw={500}
              mb="xs"
              className="text-gray-900 dark:!text-white"
            >
              URL de Acceso:
            </Text>
            <Group gap="xs" wrap="nowrap">
              <div className="p-3 rounded border font-mono text-sm flex-1 bg-white dark:bg-[#0e1726] dark:border-[#17263c] text-gray-900 dark:!text-white">
                {accessUrl}
              </div>
              <CopyButton value={accessUrl} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "¡Copiado!" : "Copiar"} withArrow>
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                      size="lg"
                    >
                      {copied ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <ClipboardIcon className="w-5 h-5" />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </div>

          <div className="p-4 rounded-lg border bg-gray-50 dark:bg-[#1b2e4b] dark:border-[#17263c]">
            <Text
              size="sm"
              fw={500}
              mb="xs"
              className="text-gray-900 dark:!text-white"
            >
              Clave Secreta (manual):
            </Text>
            <Group gap="xs" wrap="nowrap">
              <div className="p-3 rounded border font-mono text-sm flex-1 bg-white dark:bg-[#0e1726] dark:border-[#17263c] text-gray-900 dark:!text-white">
                {qrData.secretKey}
              </div>
              <CopyButton value={qrData.secretKey} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "¡Copiado!" : "Copiar"} withArrow>
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                      size="lg"
                    >
                      {copied ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <ClipboardIcon className="w-5 h-5" />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </div>

          <Alert
            color="yellow"
            variant="light"
            className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
          >
            <Text size="sm" className="text-yellow-900 dark:!text-white">
              <strong>Importante:</strong> Esta clave secreta debe guardarse en
              un lugar seguro. La importadora la necesitará si pierde acceso a
              su aplicación de autenticación.
            </Text>
          </Alert>

          <Group justify="flex-end" mt="md">
            <Button
              onClick={handleClose}
              className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
            >
              Cerrar
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack gap="md">
          <Alert
            color="blue"
            variant="light"
            icon={<IconInfoCircle />}
            className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          >
            <Text size="sm" className="text-blue-900 dark:!text-white">
              Aquí puedes generar o regenerar el código QR de acceso para la
              importadora <strong>{importer.name}</strong>.
            </Text>
          </Alert>

          <Alert
            color="gray"
            variant="light"
            className="bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700"
          >
            <Text
              size="sm"
              fw={500}
              mb="xs"
              className="text-gray-900 dark:!text-white"
            >
              ¿Qué hacer con el QR actual?
            </Text>
            <Text size="xs" className="text-gray-600 dark:!text-white" mb="sm">
              - "Mantener QR actual": reutiliza un QR ya generado si existe.
              <br />- "Invalidar y regenerar": revoca el QR anterior y genera
              uno nuevo.
            </Text>
            <Group gap="xs" wrap="wrap" mt="xs">
              <Switch
                checked={forceRegenerate}
                onChange={(event) =>
                  setForceRegenerate(event.currentTarget.checked)
                }
                color={forceRegenerate ? "red" : "green"}
                label={
                  <span className="text-gray-900 dark:!text-white">
                    {forceRegenerate
                      ? "Invalidar y regenerar QR"
                      : "Mantener QR actual (si existe)"}
                  </span>
                }
              />
            </Group>
          </Alert>

          <Stack align="center" gap="sm" py="md">
            <Text size="sm" className="text-gray-600 dark:!text-white" ta="center">
              Selecciona primero qué hacer con el QR actual y luego pulsa el
              botón para generar el código.
            </Text>
            <Button onClick={generateQR} loading={isLoading} size="md">
              Generar código QR
            </Button>
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button
              onClick={handleClose}
              disabled={isLoading}
              className="bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
            >
              Cerrar
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
