// Ejemplo de uso del adaptador
import { iconRegistry, IconKey } from "@/components/icon/icon-registry";
import RHFAutocompleteLocalAdapter from "@/components/react-hook-form/rhf-autocomplete-local-adapter";

// Convertir el registro de iconos en un array
const iconOptions = Object.entries(iconRegistry).map(([key, value]) => ({
  id: key,
  name: value.name,
  key: key as IconKey,
  component: value.component,
}));

interface IconOption {
  name: string;
}

export default function IconSelector({ name }: IconOption) {
  return (
    <RHFAutocompleteLocalAdapter
      name={name}
      label="Seleccionar Icono"
      placeholder="Buscar icono..."
      localData={iconOptions}
      objectValueKey="id"
      objectKeyLabel="name"
      pageSize={20}
      
      searchFilter={(item, searchTerm) => {
        return (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.key.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }}
      renderOption={(option) => (
        <div className="flex items-center gap-2">
          <option.component className="w-4 h-4" />
          <span>{option.name}</span>
          <span className="text-xs text-gray-500">({option.key})</span>
        </div>
      )}
    />
  );
}
