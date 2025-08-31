import SimpleModal from "./modal";

export type ActionType =
  | "delete"
  | "approve"
  | "confirm"
  | "save"
  | "submit"
  | "canceled";

interface ActionConfig {
  label: string;
  loadingLabel?: string;
  className: string;
  variant: "primary" | "danger" | "success" | "warning";
}

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  warningMessage?: string;
  loading?: boolean;
  actionType?: ActionType;
  customAction?: ActionConfig;
  cancelLabel?: string;
  showCancel?: boolean;
}

const defaultActions: Record<ActionType, ActionConfig> = {
  delete: {
    label: "Eliminar",
    loadingLabel: "Eliminando...",
    className: "bg-red-600 hover:bg-red-700",
    variant: "danger",
  },
  canceled: {
    label: "Cancelar",
    loadingLabel: "Cancelando...",
    className: "bg-red-600 hover:bg-red-700",
    variant: "danger",
  },
  approve: {
    label: "Aprobar",
    loadingLabel: "Aprobando...",
    className: "bg-green-600 hover:bg-green-700",
    variant: "success",
  },
  confirm: {
    label: "Confirmar",
    loadingLabel: "Confirmando...",
    className: "bg-blue-600 hover:bg-blue-700",
    variant: "primary",
  },
  save: {
    label: "Guardar",
    loadingLabel: "Guardando...",
    className: "bg-blue-600 hover:bg-blue-700",
    variant: "primary",
  },
  submit: {
    label: "Enviar",
    loadingLabel: "Enviando...",
    className: "bg-blue-600 hover:bg-blue-700",
    variant: "primary",
  },
};

const defaultTitles: Record<ActionType, string> = {
  canceled: "¿Estás seguro de que quieres cancelar?",
  delete: "¿Estás seguro de que quieres eliminar?",
  approve: "¿Confirmar aprobación?",
  confirm: "¿Confirmar acción?",
  save: "¿Guardar cambios?",
  submit: "¿Enviar información?",
};

const defaultDescriptions: Record<ActionType, string> = {
  delete: "Esta acción eliminará permanentemente el elemento.",
  canceled: "Esta acción cancelará permanentemente el elemento.",
  approve: "Esta acción aprobará el elemento.",
  confirm: "Esta acción se ejecutará inmediatamente.",
  save: "Los cambios se guardarán permanentemente.",
  submit: "La información será enviada.",
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  warningMessage,
  loading = false,
  actionType = "confirm",
  customAction,
  cancelLabel = "Cerrar",
  showCancel = true,
}) => {
  // Usar configuración personalizada si se proporciona, sino usar la por defecto
  const actionConfig = customAction || defaultActions[actionType];
  const modalTitle = title || defaultTitles[actionType];
  const modalDescription = description || defaultDescriptions[actionType];

  // Clases base para los botones
  const baseButtonClasses =
    "px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const cancelButtonClasses = `${baseButtonClasses} text-gray-600 border border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800`;

  return (
    <SimpleModal onClose={onClose} open={open} title={modalTitle}>
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-200">{modalDescription}</p>

        {warningMessage && (
          <div
            className={`border rounded p-3 ${
              actionConfig.variant === "danger"
                ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                : actionConfig.variant === "warning"
                  ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                  : "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
            }`}
          >
            <p
              className={`text-sm ${
                actionConfig.variant === "danger"
                  ? "text-red-800 dark:text-red-200"
                  : actionConfig.variant === "warning"
                    ? "text-yellow-800 dark:text-yellow-200"
                    : "text-blue-800 dark:text-blue-200"
              }`}
            >
              {warningMessage}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          {showCancel && (
            <button
              onClick={onClose}
              disabled={loading}
              className={cancelButtonClasses}
            >
              {cancelLabel}
            </button>
          )}

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`${baseButtonClasses} ${actionConfig.className} text-white`}
          >
            {loading
              ? actionConfig.loadingLabel || `${actionConfig.label}...`
              : actionConfig.label}
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default ConfirmationDialog;
