import SimpleModal from "./modal";


interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  warningMessage?: string;
  loading?: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "¿Estás seguro de que quieres eliminar?",
  description = "Esta acción eliminará permanentemente el elemento.",
  warningMessage,
  loading,
}) => {
    
  return (
    <SimpleModal onClose={onClose} open={open} title={title}>
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-200">{description}</p>
        {warningMessage && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-800 text-sm">{warningMessage}</p>
          </div>
        )}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4  py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2   bg-danger text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default DeleteDialog;
