import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../button/button";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "ghost" | "outline" | "primary" | "secondary";
  title?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, variant = "ghost", title, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant as any}
        size="icon"
        className={cn("h-8 w-8", className)}
        title={title}
        {...props}
      >
        {icon}
      </Button>
    );
  },
);
IconButton.displayName = "IconButton";
