"use client";

import { useState } from "react";
import { Modal, Stack, Title, Text, Image, Button, Alert, LoadingOverlay } from "@mantine/core";
import { generateImporterQR } from "@/services/importer-access";
import showToast from "@/config/toast/toastConfig";
import IconInfoCircle from "@/components/icon/icon-info-circle";

interface Props {
  importerId: string;
  importerName: string;
  opened: boolean;
  onClose: () => void;
}

export default function QRSetupModal({ importerId, importerName, opened, onClose }: Props) {
  const [qrData, setQrData] = useState<{
    qrCodeImageBase64: string;
    secretKey: string;
    instructions: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQR = async () => {
    setIsLoading(true);
    try {
      const result = await generateImporterQR(importerId);
      
      if (result.error || !result.data) {
        showToast(result.message || "Error al generar el código QR", "error");
        return;
      }

      setQrData({
        qrCodeImageBase64: result.data.qrCodeImageBase64,
        secretKey: result.data.secretKey,
        instructions: result.data.instructions,
      });
    } catch (error) {
      showToast("Error al generar el código QR", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    if (!qrData) {
      showToast("Debe generar el código QR primero", "warning");
      return;
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={qrData ? onClose : () => {}}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={!!qrData}
      size="lg"
      title={
        <Title order={3}>
          Configuración de Autenticación 2FA
        </Title>
      }
      styles={{
        content: {
          backgroundColor: "light-dark(#ffffff, #0e1726)",
        },
      }}
    >
      <LoadingOverlay visible={isLoading} />
      
      <Stack gap="md">
        <Alert icon={<IconInfoCircle />} color="blue" variant="light">
          Es la primera vez que accede como <strong>{importerName}</strong>. 
          Debe configurar la autenticación de dos factores (2FA) para continuar.
        </Alert>

        {!qrData ? (
          <Stack gap="md" align="center" py="xl">
            <Text ta="center" c="dimmed">
              Haga clic en el botón para generar su código QR de autenticación.
            </Text>
            <Button onClick={handleGenerateQR} size="lg" loading={isLoading}>
              Generar Código QR
            </Button>
          </Stack>
        ) : (
          <Stack gap="md">
            <Text size="sm" fw={500}>
              Instrucciones:
            </Text>
            <Text size="sm" c="dimmed" style={{ whiteSpace: "pre-line" }}>
              {qrData.instructions}
            </Text>

            <Stack align="center" gap="md" py="md">
              <Image
                src={`data:image/png;base64,${qrData.qrCodeImageBase64}`}
                alt="QR Code"
                w={250}
                h={250}
                fit="contain"
              />
              
              <Stack gap="xs" align="center">
                <Text size="xs" c="dimmed">Clave secreta (manual):</Text>
                <Text
                  size="sm"
                  fw={500}
                  style={{
                    fontFamily: "monospace",
                    backgroundColor: "light-dark(#f3f4f6, #1b2e4b)",
                    padding: "8px 16px",
                    borderRadius: "4px",
                  }}
                >
                  {qrData.secretKey}
                </Text>
              </Stack>
            </Stack>

            <Alert color="yellow" variant="light">
              <Text size="sm">
                <strong>Importante:</strong> Guarde esta clave secreta en un lugar seguro. 
                La necesitará si pierde acceso a su aplicación de autenticación.
              </Text>
            </Alert>

            <Button onClick={handleComplete} size="lg" fullWidth>
              He configurado la autenticación
            </Button>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
