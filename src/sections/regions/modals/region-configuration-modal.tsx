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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/label/label";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCurrenciesToRegion,
  addPaymentGatewaysToRegion,
  addShippingMethodsToRegion,
} from "@/services/regions";
import { usePermissions } from "zas-sso-client";
import showToast from "@/config/toast/toastConfig";
import { CurrencyConfigForm } from "./components/currency-config-form";
import { PaymentConfigForm } from "./components/payment-config-form";
import { ShippingConfigForm } from "./components/shipping-config-form";

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
  const { data: permissions = [], isLoading: permissionsLoading } =
    usePermissions();

  // Helper function to check permissions
  const hasPermission = (permissionCode: string) => {
    return permissions.some((permission) => permission.code === permissionCode);
  };

  const hasCreatePermission = hasPermission("CREATE_ALL");


  const queryClient = useQueryClient();

  // Mutations
  const addCurrencyMutation = useMutation({
    mutationFn: async (config: { currencyId: number; isPrimary: boolean }) => {
      const response = await addCurrenciesToRegion(region.id, {
        currencies: [{ currencyId: config.currencyId, isEnabled: true, isPrimary: false }]
      });
      if (response.error) {
        throw new Error(response.message || "Error al agregar la moneda");
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
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
      paymentGatewayId: number;
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
          response.message || "Error al agregar el método de pago"
        );
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      showToast("Método de pago agregado exitosamente a la región", "success");
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Error adding payment method:", error);
      showToast(
        error?.message || "Error al agregar el método de pago",
        "error"
      );
    },
  });

  const addShippingMutation = useMutation({
    mutationFn: async (shippingMethodId: number) => {
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
          response.message || "Error al agregar el método de entrega"
        );
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      showToast(
        "Método de entrega agregado exitosamente a la región",
        "success"
      );
      onSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Error adding shipping method:", error);
      showToast(
        error?.message || "Error al agregar el método de entrega",
        "error"
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
        currencyId: parseInt(selectedCurrency),
        ...currencyConfig,
      });
    } else if (selectedType === "payment-method" && selectedPaymentMethod) {
      addPaymentMutation.mutate({
        paymentGatewayId: parseInt(selectedPaymentMethod),
        ...paymentConfig,
      });
    } else if (selectedType === "shipping-method" && selectedShippingMethod) {
      addShippingMutation.mutate(parseInt(selectedShippingMethod));
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
      loading={loading || permissionsLoading}
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
                <Select
                  value={selectedType}
                  onValueChange={(value) => setSelectedType(value as ConfigurationType | "")}
                  disabled={!hasCreatePermission}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona qué agregar a la región" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="currency">💰 Agregar Moneda</SelectItem>
                    <SelectItem value="payment-method">
                      💳 Agregar Pasarela de Pago
                    </SelectItem>
                    <SelectItem value="shipping-method">
                      🚚 Agregar Método de Entrega
                    </SelectItem>
                  </SelectContent>
                </Select>
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
              disabled={loading || permissionsLoading}
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
                permissionsLoading ||
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
