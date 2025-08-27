import type { UseFormReturn } from "react-hook-form";

const forms = new Map<string, UseFormReturn<any>>();

export function registerForm(id: string, methods: UseFormReturn<any>) {
  forms.set(id, methods);
}

export function unregisterForm(id: string) {
  forms.delete(id);
}

export function getForm(id: string): UseFormReturn<any> | undefined {
  return forms.get(id);
}

export function hasForm(id: string): boolean {
  return forms.has(id);
}
