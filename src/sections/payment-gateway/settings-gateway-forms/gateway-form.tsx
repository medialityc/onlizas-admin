import { useForm, Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, Button, Switch } from "@mantine/core";
import { Shield } from "lucide-react";
import { Label } from "@/components/label/label";
import { Input } from "@/components/input/input";
import { Textarea } from "@/components/textarea";
import { Field, GatewayFormProps, GatewayType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { gatewaysSchemas } from "./gateway-schemas.schema";
import { z } from "zod";
import { createGateway } from "@/services/gateways";
import showToast from "@/config/toast/toastConfig";
import { useQueryClient } from "@tanstack/react-query";

const getErrorMessage = (error: unknown) =>
  typeof error === "string" ? error : "";

export function GatewayForm({
  alertText,
  fields,
  switchField,
  selectField,
  buttonText,
  name,
}: GatewayFormProps & { name: GatewayType }) {
  const queryClient = useQueryClient();
  const defaultValues: Record<string, any> = {};

  fields.forEach((f) => {
    defaultValues[f.id] = ""; // texto y textarea siempre ""
  });

  if (selectField) defaultValues[selectField.id] = "sandbox";
  if (switchField) defaultValues[switchField.id] = false;

  const schema = gatewaysSchemas[name] as z.ZodObject<any>;
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Record<string, any>) => {
    try {
      // Mapear los datos del formulario al formato que espera la API
      const gatewayData = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        code: data[`${name}-publishable`],
        description: `Configuración de ${name.charAt(0).toUpperCase() + name.slice(1)}`,
        isEnabled:
          data[`${name}-live`] || data[`${name}-mode`] === "live" || true,
        isDefault: false,
        key: data[`${name}-secret`],
      };

      const response = await createGateway(gatewayData);

      if (response.error) {
        showToast("Error al crear la pasarela", "error");
        return;
      }

      showToast("Pasarela creada exitosamente", "success");
      reset(defaultValues);

      // Invalidar el cache de gateways para que se refresque automáticamente
      queryClient.invalidateQueries({ queryKey: ["gateways"] });
    } catch (error) {
      showToast("Error al crear la pasarela", "error");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Alert
        icon={<Shield className="h-4 w-4" />}
        className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
      >
        <p className="dark:text-gray-200">{alertText}</p>
      </Alert>

      <div className="grid grid-cols-2 gap-4">
        {fields.map((f: Field) => (
          <Controller
            key={f.id}
            name={f.id}
            control={control}
            rules={{ required: `${f.label} es obligatorio` }}
            render={({ field }) =>
              f.component === "textarea" ? (
                <div className="space-y-2">
                  <Label htmlFor={f.id} className="dark:text-gray-200">
                    {f.label}
                  </Label>
                  <Textarea
                    id={f.id}
                    placeholder={f.placeholder || ""}
                    {...field}
                    className="dark:bg-gray-800  dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 px-3 py-2"
                  />
                  {errors[f.id] && (
                    <p className="text-red-500 text-sm">
                      {getErrorMessage(errors[f.id]?.message)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor={f.id} className="dark:text-gray-200">
                    {f.label}
                  </Label>
                  <Input
                    id={f.id}
                    type={f.type || "text"}
                    placeholder={f.placeholder || ""}
                    {...field}
                    value={field.value ?? ""}
                    className="dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-700 px-3 py-2"
                  />
                  {errors[f.id] && (
                    <p className="text-red-500 text-sm">
                      {getErrorMessage(errors[f.id]?.message)}
                    </p>
                  )}
                </div>
              )
            }
          />
        ))}
      </div>

      {selectField && (
        <Controller
          name={selectField.id}
          control={control}
          rules={{ required: `${selectField.label} es obligatorio` }}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor={selectField.id} className="dark:text-gray-200">
                {selectField.label}
              </Label>
              <Select
                value={field.value ?? "sandbox"}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="dark:text-white">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  {selectField.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[selectField.id] && (
                <p className="text-red-500 text-sm">
                  {getErrorMessage(errors[selectField.id]?.message)}
                </p>
              )}
            </div>
          )}
        />
      )}

      {switchField && (
        <Controller
          name={switchField.id}
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Switch
                id={switchField.id}
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
              />
              <Label htmlFor={switchField.id} className="dark:text-gray-200">
                {switchField.label}
              </Label>
            </div>
          )}
        />
      )}

      <Button
        type="submit"
        className="w-full bg-green-500 text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-md 
             hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
             transition-colors duration-200"
      >
        {buttonText || "Guardar Configuración"}
      </Button>
    </form>
  );
}
