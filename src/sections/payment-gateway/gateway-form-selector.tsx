"use client";

import { TypeGateway } from "@/types";
import { useState } from "react";
import { gatewaysConfig } from "./settings-gateway-forms/forms-config";
import { GatewayForm } from "./settings-gateway-forms/gateway-form";

export const GatewayFormSelector = () => {
  const [selectedGateway, setSelectedGateway] = useState<
    TypeGateway["type"] | ""
  >("");
  return (
    <div className="space-y-4">
      <label
        htmlFor="gateway-type"
        className="block text-sm font-medium dark:text-gray-200"
      >
        Gateway Type
      </label>
      <select
        id="gateway-type"
        value={selectedGateway}
        onChange={(e) =>
          setSelectedGateway(e.target.value as TypeGateway["type"])
        }
        className="w-full  border rounded p-2 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
      >
        <option value="">Select a payment gateway</option>
        <option value="stripe">Stripe</option>
        <option value="paypal">PayPal</option>
        <option value="tropipay">Tropipay</option>
        <option value="square">Square</option>
        <option value="authorize">Authorize.Net</option>
        <option value="bank">Bank Transfer</option>
      </select>

      <div
        className={`transition-all duration-500 ease-in-out ${
          selectedGateway ? "opacity-100" : "opacity-0"
        }`}
      >
        {selectedGateway !== "" && (
          <div className="space-y-10">
            <div className="transition-all duration-500 ease-in-out">
              <GatewayForm
                {...gatewaysConfig[selectedGateway]}
                name={selectedGateway}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
