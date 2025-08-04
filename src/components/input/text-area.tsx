import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface TextAreaProps {
  id?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      name,
      placeholder,
      rows = 3,
      value,
      disabled = false,
      onChange,
      onBlur,
      className,
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={cn("resize-y min-h-[64px] form-textarea p-2", className)}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        value={value}
        disabled={disabled}
      />
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
