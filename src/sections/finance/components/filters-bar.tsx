"use client";
import React from "react";

interface FiltersBarProps {
  children?: React.ReactNode;
}

export function FiltersBar({ children }: FiltersBarProps) {
  return <div className="flex flex-wrap gap-2 items-end mb-3">{children}</div>;
}
