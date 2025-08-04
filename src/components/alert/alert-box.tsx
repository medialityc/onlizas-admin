import { ReactNode } from "react";
import IconX from "../icon/icon-x";

type AlertVariant =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "secondary"
  | "dark";

interface AlertBoxProps {
  variant: AlertVariant;
  icon?: ReactNode;
  title: string;
  message: string | ReactNode;
  onClose?: () => void;
  direction?: "ltr" | "rtl";
}

const variantClasses: Record<AlertVariant, string> = {
  primary:
    "border-primary bg-primary/10 text-primary ltr:border-l-[64px] rtl:border-r-[64px]",
  info: "border-info bg-info/10 text-info ltr:border-l-[64px] rtl:border-r-[64px]",
  success:
    "border-success bg-success/10 text-success ltr:border-l-[64px] rtl:border-r-[64px]",
  warning:
    "border-warning bg-warning/10 text-warning ltr:border-l-[64px] rtl:border-r-[64px]",
  danger:
    "border-danger bg-danger/10 text-danger ltr:border-l-[64px] rtl:border-r-[64px]",
  secondary:
    "border-secondary bg-secondary/10 text-secondary ltr:border-l-[64px] rtl:border-r-[64px]",
  dark: "border-dark bg-dark/10 text-dark ltr:border-l-[64px] rtl:border-r-[64px]",
};

export const AlertBox = ({
  variant,
  icon,
  title,
  message,
  onClose,
  direction = "ltr",
}: AlertBoxProps) => {
  return (
    <div
      className={`relative flex items-center rounded border p-3.5 ${variantClasses[variant]}`}
    >
      {icon && (
        <span
          className={`absolute inset-y-0 m-auto h-6 w-6 text-white ${
            direction === "ltr" ? "-left-11" : "-right-11"
          }`}
        >
          {icon}
        </span>
      )}
      <span className={`${direction === "ltr" ? "pr-2" : "pl-2"}`}>
        <strong className={`${direction === "ltr" ? "mr-1" : "ml-1"}`}>
          {title}
        </strong>
        {message}
      </span>
      {onClose && (
        <button
          type="button"
          className={`${direction === "ltr" ? "ml-auto" : "mr-auto"} hover:opacity-80`}
          onClick={onClose}
        >
          <IconX className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
