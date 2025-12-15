"use client";

import { useEffect, useState } from "react";
import { Card, Stack, Text, Title, Badge, Group, Progress, Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { ClockIcon, CheckCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

interface Props {
  importerId: string;
  expiresAt: number;
}

export default function ImporterSessionView({ importerId, expiresAt }: Props) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const handleLogout = async () => {
    document.cookie = "importer_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "importer_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "importer_expires_at=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    router.push(`/importadora/${importerId}`);
  };

  useEffect(() => {
    const now = Date.now();
    const expiresAtMs = expiresAt;
    const remaining = Math.max(0, expiresAtMs - now);
    
  
    const sessionDuration = 60 * 60 * 1000; 
    setTimeRemaining(remaining);
    setTotalTime(sessionDuration);

    const interval = setInterval(() => {
      const now = Date.now();
      const newRemaining = Math.max(0, expiresAtMs - now);
      
      setTimeRemaining(newRemaining);

      if (newRemaining === 0) {
        clearInterval(interval);
        router.push(`/importadora/${importerId}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, importerId, router]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;
  const isExpiringSoon = timeRemaining < 5 * 60 * 1000; 

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <Card
        shadow="xl"
        padding="xl"
        radius="lg"
        className="w-full max-w-2xl"
        style={{
          backgroundColor: 'light-dark(#ffffff, #0e1726)',
          borderColor: 'light-dark(#e5e7eb, #1b2e4b)',
        }}
      >
        <Stack gap="xl">
          <div className="text-center">
            <Group justify="center" mb="md">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </Group>
            <Title order={2} className="text-gray-900 dark:text-white mb-2">
              Sesión Activa
            </Title>
            <Text size="sm" c="dimmed">
              Vista temporal - Dashboard en desarrollo
            </Text>
          </div>

          <div 
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: 'light-dark(#f9fafb, #1b2e4b)',
              borderColor: 'light-dark(#e5e7eb, #17263c)'
            }}
          >
            <Group justify="space-between" mb="lg">
              <Group gap="xs">
                <ClockIcon className="h-5 w-5 text-blue-500" />
                <Text fw={600} className="text-gray-900 dark:text-white">
                  Tiempo de Sesión
                </Text>
              </Group>
              <Badge 
                size="lg" 
                color={isExpiringSoon ? "red" : "blue"}
                variant="light"
              >
                {formatTime(timeRemaining)}
              </Badge>
            </Group>

            <Progress
              value={progressPercentage}
              color={isExpiringSoon ? "red" : "blue"}
              size="lg"
              radius="md"
              animated
              striped={isExpiringSoon}
            />

            <Text size="xs" c="dimmed" mt="sm" ta="center">
              Tu sesión expirará en {formatTime(timeRemaining)}
            </Text>
          </div>

          <div 
            className="p-4 rounded-lg"
            style={{
              backgroundColor: 'light-dark(#EFF6FF, rgba(30, 58, 138, 0.2))',
              borderColor: 'light-dark(#BFDBFE, rgba(30, 58, 138, 0.5))',
              border: '1px solid'
            }}
          >
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">
                  ID de Importadora:
                </Text>
                <Text size="sm" className="font-mono text-gray-900 dark:text-white">
                  {importerId.substring(0, 8)}...
                </Text>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">
                  Estado:
                </Text>
                <Group gap="xs">
                  <Badge color="green" size="sm">
                    Autenticado
                  </Badge>
                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    leftSection={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </Button>
                </Group>
              </Group>

              <Group justify="space-between">
                <Text size="sm" fw={500} className="text-gray-700 dark:text-gray-300">
                  Expira a las:
                </Text>
                <Text size="sm" className="text-gray-900 dark:text-white">
                  {new Date(expiresAt).toLocaleTimeString('es-ES')}
                </Text>
              </Group>
            </Stack>
          </div>

          {isExpiringSoon && (
            <div 
              className="p-4 rounded-lg"
              style={{
                backgroundColor: 'light-dark(#FEF9C3, rgba(161, 98, 7, 0.2))',
                borderColor: 'light-dark(#FDE047, rgba(161, 98, 7, 0.5))',
                border: '1px solid'
              }}
            >
              <Text size="sm" fw={500} className="text-yellow-800 dark:text-yellow-200" ta="center">
                ⚠️ Tu sesión está por expirar. Serás redirigido al login automáticamente.
              </Text>
            </div>
          )}
        </Stack>
      </Card>
    </div>
  );
}
