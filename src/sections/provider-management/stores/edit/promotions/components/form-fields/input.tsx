import React from "react";
import { RHFInputWithLabel } from "@/components/react-hook-form";

interface InputProps extends Omit<React.ComponentProps<typeof RHFInputWithLabel>, "name"> {
  name: string;
}

export default function FormInput(props: InputProps) {
  // Simple wrapper to keep API consistent with previous code
  return <RHFInputWithLabel {...props} />;
}
