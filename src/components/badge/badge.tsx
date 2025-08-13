import React from "react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "outline-warning"
  | "outline-info"
  | "outline-dark";

interface BadgeProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  rounded?: boolean;
}

const variantClassMap: Record<Variant, string> = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  success: "bg-success text-white",
  danger: "bg-danger text-white",
  warning: "bg-warning text-white",
  info: "bg-info text-white",
  dark: "bg-dark text-white",
  "outline-primary": "bg-transparent border border-primary text-primary",
  "outline-secondary": "bg-transparent border border-secondary text-secondary",
  "outline-success": "bg-transparent border border-success text-success",
  "outline-danger": "bg-transparent border border-danger text-danger",
  "outline-warning": "bg-transparent border border-warning text-warning",
  "outline-info": "bg-transparent border border-info text-info",
  "outline-dark": "bg-transparent border border-dark text-dark",
};

const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  className = "",
  children,
  rounded = false,
}) => {
  // Si la clase ya incluye badge-outline-*, no aplicamos la variante del componente
  // para evitar conflictos de estilos
  const hasCustomOutline = className.includes("badge-outline-");

  return (
    <span
      className={clsx(
        "badge",
        !hasCustomOutline && variantClassMap[variant],
        rounded && "rounded-full",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
