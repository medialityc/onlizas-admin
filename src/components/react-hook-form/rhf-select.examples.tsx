import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import RHFSelectWithLabel from "./rhf-select";

// Schema de ejemplo
const exampleSchema = z.object({
  supplierType: z.string().min(1, "Debe seleccionar un tipo de proveedor"),
  country: z.string().min(1, "Debe seleccionar un país"),
  categories: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos una categoría"),
  status: z.string().optional(),
});

type ExampleFormData = z.infer<typeof exampleSchema>;

// Datos de ejemplo
const supplierTypeOptions = [
  { value: "persona", label: "Persona Natural" },
  { value: "empresa", label: "Empresa" },
  { value: "ong", label: "ONG", disabled: true }, // Opción deshabilitada
];

const countryOptions = [
  { value: "co", label: "Colombia" },
  { value: "mx", label: "México" },
  { value: "ar", label: "Argentina" },
  { value: "pe", label: "Perú" },
  { value: "cl", label: "Chile" },
];

const categoryOptions = [
  { value: "tech", label: "Tecnología" },
  { value: "food", label: "Alimentación" },
  { value: "clothing", label: "Vestimenta" },
  { value: "services", label: "Servicios" },
  { value: "manufacturing", label: "Manufactura" },
];

const statusOptions = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "pending", label: "Pendiente" },
];

export function RHFSelectExamples() {
  const methods = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      supplierType: "",
      country: "",
      categories: [],
      status: "",
    },
  });

  const onSubmit = (data: ExampleFormData) => {
    console.log("Form data:", data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Ejemplos de RHF Select
      </h2>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {/* Select Simple Básico */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              1. Select Simple Básico
            </h3>
            <RHFSelectWithLabel
              name="supplierType"
              label="Tipo de Proveedor"
              placeholder="Selecciona el tipo de proveedor"
              options={supplierTypeOptions}
              required
              underLabel="Este campo es obligatorio"
            />
          </div>

          {/* Select con tamaño pequeño */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              2. Select Tamaño Pequeño
            </h3>
            <RHFSelectWithLabel
              name="country"
              label="País"
              placeholder="Selecciona un país"
              options={countryOptions}
              size="small"
              required
            />
          </div>

          {/* Select Múltiple */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              3. Select Múltiple
            </h3>
            <RHFSelectWithLabel
              name="categories"
              label="Categorías"
              options={categoryOptions}
              multiple
              required
              underLabel="Mantén presionado Ctrl/Cmd para seleccionar múltiples opciones"
            />
          </div>

          {/* Select Opcional */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              4. Select Opcional
            </h3>
            <RHFSelectWithLabel
              name="status"
              label="Estado"
              emptyOption="Sin estado específico"
              options={statusOptions}
              underLabel="Este campo es opcional"
            />
          </div>

          {/* Select Deshabilitado */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              5. Select Deshabilitado
            </h3>
            <RHFSelectWithLabel
              name="disabledExample"
              label="Campo Deshabilitado"
              options={statusOptions}
              disabled
              underLabel="Este campo está deshabilitado"
            />
          </div>

          {/* Select con ancho personalizado */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              6. Select con Ancho Personalizado
            </h3>
            <div className="flex space-x-4">
              <RHFSelectWithLabel
                name="halfWidth1"
                label="Primer Campo"
                options={supplierTypeOptions}
                width="50%"
              />
              <RHFSelectWithLabel
                name="halfWidth2"
                label="Segundo Campo"
                options={countryOptions}
                width="50%"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enviar Formulario
            </button>
            <button
              type="button"
              onClick={() => methods.reset()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Limpiar
            </button>
          </div>

          {/* Debug info */}
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Valores actuales del formulario:
            </h4>
            <pre className="text-xs text-gray-600 dark:text-gray-400">
              {JSON.stringify(methods.watch(), null, 2)}
            </pre>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

// Ejemplo de uso básico fuera de formulario
export function BasicSelectExample() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">
        Uso básico (requiere FormProvider):
      </h3>

      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm">
        {`import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";

const options = [
  { value: "option1", label: "Opción 1" },
  { value: "option2", label: "Opción 2" },
  { value: "option3", label: "Opción 3", disabled: true },
];

<RHFSelectWithLabel
  name="mySelect"
  label="Mi Select"
  options={options}
  placeholder="Selecciona una opción"
  required
/>`}
      </pre>
    </div>
  );
}

export default RHFSelectExamples;
