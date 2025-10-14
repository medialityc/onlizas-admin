"use client";
import { Input } from "@/components/input/input";
import React from "react";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number; // default to 15 (ITU E.164 max is 15 digits not counting +)
  id?: string;
  className?: string;
  placeholder?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  maxLength = 15,
  id = "phone-input",
  placeholder = "Ingrese número",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    onChange(digitsOnly.slice(0, maxLength));
  };

  return (
    <Input
      id={id}
      type="tel"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full rounded-l-none ps-3"
    />
  );
};

export default PhoneNumberInput;
