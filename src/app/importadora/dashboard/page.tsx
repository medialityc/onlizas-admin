"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge, Progress, Tabs } from "@mantine/core";
import IconClock from "@/components/icon/icon-clock";
import IconUsers from "@/components/icon/icon-users";
import IconTag from "@/components/icon/icon-tag";
import IconFile from "@/components/icon/icon-file";
import IconLogout from "@/components/icon/icon-logout";
import { Importer } from "@/types/importers";

export default function ImporterDashboardPage() {
  const router = useRouter();
  const [importer, setImporter] = useState<Importer | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timePercentage, setTimePercentage] = useState<number>(100);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("importer_token");
    localStorage.removeItem("importer_session_expiry");
    localStorage.removeItem("importer_data");
    router.push("/importadora/acceso");
  }, [router]);

  useEffect(() => {
    const storedExpiry = localStorage.getItem("importer_session_expiry");
    const storedImporter = localStorage.getItem("importer_data");

    if (!storedExpiry || !storedImporter) {
      router.push("/importadora/acceso");
      return;
    }

    const expiry = parseInt(storedExpiry);
    if (expiry <= Date.now()) {
      handleLogout();
      return;
    }

    setImporter(JSON.parse(storedImporter));

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiry - now);
      
      if (remaining === 0) {
        handleLogout();
        return;
      }

      setTimeRemaining(remaining);
      const totalTime = 3600 * 1000;
      const percentage = (remaining / totalTime) * 100;
      setTimePercentage(percentage);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [router, handleLogout]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getProgressColor = () => {
    if (timePercentage > 50) return "green";
    if (timePercentage > 25) return "yellow";
    return "red";
  };

  if (!importer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {importer.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Portal de Importadora
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <IconClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Tiempo Restante
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatTime(timeRemaining)}
                    </p>
                    <Progress
                      value={timePercentage}
                      color={getProgressColor()}
                      size="xs"
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>

              <button
                onClick={handleLogout}
                className="btn btn-outline-danger flex items-center gap-2"
              >
                <IconLogout className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Nomencladores Activos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  12
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +2 este mes
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <IconTag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Proveedores Contratados
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  8
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +1 este mes
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <IconUsers className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Solicitudes Pendientes
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  3
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  Requieren revisión
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <IconFile className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Contratos por Vencer
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  2
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Próximos 30 días
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                <IconClock className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-white dark:bg-gray-800">
          <Tabs defaultValue="nomenclators">
            <Tabs.List>
              <Tabs.Tab value="nomenclators">
                Nomencladores
              </Tabs.Tab>
              <Tabs.Tab value="pending">
                Solicitudes Pendientes
                <Badge ml="xs" size="sm" variant="filled" color="yellow">
                  3
                </Badge>
              </Tabs.Tab>
              <Tabs.Tab value="providers">
                Proveedores Contratados
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="nomenclators" pt="md">
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Lista de nomencladores disponibles para tus proveedores
                </p>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="pending" pt="md">
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Solicitudes de contrato pendientes de revisión
                </p>
              </div>
            </Tabs.Panel>

            <Tabs.Panel value="providers" pt="md">
              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Proveedores con contrato activo
                </p>
              </div>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
