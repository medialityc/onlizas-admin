import {
  type SupplierEvaluation,
  type GetSupplierEvaluations,
} from "@/types/suppliers";
import {
  StarIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

type SupplierEvaluationsContentProps = {
  evaluationsData: GetSupplierEvaluations;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function SupplierEvaluationsContent({
  evaluationsData,
  currentPage,
  onPageChange,
}: SupplierEvaluationsContentProps) {
  const evaluations = evaluationsData.data;
  const totalPages = Math.ceil(
    evaluationsData.totalCount / evaluationsData.pageSize
  );
  const totalCount = evaluationsData.totalCount;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index}>
        {index < rating ? (
          <StarIconSolid className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarIcon className="h-5 w-5 text-gray-300 dark:text-gray-600" />
        )}
      </span>
    ));
  };

  const getOverallAverage = () => {
    if (evaluations.length === 0) return 0;
    const sum = evaluations.reduce(
      (acc, evaluation) => acc + evaluation.rating,
      0
    );
    return (sum / evaluations.length).toFixed(1);
  };

  const getCriteriaAverage = (
    criterion: keyof SupplierEvaluation["criteria"]
  ) => {
    if (evaluations.length === 0) return 0;
    const sum = evaluations.reduce(
      (acc, evaluation) => acc + evaluation.criteria[criterion],
      0
    );
    return (sum / evaluations.length).toFixed(1);
  };

  if (evaluations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Sin evaluaciones
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Este proveedor aún no tiene evaluaciones registradas. Las evaluaciones
          aparecerán aquí una vez que sean creadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Resumen de Evaluaciones */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-8 border border-emerald-200/50 dark:border-emerald-700/50">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
            <StarIconSolid className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Resumen de Evaluaciones
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center bg-white/60 dark:bg-black/20 rounded-xl p-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {getOverallAverage()}
            </div>
            <div className="flex justify-center space-x-1 mt-2">
              {renderStars(Math.round(Number(getOverallAverage())))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
              Promedio General
            </div>
          </div>

          {[
            { key: "quality" as const, label: "Calidad" },
            { key: "delivery" as const, label: "Entrega" },
            { key: "price" as const, label: "Precio" },
            { key: "service" as const, label: "Servicio" },
          ].map(({ key, label }) => (
            <div
              key={key}
              className="text-center bg-white/60 dark:bg-black/20 rounded-xl p-4"
            >
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {getCriteriaAverage(key)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Evaluaciones */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Historial de Evaluaciones
          </h3>
          <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total: {totalCount} evaluaciones
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {evaluations.map((evaluation, index) => (
            <div
              key={evaluation.id}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-1">
                    {renderStars(evaluation.rating)}
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {evaluation.rating}/5
                  </span>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">
                      {formatDate(evaluation.evaluationDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <UserIcon className="h-4 w-4" />
                    <span className="font-medium">
                      {evaluation.evaluatedBy}
                    </span>
                  </div>
                </div>
              </div>

              {/* Criterios Detallados */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { key: "quality" as const, label: "Calidad" },
                  { key: "delivery" as const, label: "Entrega" },
                  { key: "price" as const, label: "Precio" },
                  { key: "service" as const, label: "Servicio" },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className="text-center bg-gray-50/80 dark:bg-gray-800/80 rounded-xl p-3"
                  >
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {evaluation.criteria[key]}/5
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comentarios */}
              {evaluation.comments && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                  <h4 className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-2">
                    Comentarios:
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">
                    {evaluation.comments}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Paginación Mejorada */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {currentPage}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                de <span className="font-bold">{totalPages}</span> páginas
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-xl shadow-sm">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 rounded-l-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Anterior
                </button>
                <button
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 rounded-r-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-l-0"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
