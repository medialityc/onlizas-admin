import { Controller, useFormContext } from "react-hook-form";
import MultiCountrySelect from "../ui/multi-country-select";


interface RHFMultiCountrySelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function RHFMultiCountrySelect({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
}: RHFMultiCountrySelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "Este campo es obligatorio" : false }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <MultiCountrySelect
          selectedCountryIds={Array.isArray(value) ? value : []}
          onSelectionChange={onChange}
          label={label}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          error={error?.message}
        />
      )}
    />
  );
}
