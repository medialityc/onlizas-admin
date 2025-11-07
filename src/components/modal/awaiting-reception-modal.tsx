import { useState } from "react";
import SimpleModal from "./modal";
import { Button } from "@/components/button/button";

interface AwaitingReceptionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

const AwaitingReceptionModal: React.FC<AwaitingReceptionModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Marcar esperando recepción",
  description = "¿Estás seguro de que deseas marcar esta transferencia como esperando recepción? El almacén destino podrá proceder con la recepción.",
}) => {
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm(notes);
  };

  const handleClose = () => {
    setNotes(""); // Limpiar notas al cerrar
    onClose();
  };

  return (
    <SimpleModal onClose={handleClose} open={open} title={title}>
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-200">{description}</p>

        {/* Campo de notas */}
        <div>
          <label 
            htmlFor="awaiting-notes" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Notas adicionales (opcional)
          </label>
          <textarea
            id="awaiting-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Agregar comentarios sobre el estado de la transferencia..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Marcando..." : "Marcar Esperando Recepción"}
          </Button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default AwaitingReceptionModal;