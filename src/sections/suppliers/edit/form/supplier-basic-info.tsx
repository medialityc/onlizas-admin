import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { useFormContext } from "react-hook-form";
import RHFDateInput from "@/components/react-hook-form/rhf-date-input";

export default function SupplierBasicInfo() {
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext<any>();
  const nacionalityType = watch("nacionalityType");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RHFInputWithLabel
        name="name"
        label="Nombre del Proveedor"
        placeholder="Ingresa el nombre del proveedor"
        type="text"
        required
      />
      <RHFInputWithLabel
        name="email"
        label="Email"
        type="email"
        placeholder="correo@ejemplo.com"
        required
      />
      <RHFInputWithLabel
        name="phone"
        label="Teléfono"
        placeholder="Ingresa el número de teléfono"
        type="tel"
        required
      />
      <RHFSelectWithLabel
        name="sellerType"
        label="Tipo de vendedor"
        options={[
          { value: "Mayorista", label: "Mayorista" },
          { value: "Minorista", label: "Minorista" },
          { value: "Ambos", label: "Ambos" },
        ]}
        placeholder="Seleccionar..."
        required
        variant="custom"
      />
      <RHFSelectWithLabel
        name="nacionalityType"
        label="Nacionalidad"
        options={[
          { value: "Nacional", label: "Nacional" },
          { value: "Extranjero", label: "Extranjero" },
          { value: "Ambos", label: "Ambos" },
        ]}
        placeholder="Seleccionar..."
        required
        variant="custom"
      />
      <RHFDateInput
        minDate={new Date()}
        maxDate={new Date("2100-12-31")}
        name="expirationDate"
        label="Fecha de Expiración"
      />
      <RHFInputWithLabel
        name="address"
        label="Dirección"
        placeholder="Ingresa la dirección completa"
        type="text"
        required
      />
      {nacionalityType !== "Nacional" && (
        <RHFInputWithLabel
          name="mincexCode"
          label="Código Mincex"
          placeholder="Ingresa el código Mincex"
          type="text"
          required
        />
      )}
      <div className="space-y-2 md:col-span-2">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Mensaje/Comentarios
        </label>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="Comentarios adicionales sobre el proveedor"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {errors?.message && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.message.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
