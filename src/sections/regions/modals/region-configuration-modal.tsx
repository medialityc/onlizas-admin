"use client";

import { useState, useEffect } from "react";
import SimpleModal from "@/components/modal/modal";
import { Region } from "@/types/regions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import { Button } from "@/components/button/button";
import { Select as SearchSelect } from "@/components/select/select";
import { Label } from "@/components/label/label";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCurrenciesToRegion,
  addPaymentGatewaysToRegion,
  addShippingMethodsToRegion,
} from "@/services/regions";
import { usePermissions } from "@/hooks/use-permissions";
import showToast from "@/config/toast/toastConfig";
import { CurrencyConfigForm } from "./components/currency-config-form";
import { PaymentConfigForm } from "./components/payment-config-form";
import { ShippingConfigForm } from "./components/shipping-config-form";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface RegionConfigurationModalProps {
  open: boolean;
  onClose: () => void;
  region: Region;
  loading?: boolean;
  onSuccess?: () => void;
  initialTab?: "currencies" | "payments" | "shipping";
}

type ConfigurationType = "currency" | "payment-method" | "shipping-method";

export default function RegionConfigurationModal({
  open,
  onClose,
  region,
  loading = false,
  onSuccess,
  initialTab = "currencies",
}: RegionConfigurationModalProps) {
  const [selectedType, setSelectedType] = useState<ConfigurationType | "">("");
  const [typeQuery, setTypeQuery] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");

  // Configuraciones adicionales
  const [currencyConfig, setCurrencyConfig] = useState({ isPrimary: false });
  const [paymentConfig, setPaymentConfig] = useState({ priority: 50 });

  // Set initial type based on initialTab prop
  useEffect(() => {
    if (open && initialTab) {
      const typeMap: Record<string, ConfigurationType> = {
        currencies: "currency",
        payments: "payment-method",
        shipping: "shipping-method",
      };
      const mappedType = typeMap[initialTab];
      if (mappedType) {
        setSelectedType(mappedType);
      }
    }
  }, [open, initialTab]);

  // Permission hooks
  const { hasPermission, isLoading } = usePermissions();
  const hasCreatePermission = hasPermission([PERMISSION_ENUM.CREATE]);

  const queryClient = useQueryClient();

  // Mutations
  const addCurrencyMutation = useMutation({
    mutationFn: async (config: {
      currencyId: number | string;
      isPrimary: boolean;
    }) => {
      const response = await addCurrenciesToRegion(region.id, {
        currencies: [
          { currencyId: config.currencyId, isEnabled: true, isPrimary: false },
        ],
      });
      if (response.error) {
        throw new Error(response.message || "Error al agregar la moneda");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      queryClient.invalidateQueries({
        queryKey: ["region-details", region.id],
      });
      showToast("Moneda agregada exitosamente a la región", "success");
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Error adding currency:", error);
      showToast(error?.message || "Error al agregar la moneda", "error");
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (config: {
      paymentGatewayId: number | string;
      priority: number;
    }) => {
      const response = await addPaymentGatewaysToRegion(region.id, {
        paymentGateways: [
          {
            ...config,
            isFallback: false,
            isEnabled: true,
            supportedMethods: ["card"], // Default method
            configurationJson: "",
          },
        ],
      });
      if (response.error) {
        throw new Error(
          response.message || "Error al agregar el método de pago",
        );
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      queryClient.invalidateQueries({
        queryKey: ["region-details", region.id],
      });
      showToast("Método de pago agregado exitosamente a la región", "success");
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Error adding payment method:", error);
      showToast(
        error?.message || "Error al agregar el método de pago",
        "error",
      );
    },
  });

  const addShippingMutation = useMutation({
    mutationFn: async (shippingMethodId: number | string) => {
      const response = await addShippingMethodsToRegion(region.id, {
        shippingMethods: [
          {
            shippingMethodId,
            baseCost: 0, // Default cost
            estimatedDaysMin: 1,
            estimatedDaysMax: 7,
            carrier: "Default",
            enabled: true,
          },
        ],
      });
      if (response.error) {
        throw new Error(
          response.message || "Error al agregar el método de entrega",
        );
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      queryClient.invalidateQueries({
        queryKey: ["region-details", region.id],
      });
      showToast(
        "Método de entrega agregado exitosamente a la región",
        "success",
      );
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Error adding shipping method:", error);
      showToast(
        error?.message || "Error al agregar el método de entrega",
        "error",
      );
    },
  });

  const handleClose = () => {
    setSelectedType("");
    setSelectedCurrency("");
    setSelectedPaymentMethod("");
    setSelectedShippingMethod("");
    setCurrencyConfig({ isPrimary: false });
    setPaymentConfig({ priority: 50 });
    onClose();
  };

  const handleSave = () => {
    if (selectedType === "currency" && selectedCurrency) {
      addCurrencyMutation.mutate({
        currencyId: selectedCurrency,
        ...currencyConfig,
      });
    } else if (selectedType === "payment-method" && selectedPaymentMethod) {
      addPaymentMutation.mutate({
        paymentGatewayId: selectedPaymentMethod,
        ...paymentConfig,
      });
    } else if (selectedType === "shipping-method" && selectedShippingMethod) {
      addShippingMutation.mutate(selectedShippingMethod);
    }
  };

  const canSave =
    selectedType &&
    ((selectedType === "currency" && selectedCurrency) ||
      (selectedType === "payment-method" && selectedPaymentMethod) ||
      (selectedType === "shipping-method" && selectedShippingMethod));

  const renderConfigurationForm = () => {
    switch (selectedType) {
      case "currency":
        return (
          <CurrencyConfigForm
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            isPrimary={currencyConfig.isPrimary}
            onPrimaryChange={(value) =>
              setCurrencyConfig((prev) => ({ ...prev, isPrimary: value }))
            }
            disabled={!hasCreatePermission}
          />
        );

      case "payment-method":
        return (
          <PaymentConfigForm
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={setSelectedPaymentMethod}
            priority={paymentConfig.priority}
            onPriorityChange={(value) =>
              setPaymentConfig((prev) => ({ ...prev, priority: value }))
            }
            disabled={!hasCreatePermission}
          />
        );

      case "shipping-method":
        return (
          <ShippingConfigForm
            selectedShippingMethod={selectedShippingMethod}
            onShippingMethodChange={setSelectedShippingMethod}
            disabled={!hasCreatePermission}
          />
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Selecciona un servicio para continuar</p>
          </div>
        );
    }
  };

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading || isLoading}
      title={`Configurar Servicios: ${region.name}`}
    >
      <div className="p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Tipo de configuración */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Agregar Servicios a la Región
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>¿Qué deseas agregar a la región?</Label>
                <SearchSelect
                  options={[
                    {
                      id: "currency" as ConfigurationType,
                      label: "💰 Agregar Moneda",
                    },
                    {
                      id: "payment-method" as ConfigurationType,
                      label: "💳 Agregar Pasarela de Pago",
                    },
                    {
                      id: "shipping-method" as ConfigurationType,
                      label: "🚚 Agregar Método de Entrega",
                    },
                  ]}
                  objectValueKey="id"
                  objectKeyLabel="label"
                  placeholder="Selecciona qué agregar a la región"
                  value={selectedType || undefined}
                  onChange={(value) =>
                    setSelectedType((value as ConfigurationType) || "")
                  }
                  disabled={!hasCreatePermission}
                  query={typeQuery}
                  setQuery={setTypeQuery}
                />
              </div>
            </CardContent>
          </Card>

          {/* Formulario dinámico */}
          {selectedType && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedType === "currency" && "Agregar Moneda"}
                  {selectedType === "payment-method" &&
                    "Agregar Método de Pago"}
                  {selectedType === "shipping-method" &&
                    "Agregar Método de Entrega"}
                </CardTitle>
              </CardHeader>
              <CardContent>{renderConfigurationForm()}</CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading || isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={
                !canSave ||
                !hasCreatePermission ||
                loading ||
                isLoading ||
                addCurrencyMutation.isPending ||
                addPaymentMutation.isPending ||
                addShippingMutation.isPending
              }
              className="flex items-center gap-2"
            >
              <CheckIcon className="h-4 w-4" />
              {addCurrencyMutation.isPending ||
              addPaymentMutation.isPending ||
              addShippingMutation.isPending
                ? "Guardando..."
                : "Agregar Configuración"}
            </Button>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
}
