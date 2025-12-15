"use client";

import { useState, useEffect, useRef } from "react";
import { Modal, Stack, Text, Button, Alert, LoadingOverlay, CopyButton, ActionIcon, Tooltip, Group, Skeleton } from "@mantine/core";
import { Importer } from "@/types/importers";
import showToast from "@/config/toast/toastConfig";
import { generateImporterQRCode } from "@/services/importers";
import IconInfoCircle from "@/components/icon/icon-info-circle";
import { CheckIcon, ClipboardIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { QRCodeSVG } from "qrcode.react";

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

  useEffect(() => {
    if (open && importer) {
      generateQR();
    }
  }, [open, importer]);

  const generateQR = async () => {
    if (!importer) return;

    setIsLoading(true);
    try {
      const result = await generateImporterQRCode(importer.id);

      if (result.error || !result.data) {
        showToast(result.message || "Error al generar el código QR", "error");
        onClose();
        return;
      }

      setQrData(result.data);
      console.log("QR Data received:", {
        ...result.data,
        qrCodeImageBase64: result.data.qrCodeImageBase64?.substring(0, 50) + "...",
      });
      console.log("QR Code URL completo:", result.data.qrCodeUrl);
      console.log("Secret Key:", result.data.secretKey);
      showToast("Código QR generado exitosamente", "success");
    } catch (error) {
      console.error("Error generating QR code:", error);
      showToast("Error al generar el código QR", "error");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrData || !qrRef.current) return;

    try {
      const svg = qrRef.current.querySelector('svg');
      if (!svg) {
        showToast("Error al obtener el código QR", "error");
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `qr-${importer?.name || 'importadora'}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast("Imagen descargada", "success");
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
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
  const accessUrl = importer 
    ? `${baseUrl}/importadora/${importer.id}`
    : '';

  if (!importer) return null;

  return (
    <Modal
      opened={open}
      onClose={handleClose}
      size="lg"
      title={`Código QR - ${importer.name}`}
      styles={{
        content: {
          backgroundColor: 'light-dark(#ffffff, #0e1726)',
        },
        header: {
          backgroundColor: 'light-dark(#ffffff, #0e1726)',
          borderBottom: '1px solid light-dark(#e5e7eb, #1b2e4b)',
        },
        title: {
          color: 'light-dark(#000000, #ffffff)',
          fontWeight: 600,
        },
        close: {
          color: 'light-dark(#374151, #e5e7eb)',
        },
      }}
    >
      <LoadingOverlay visible={isLoading} />

      {qrData ? (
        <Stack gap="md">
      
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'light-dark(#f9fafb, #1b2e4b)',
              borderColor: 'light-dark(#e5e7eb, #17263c)'
            }}
          >
            <Text size="sm" fw={500} mb="xs" className="text-black dark:text-white">
              Instrucciones:
            </Text>
            <Text size="sm" c="dimmed" style={{ whiteSpace: "pre-line" }}>
              {qrData.instructions}
            </Text>
          </div>

          <Stack align="center" gap="md" py="md">
            {qrData.qrCodeUrl ? (
              <>
                <div ref={qrRef} className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCodeSVG
                    value={decodeURIComponent(qrData.qrCodeUrl)}
                    size={280}
                    level="H"
                    includeMargin={true}
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
                  No se pudo cargar la imagen del código QR. Use la clave secreta para configurar manualmente.
                </Text>
              </Alert>
            )}
          </Stack>

          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'light-dark(#f9fafb, #1b2e4b)',
              borderColor: 'light-dark(#e5e7eb, #17263c)'
            }}
          >
            <Text size="sm" fw={500} mb="xs" className="text-black dark:text-white">
              URL de Acceso:
            </Text>
            <Group gap="xs" wrap="nowrap">
              <div 
                className="p-3 rounded border font-mono text-sm flex-1"
                style={{
                  backgroundColor: 'light-dark(#ffffff, #0e1726)',
                  borderColor: 'light-dark(#e5e7eb, #17263c)',
                  color: 'light-dark(#000000, #ffffff)'
                }}
              >
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

          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'light-dark(#f9fafb, #1b2e4b)',
              borderColor: 'light-dark(#e5e7eb, #17263c)'
            }}
          >
            <Text size="sm" fw={500} mb="xs" className="text-black dark:text-white">
              Clave Secreta (manual):
            </Text>
            <Group gap="xs" wrap="nowrap">
              <div 
                className="p-3 rounded border font-mono text-sm flex-1"
                style={{
                  backgroundColor: 'light-dark(#ffffff, #0e1726)',
                  borderColor: 'light-dark(#e5e7eb, #17263c)',
                  color: 'light-dark(#000000, #ffffff)'
                }}
              >
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
            styles={{
              root: {
                backgroundColor: 'light-dark(#FEF9C3, rgba(161, 98, 7, 0.2))',
                borderColor: 'light-dark(#FDE047, rgba(161, 98, 7, 0.5))'
              }
            }}
          >
            <Text size="sm">
              <strong>Importante:</strong> Esta clave secreta debe guardarse en un lugar seguro.
              La importadora la necesitará si pierde acceso a su aplicación de autenticación.
            </Text>
          </Alert>

          <Group justify="flex-end" mt="md">
            <Button onClick={handleClose}>
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
            styles={{
              root: {
                backgroundColor: 'light-dark(#EFF6FF, rgba(30, 58, 138, 0.2))',
                borderColor: 'light-dark(#BFDBFE, rgba(30, 58, 138, 0.5))'
              }
            }}
          >
            <Skeleton height={40} radius="sm" />
          </Alert>

          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'light-dark(#f9fafb, #1b2e4b)',
              borderColor: 'light-dark(#e5e7eb, #17263c)'
            }}
          >
            <Skeleton height={20} width="40%" mb="xs" />
            <Skeleton height={60} />
          </div>

          <Stack align="center" gap="md" py="md">
            <Skeleton height={280} width={280} />
            <Skeleton height={36} width={180} />
          </Stack>

          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'light-dark(#f9fafb, #1b2e4b)',
              borderColor: 'light-dark(#e5e7eb, #17263c)'
            }}
          >
            <Skeleton height={20} width="50%" mb="xs" />
            <Skeleton height={48} />
          </div>

          <Skeleton height={60} />

          <Group justify="flex-end" mt="md">
            <Skeleton height={36} width={80} />
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
