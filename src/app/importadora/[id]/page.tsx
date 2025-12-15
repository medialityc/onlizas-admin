"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { validateImporterAccess } from "@/services/importer-access";
import LoaderButton from "@/components/loaders/loader-button";
import showToast from "@/config/toast/toastConfig";
import { Title, Text, TextInput, Paper, Container, Stack, ThemeIcon, Alert } from "@mantine/core";
import IconLock from "@/components/icon/icon-lock";
import IconInfoCircle from "@/components/icon/icon-info-circle";

export default function ImporterLoginPage() {
  const router = useRouter();
  const params = useParams();
  const importerId = params.id as string;
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      showToast("Por favor ingrese el código", "error");
      return;
    }

    if (code.length !== 6) {
      showToast("El código debe tener 6 dígitos", "error");
      return;
    }

    setIsLoading(true);

    try {
      const result = await validateImporterAccess(importerId, code);

      if (result.success) {
        showToast(`Bienvenido ${result.importer?.name || "Importadora"}`, "success");
        router.push(`/importadora/${importerId}/dashboard`);
        router.refresh();
      } else {
        showToast(result.message || "Código inválido", "error");
      }
    } catch (error) {
      showToast("Error al iniciar sesión", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-[#0e1726]">
      <Container size="xs" className="w-full">
        <Paper 
          shadow="xl" 
          p="xl" 
          radius="md" 
          withBorder
          styles={{
            root: {
              backgroundColor: 'light-dark(#ffffff, #0e1726)',
              borderColor: 'light-dark(#e5e7eb, #1b2e4b)'
            }
          }}
        >
          <Stack gap="lg">
            <div className="text-center">
              <ThemeIcon size={64} radius="xl" variant="light" color="blue" className="mx-auto mb-4">
                <IconLock className="w-8 h-8" />
              </ThemeIcon>
              <Title order={2} mb="xs" className="text-black dark:text-white">
                Acceso Importadora
              </Title>
              <Text size="sm" c="dimmed">
                Ingrese su código de autenticación de 6 dígitos
              </Text>
              <Text size="xs" c="dimmed" mt="xs" className="font-mono">
                ID: {importerId}
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <div>
                  <TextInput
                    label="Código 2FA"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setCode(value);
                    }}
                    disabled={isLoading}
                    maxLength={6}
                    className="text-center text-2xl font-mono tracking-widest"
                    autoComplete="one-time-code"
                    required
                    classNames={{
                      input: "text-center text-2xl font-mono tracking-widest dark:bg-[#1b2e4b] dark:border-[#17263c] dark:text-white"
                    }}
                  />
                  <Text size="xs" c="dimmed" mt="xs">
                    Use la aplicación de autenticación en su dispositivo móvil
                  </Text>
                </div>

                <LoaderButton
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full"
                >
                  Iniciar Sesión
                </LoaderButton>
              </Stack>
            </form>

            <Text size="xs" c="dimmed" ta="center">
              ¿No tiene acceso?{" "}
              <a
                href="/dashboard"
                className="text-primary hover:underline font-medium"
              >
                Ir al dashboard administrativo
              </a>
            </Text>
          </Stack>
        </Paper>

        <Alert 
          icon={<IconInfoCircle className="w-5 h-5" />} 
          title="Autenticación de dos factores" 
          color="blue" 
          mt="md"
          styles={{
            root: {
              backgroundColor: 'light-dark(#EFF6FF, rgba(30, 58, 138, 0.2))',
              borderColor: 'light-dark(#BFDBFE, rgba(30, 58, 138, 0.5))'
            },
            message: {
              color: 'light-dark(#1E3A8A, #93C5FD)'
            }
          }}
        >
          <Text size="xs">
            El administrador le proporcionó un código QR para configurar su aplicación de autenticación
            (Google Authenticator o similar). Use el código de 6 dígitos generado por la aplicación
            para iniciar sesión. Este código cambia cada 30 segundos.
          </Text>
        </Alert>
      </Container>
    </div>
  );
}
