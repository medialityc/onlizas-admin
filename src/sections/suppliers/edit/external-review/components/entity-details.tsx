import {
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
  FlagIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon as CheckIcon,
  XCircleIcon as XIcon,
} from "@heroicons/react/24/outline";
import { ExternalReviewEntityDetails } from "../ExternalReviewClient";
import DetailsCard from "./details-card";
import InfoRow from "./info-row";
import { processesState } from "@/types/suppliers";

export default function EntityDetails({
  details,
}: {
  details: ExternalReviewEntityDetails;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-lg tracking-tight">
          Datos del Proveedor
        </h2>
        {details.isApproved ? (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            <CheckIcon className="w-4 h-4" />
            Aprobado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
            <XIcon className="w-4 h-4" />
            Pendiente
          </span>
        )}
      </div>

      {/* Identificación */}
      <DetailsCard
        title="Identificación"
        icon={<UserIcon className="w-4 h-4" />}
      >
        <InfoRow label="Nombre" value={details.name} />
        <InfoRow
          label="Email"
          value={details.email}
          icon={<EnvelopeIcon className="w-3.5 h-3.5" />}
        />
        <InfoRow label="Tipo" value={details.type} />
        <InfoRow label="Seller Type" value={details.sellerType} />
        <InfoRow
          label="Nacionalidad"
          value={details.nacionality}
          icon={<FlagIcon className="w-3.5 h-3.5" />}
        />
      </DetailsCard>

      {/* Estado */}
      <DetailsCard
        title="Estado"
        icon={<ClipboardDocumentListIcon className="w-4 h-4" />}
      >
        <InfoRow
          label="Estado actual"
          value={
            processesState.find((state) => state.value === details.state)?.name
          }
        />
        <InfoRow label="Aprobado" value={details.isApproved ? "Sí" : "No"} />
        <InfoRow label="Aprobado en" value={details.approvedAt} />
        <InfoRow
          label="Expiración del proceso"
          value={details.expirationDate}
          icon={<CalendarIcon className="w-3.5 h-3.5" />}
        />
      </DetailsCard>

      {/* Métricas */}
      <DetailsCard title="Métricas" icon={<ChartBarIcon className="w-4 h-4" />}>
        <InfoRow label="Rating actual" value={details.currentRating} />
        <InfoRow label="Evaluaciones" value={details.evaluationCount} />
        <InfoRow
          label="Cat. aprobadas"
          value={details.approvedCategoriesCount}
        />
        <InfoRow
          label="Cat. solicitadas"
          value={details.requestedCategoriesCount}
        />
      </DetailsCard>
    </section>
  );
}
