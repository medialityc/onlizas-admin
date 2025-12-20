"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImporterAccessSchema, ImporterAccessInput } from "@/sections/importers/schemas/importer";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import LoaderButton from "@/components/loaders/loader-button";
import { toast } from "react-toastify";
import IconLock from "@/components/icon/icon-lock";
import IconPhone from "@/components/icon/icon-phone";

export default function ImporterAccessForm() {
  const router = useRouter();
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const methods = useForm<ImporterAccessInput>({
    resolver: zodResolver(ImporterAccessSchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const storedExpiry = localStorage.getItem("importer_session_expiry");
    if (storedExpiry) {
      const expiry = parseInt(storedExpiry);
      if (expiry > Date.now()) {
        router.push("/importadora/dashboard");
      }
    }
  }, [router]);

  const onSubmit = async (data: ImporterAccessInput) => {
    try {
      const res = await fetch("/api/importers/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Código inválido o expirado");
        return;
      }

      const expiryTime = Date.now() + result.expiresIn * 1000;
      localStorage.setItem("importer_token", result.token);
      localStorage.setItem("importer_session_expiry", expiryTime.toString());
      localStorage.setItem("importer_data", JSON.stringify(result.importer));

      setExpiresAt(expiryTime);
      toast.success("Acceso concedido");
      router.push("/importadora/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar el código de acceso");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
              <IconLock className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
              Portal Importadoras
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mt-2">
              Sistema de Gestión Empresarial
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Acceso Seguro
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Escanea el código QR de tu importadora o ingresa el código de acceso
            </p>
          </div>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2">
                  Código de Acceso
                </label>
                <RHFInputWithLabel
                  name="code"
                  placeholder="Ingresa tu código de 6 dígitos"
                  type="text"
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  autoComplete="off"
                />
              </div>

              <LoaderButton
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full btn btn-primary"
              >
                Continuar
              </LoaderButton>
            </div>
          </FormProvider>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
              <IconLock className="shrink-0 mt-0.5 w-5 h-5 text-green-600" />
              <p>
                <strong className="text-gray-900 dark:text-gray-100">
                  Autenticación de dos factores (2FA)
                </strong>
                <br />
                Compatible con Google Authenticator y Microsoft Authenticator
              </p>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400 mt-4">
              <IconPhone className="shrink-0 mt-0.5 w-5 h-5 text-blue-600" />
              <p>
                El código de acceso es válido por <strong>1 hora</strong> desde el momento del ingreso
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          © 2025 Sistema de Importadoras. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
