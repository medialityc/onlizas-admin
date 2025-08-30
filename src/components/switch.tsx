import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-9 h-5",
    md: "w-11 h-6",
    lg: "w-14 h-8",
  } as const;

  const thumbSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  } as const;

  const translateClasses = {
    sm: checked ? "translate-x-4" : "translate-x-0.5",
    md: checked ? "translate-x-5" : "translate-x-1",
    lg: checked ? "translate-x-6" : "translate-x-1",
  } as const;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={onChange}
        className={`
          ${sizeClasses[size]}
          relative inline-flex items-center shrink-0 rounded-full
          transition-all duration-300 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
          focus-visible:ring-offset-2 focus-visible:ring-offset-white
          dark:focus-visible:ring-offset-gray-900
          ${
            disabled
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer hover:shadow-md"
          }
          ${
            checked
              ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          }
        `}
      >
        <span
          className={`
            ${thumbSizeClasses[size]}
            ${translateClasses[size]}
            inline-block rounded-full bg-white dark:bg-gray-100
            shadow-lg transform transition-transform duration-300 ease-out
            ${!disabled && "hover:shadow-xl"}
          `}
        />
      </button>
      {label && (
        <span
          className={`
            text-sm font-medium select-none transition-colors
            ${
              disabled
                ? "text-gray-400 dark:text-gray-500"
                : "text-gray-900 dark:text-gray-100"
            }
          `}
        >
          {label}
        </span>
      )}
    </div>
  );
};
