import { CurrenciesDetailsModal } from "./currencies-details-modal"; // TODO: Crear este componente
import { Currency } from "@/services/currencies";
import CurrenciesModal from "./currencies-modal";

interface CurrenciesModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currency?: Currency; // Optional if used for editing
  isDetailsView?: boolean;
}

export default function CurrenciesModalContainer({
  open,
  onClose,
  currency,
  isDetailsView,
  onSuccess,
}: CurrenciesModalProps) {
  if (!open) return null;

  if (isDetailsView) {
    if (currency)
      return (
        <CurrenciesDetailsModal
          loading={false}
          onClose={onClose}
          open={open}
          currency={currency}
        />
      );
    return (
      <div className="text-center p-4">
        <p>Modal de detalles de moneda - Por implementar</p>
        <button onClick={onClose} className="btn btn-secondary mt-2">
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <CurrenciesModal
      loading={false}
      onClose={onClose}
      open={open}
      currency={currency}
      onSuccess={onSuccess}
    />
  );
}
