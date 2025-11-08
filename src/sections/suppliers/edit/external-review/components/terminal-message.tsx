import { ExternalReviewApprovalProcessResponse } from "@/services/external-review";
import { ExternalReviewEntityDetails } from "../ExternalReviewClient";

export default function TerminalMessage({
  status,
  entity,
}: {
  status: ExternalReviewApprovalProcessResponse["tokenStatus"];
  entity: ExternalReviewEntityDetails;
}) {
  const text = (() => {
    switch (status) {
      case "EXPIRED":
        return "Este enlace ha expirado.";
      case "REVOKED":
        return "Este enlace ha sido revocado.";
      case "USED":
        return entity.isApproved
          ? "El enlace ya se utilizó para aprobar."
          : "El enlace ya se utilizó.";
      case "NOT_FOUND":
        return "El enlace no es válido.";
      default:
        return "Estado no disponible.";
    }
  })();
  return (
    <div className="p-4 border rounded bg-gray-50 text-sm">
      <p>{text}</p>
    </div>
  );
}
