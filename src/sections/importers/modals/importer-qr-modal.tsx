"use client";

import SimpleModal from "@/components/modal/modal";
import { Importer } from "@/types/importers";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  importer: Importer | null;
}

export default function ImporterQRModal({ open, onClose, importer }: Props) {
  if (!importer) return null;

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title="Código QR de Acceso"
    >
      <div className="p-6 flex flex-col items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
          Escanea este código QR con Google Authenticator o Microsoft Authenticator
          para generar códigos de acceso temporales
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Image
            src={importer.qrCode}
            alt="QR Code"
            width={256}
            height={256}
            className="rounded"
          />
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Importante:</strong> Este código QR debe ser escaneado solo una vez.
            La aplicación generará códigos de 6 dígitos que cambiarán cada 30 segundos
            y tendrán una validez de 1 hora al acceder al portal.
          </p>
        </div>

        <button
          onClick={onClose}
          className="btn btn-primary mt-6"
        >
          Cerrar
        </button>
      </div>
    </SimpleModal>
  );
}
