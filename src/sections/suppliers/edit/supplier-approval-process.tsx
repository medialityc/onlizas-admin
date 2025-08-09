import { type ApprovalProcess } from "@/types/suppliers";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function SupplierApprovalProcess({
  approvalProcess,
}: {
  approvalProcess: ApprovalProcess;
}) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "aprobado":
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case "rejected":
      case "rechazado":
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "aprobado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
      case "rechazado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header del Estado */}
      <div className="flex items-center space-x-3">
        {getStatusIcon(approvalProcess.status)}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Estado del Proceso
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(approvalProcess.status)}`}
          >
            {approvalProcess.status}
          </span>
        </div>
      </div>

      {/* Información del Proceso */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Fecha de Creación
            </dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {formatDate(approvalProcess.createdDate)}
            </dd>
          </div>

          {approvalProcess.approvedDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fecha de Aprobación
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(approvalProcess.approvedDate)}
              </dd>
            </div>
          )}

          {approvalProcess.rejectedDate && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fecha de Rechazo
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {formatDate(approvalProcess.rejectedDate)}
              </dd>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {approvalProcess.approvedBy && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Aprobado por
              </dt>
              <dd className="mt-1 flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {approvalProcess.approvedBy}
                </span>
              </dd>
            </div>
          )}

          {approvalProcess.rejectedBy && (
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Rechazado por
              </dt>
              <dd className="mt-1 flex items-center space-x-2">
                <UserIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900 dark:text-white">
                  {approvalProcess.rejectedBy}
                </span>
              </dd>
            </div>
          )}
        </div>
      </div>

      {/* Comentarios */}
      {approvalProcess.comments && (
        <div>
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Comentarios
          </dt>
          <dd className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
              {approvalProcess.comments}
            </p>
          </dd>
        </div>
      )}

      {/* Timeline Visual */}
      <div className="flow-root">
        <ul className="-mb-8">
          <li>
            <div className="relative pb-8">
              <span
                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                aria-hidden="true"
              />
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                    <CheckCircleIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Proceso creado
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                    {formatDate(approvalProcess.createdDate)}
                  </div>
                </div>
              </div>
            </div>
          </li>

          {(approvalProcess.approvedDate || approvalProcess.rejectedDate) && (
            <li>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900 ${
                        approvalProcess.approvedDate
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {approvalProcess.approvedDate ? (
                        <CheckCircleIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <XCircleIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {approvalProcess.approvedDate
                          ? "Proceso aprobado"
                          : "Proceso rechazado"}
                      </p>
                      {(approvalProcess.approvedBy ||
                        approvalProcess.rejectedBy) && (
                        <p className="text-sm text-gray-400">
                          por{" "}
                          {approvalProcess.approvedBy ||
                            approvalProcess.rejectedBy}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {formatDate(
                        approvalProcess.approvedDate ||
                          approvalProcess.rejectedDate ||
                          ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
