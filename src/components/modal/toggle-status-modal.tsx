import SimpleModal from "./modal";

interface ToggleStatusDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  active?: boolean;
  itemName?: string;
  title?: string;
  description?: string;
  warningMessage?: string;
  loading?: boolean;
}

const ToggleStatusDialog: React.FC<ToggleStatusDialogProps> = ({
  open,
  onClose,
  onConfirm,
  active,
  itemName = "este elemento",
  title,
  description,
  warningMessage,
  loading,
}) => {
  const actionText = active ? "desactivar" : "activar";
  const actionTextCapitalized = active ? "Desactivar" : "Activar";
  const actionColor = active
    ? "bg-red-600 hover:bg-red-700"
    : "bg-green-600 hover:bg-green-700";
  const loadingText = active ? "Desactivando..." : "Activando...";

  const defaultTitle =
    title || `¿Estás seguro de que quieres ${actionText} ${itemName}?`;
  const defaultDescription =
    description ||
    (active
      ? `Esta acción desactivará ${itemName}. Podrás reactivarlo más tarde si es necesario.`
      : `Esta acción activará ${itemName} y estará disponible para su uso.`);

  return (
    <SimpleModal onClose={onClose} open={open} title={defaultTitle}>
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-200">{defaultDescription}</p>

        {warningMessage && (
          <div
            className={`border rounded p-3 ${
              active
                ? "bg-orange-50 border-orange-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <p
              className={`text-sm ${
                active ? "text-orange-800" : "text-green-800"
              }`}
            >
              {warningMessage}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded disabled:opacity-50 ${actionColor}`}
          >
            {loading ? loadingText : actionTextCapitalized}
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default ToggleStatusDialog;
