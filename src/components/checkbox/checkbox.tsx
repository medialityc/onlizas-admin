import React, { forwardRef, InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type" | "value"
> {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, checked, onCheckedChange, onBlur, disabled = false, ...rest },
    ref,
  ) => {
    return (
      <label className="flex items-center cursor-pointer gap-2">
        <input
          ref={ref}
          type="checkbox"
          className="form-checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange(e.target.checked)}
          onBlur={onBlur}
          {...rest}
        />
        {label && (
          <span
            className={`text-gray-700 dark:text-gray-200 ${disabled ? "opacity-50" : ""}`}
          >
            {label}
          </span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
