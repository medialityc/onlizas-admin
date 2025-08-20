"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { answerApprovalProcess } from "@/services/supplier";

interface ApprovalControlsProps {
  approvalProcessId: string;
  className?: string;
}

export default function ApprovalControls({
  approvalProcessId,
  className,
}: ApprovalControlsProps) {
  const [comments, setComments] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = (isApproved: boolean) => {
    const data = { approvalProcessId, isApproved, comments };
    startTransition(async () => {
      const res = await answerApprovalProcess(approvalProcessId, data);
      if (res?.error) {
        toast.error(res?.message || "No se pudo procesar la solicitud");
        return;
      }
      console.log(res);

      if (res.data) {
        toast.success(
          res.data.isApproved ? "Solicitud aprobada" : "Solicitud rechazada"
        );
      }
    });
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Comentarios
      </label>
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Añade comentarios opcionales"
        rows={3}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => submit(true)}
          disabled={isPending}
          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          Aprobar
        </button>
        <button
          type="button"
          onClick={() => submit(false)}
          disabled={isPending}
          className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}
