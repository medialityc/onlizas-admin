"use client";

import React, { useState } from "react";
import { Button } from "@/components/button/button";
import Badge from "@/components/badge/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCurrenciesToRegion,
  removeCurrencyFromRegion,
  setPrimaryCurrency,
} from "@/services/regions";
import { RegionCurrency } from "@/types/regions";
import { getAllCurrencies } from "@/services/currencies";
import { useRegionDetails } from "@/sections/regions/hooks/use-region-details";

interface CurrenciesSectionProps {
  regionId: number | string;
  regionName: string;
  onClose: () => void;
}

export const CurrenciesSection: React.FC<CurrenciesSectionProps> = ({
  regionId,
  regionName,
  onClose,
}) => {
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch available currencies
  const { data: currenciesData } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => getAllCurrencies({ page: 1, limit: 100 }),
  });

  const currencies = currenciesData?.data?.data || [];

  // Debug: Log what's coming from the API
  React.useEffect(() => {
    if (currencies.length > 0) {
      console.log("Currencies from API:", currencies);
      console.log(
        "First currency ID type:",
        typeof currencies[0]?.id,
        currencies[0]?.id,
      );
    }
  }, [currencies]);

  // Fetch region configuration
  const { data: regionData, isLoading } = useRegionDetails(regionId);

  const regionCurrencies =
    regionData?.data?.currencyConfig?.allCurrencies || [];

  // Mutations
  const addCurrencyMutation = useMutation({
    mutationFn: ({
      currencyId,
      isPrimary,
    }: {
      currencyId: number | string;
      isPrimary?: boolean;
    }) =>
      addCurrenciesToRegion(regionId, {
        currencies: [
          {
            currencyId,
            isPrimary: isPrimary || false,
            isEnabled: true,
          },
        ],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["region-details", regionId] });
      setSelectedCurrencyId("");
    },
  });

  const removeCurrencyMutation = useMutation({
    mutationFn: (currencyId: number | string) =>
      removeCurrencyFromRegion(regionId, currencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["region-details", regionId] });
    },
  });

  const setPrimaryMutation = useMutation({
    mutationFn: (currencyId: number | string) =>
      setPrimaryCurrency(regionId, currencyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["region-details", regionId] });
    },
  });

  const handleAddCurrency = () => {
    if (selectedCurrencyId) {
      const isPrimary = regionCurrencies.length === 0; // First currency is primary by default
      const currencyIdToSend = String(selectedCurrencyId);

      console.log("About to send currency:", {
        selectedCurrencyId,
        selectedType: typeof selectedCurrencyId,
        currencyIdToSend,
        sendType: typeof currencyIdToSend,
        isPrimary,
      });

      addCurrencyMutation.mutate({
        currencyId: currencyIdToSend, // Ensure it's always a string
        isPrimary,
      });
    }
  };

  const handleRemoveCurrency = (currencyId: number | string) => {
    removeCurrencyMutation.mutate(String(currencyId));
  };

  const handleSetPrimary = (currencyId: number | string) => {
    setPrimaryMutation.mutate(String(currencyId));
  };

  // Get available currencies (not already assigned)
  const assignedCurrencyIds = regionCurrencies.map((rc: RegionCurrency) =>
    String(rc.currencyId),
  );
  const availableCurrencies = currencies.filter(
    (currency: any) => !assignedCurrencyIds.includes(String(currency.id)),
  );

  if (isLoading) {
    return <div className="p-4 text-center">Cargando configuración...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Configurar Monedas - {regionName}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Asocia monedas disponibles para esta región. Una moneda debe ser
          marcada como principal.
        </p>
      </div>

      {/* Add new currency */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-3">Agregar Nueva Moneda</h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <select
              value={selectedCurrencyId}
              onChange={(e) => {
                console.log(
                  "Selected currency ID:",
                  e.target.value,
                  "Type:",
                  typeof e.target.value,
                );
                setSelectedCurrencyId(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={availableCurrencies.length === 0}
              title="Seleccionar moneda para agregar a la región"
            >
              <option value="">Seleccionar moneda...</option>
              {availableCurrencies.map((currency: any) => (
                <option key={currency.id} value={currency.id}>
                  {currency.codIso} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleAddCurrency}
            disabled={!selectedCurrencyId || addCurrencyMutation.isPending}
            size="sm"
          >
            {addCurrencyMutation.isPending ? "Agregando..." : "Agregar"}
          </Button>
        </div>
        {availableCurrencies.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Todas las monedas disponibles ya están asignadas a esta región.
          </p>
        )}
      </div>

      {/* Current currencies */}
      <div>
        <h4 className="font-medium mb-3">Monedas Configuradas</h4>
        {regionCurrencies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay monedas configuradas para esta región.
          </div>
        ) : (
          <div className="space-y-2">
            {regionCurrencies.map(
              (regionCurrency: RegionCurrency, index: number) => {
                const currency = currencies.find(
                  (c: any) =>
                    String(c.id) === String(regionCurrency.currencyId),
                );
                if (!currency) return null;

                return (
                  <div
                    key={`currency-${regionCurrency.currencyId}-${index}`}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{currency.codIso}</span>
                      <span className="text-gray-600">{currency.name}</span>
                      {regionCurrency.isPrimary && (
                        <Badge variant="success">Principal</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!regionCurrency.isPrimary && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleSetPrimary(regionCurrency.currencyId)
                          }
                          disabled={setPrimaryMutation.isPending}
                        >
                          Hacer Principal
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          handleRemoveCurrency(regionCurrency.currencyId)
                        }
                        disabled={
                          removeCurrencyMutation.isPending ||
                          regionCurrency.isPrimary
                        }
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </div>
  );
};
