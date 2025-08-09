# RHF Select Component

Componente Select integrado con React Hook Form, basado en el estilo y funcionalidad del componente RHF Input existente.

## Características

- ✅ **Integración completa con React Hook Form**
- ✅ **Soporte para selección simple y múltiple**
- ✅ **Validación automática con errores visuales**
- ✅ **Opciones deshabilitadas**
- ✅ **Tamaños configurables** (small, medium)
- ✅ **Tema oscuro y claro**
- ✅ **Accesibilidad completa**
- ✅ **TypeScript con tipado estricto**
- ✅ **Estilos consistentes con el sistema de diseño**

## Uso Básico

```tsx
import RHFSelectWithLabel from "@/components/react-hook-form/rhf-select";
import { useForm, FormProvider } from "react-hook-form";

const options = [
  { value: "option1", label: "Opción 1" },
  { value: "option2", label: "Opción 2" },
  { value: "option3", label: "Opción 3", disabled: true },
];

function MyForm() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form>
        <RHFSelectWithLabel
          name="mySelect"
          label="Mi Select"
          options={options}
          placeholder="Selecciona una opción"
          required
        />
      </form>
    </FormProvider>
  );
}
```

## Props

| Prop                 | Tipo                     | Por defecto        | Descripción                                      |
| -------------------- | ------------------------ | ------------------ | ------------------------------------------------ |
| `name`               | `string`                 | -                  | **Requerido.** Nombre del campo en el formulario |
| `options`            | `SelectOption[]`         | `[]`               | **Requerido.** Array de opciones del select      |
| `label`              | `string`                 | -                  | Etiqueta del campo                               |
| `placeholder`        | `string`                 | `"Seleccionar..."` | Texto placeholder                                |
| `required`           | `boolean`                | `false`            | Si el campo es obligatorio                       |
| `disabled`           | `boolean`                | `false`            | Si el campo está deshabilitado                   |
| `multiple`           | `boolean`                | `false`            | Permite selección múltiple                       |
| `size`               | `"small" \| "medium"`    | `"medium"`         | Tamaño del select                                |
| `emptyOption`        | `string`                 | -                  | Texto para la opción vacía                       |
| `underLabel`         | `string`                 | -                  | Texto de ayuda debajo del campo                  |
| `showError`          | `boolean`                | `true`             | Mostrar mensajes de error                        |
| `width`              | `CSSProperties["width"]` | -                  | Ancho personalizado                              |
| `containerClassname` | `string`                 | -                  | Clases CSS adicionales para el contenedor        |

## Tipo SelectOption

```typescript
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

## Ejemplos de Uso

### Select Simple

```tsx
<RHFSelectWithLabel
  name="supplierType"
  label="Tipo de Proveedor"
  options={[
    { value: "persona", label: "Persona Natural" },
    { value: "empresa", label: "Empresa" },
  ]}
  required
/>
```

### Select Múltiple

```tsx
<RHFSelectWithLabel
  name="categories"
  label="Categorías"
  options={categoryOptions}
  multiple
  required
  underLabel="Mantén presionado Ctrl/Cmd para seleccionar múltiples"
/>
```

### Select con Opciones Deshabilitadas

```tsx
<RHFSelectWithLabel
  name="plan"
  label="Plan"
  options={[
    { value: "basic", label: "Básico" },
    { value: "premium", label: "Premium", disabled: true },
    { value: "enterprise", label: "Empresarial" },
  ]}
/>
```

### Select Pequeño

```tsx
<RHFSelectWithLabel
  name="status"
  label="Estado"
  size="small"
  options={statusOptions}
/>
```

### Select con Validación

```tsx
// Schema con Zod
const schema = z.object({
  country: z.string().min(1, "Debe seleccionar un país"),
  categories: z.array(z.string()).min(1, "Seleccione al menos una categoría"),
});

// En el componente
<RHFSelectWithLabel
  name="country"
  label="País"
  options={countryOptions}
  required
  underLabel="Este campo es obligatorio"
/>;
```

## Integración con Formularios Existentes

Para usar en el sistema de suppliers:

```tsx
// En suppliers-schema.ts
export const suppliersSchema = z.object({
  // ... otros campos
  supplierType: z.enum(["Persona", "Empresa"], {
    required_error: "Debes seleccionar un tipo de proveedor.",
  }),
});

// En el formulario
<RHFSelectWithLabel
  name="supplierType"
  label="Tipo de Proveedor"
  options={suppliersTypes.map((type) => ({
    value: type.name,
    label: type.name,
  }))}
  required
/>;
```

## Estilos y Temas

El componente incluye soporte completo para:

- **Tema claro/oscuro** automático
- **Estados hover/focus** con transiciones suaves
- **Estados de error** con colores diferenciados
- **Estados disabled** con opacidad reducida
- **Responsive design** adaptativo

## Accesibilidad

- ✅ Labels correctamente asociados
- ✅ Soporte para lectores de pantalla
- ✅ Navegación por teclado
- ✅ Estados focus visibles
- ✅ Indicadores de campo requerido

## Compatibilidad

- ✅ React Hook Form v7+
- ✅ TypeScript 4.5+
- ✅ Tailwind CSS 3.x
- ✅ Heroicons v2
- ✅ Modern browsers (ES2020+)

## Notas Técnicas

### Manejo de Valores

- **Select simple:** Retorna `string | number`
- **Select múltiple:** Retorna `(string | number)[]`
- **Validación automática** con React Hook Form
- **Conversión de tipos** automática según necesidad

### Performance

- **Renders optimizados** con React Hook Form Controller
- **Event handlers memoizados** para evitar re-renders
- **Lazy loading** de opciones (si se necesita)

### Personalización

El componente usa clases de Tailwind CSS que se pueden sobrescribir:

```tsx
<RHFSelectWithLabel
  name="custom"
  label="Campo Personalizado"
  options={options}
  containerClassname="my-custom-container"
  className="my-custom-select"
/>
```
