import {
  Calendar,
  Users,
  Smartphone,
  Monitor,
  ChevronLeft,
} from "lucide-react";
import ImagePreview from "@/components/image/image-preview";

import {
  TARGET_USER_DEVICE_OPTIONS,
  TARGET_USER_SEGMENT_OPTIONS,
  TEMPLATE_TYPE_ENUM_OPTIONS,
} from "../constants/section.options";
import { formatDate } from "@/utils/format";
import { SectionFormData } from "../schema/section-schema";
import StatusBadge from "@/components/badge/status-badge";
import { Button } from "@/components/button/button";
import Link from "next/link";

type Props = {
  section: SectionFormData;
};
const SectionDetailsView = ({ section }: Props) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              className="flex items-center gap-2"
              href={"/dashboard/content/sections"}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver a secciones</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {section?.name}
                  </h1>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="inline-flex items-center gap-2">
                    Activo:
                    <StatusBadge
                      active={section?.active}
                      activeText="Activa"
                      inactiveText="Inactiva"
                    />
                  </span>

                  <span className="inline-flex items-center gap-2">
                    Personalizada:
                    <StatusBadge
                      active={section?.isPersonalized}
                      activeText="Activa"
                      inactiveText="Inactiva"
                    />
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Link
                    href={`/dashboard/content/sections/${section?.id}/edit`}
                  >
                    Editar
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuración Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Básica */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información Básica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Ver más
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de plantilla
                  </label>
                  <p className="text-gray-900">
                    {
                      TEMPLATE_TYPE_ENUM_OPTIONS?.find(
                        (option: any) => option?.value === section?.templateType
                      )?.label
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Orden de visualización
                  </label>
                </div>
              </div>
            </div>

            {/* Configuración de Diseño */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Configuración de Diseño
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de fondo
                  </label>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-md border-2 border-gray-200"
                      style={{ backgroundColor: section?.backgroundColor }}
                    ></div>
                    <span className="text-sm font-mono text-gray-600">
                      {section?.backgroundColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color de texto
                  </label>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-md border-2 border-gray-200"
                      style={{ backgroundColor: section?.textColor }}
                    ></div>
                    <span className="text-sm font-mono text-gray-600">
                      {section?.textColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Elementos por defecto
                  </label>
                  <p className="text-gray-900">
                    {section?.defaultItemCount} productos
                  </p>
                </div>
              </div>
            </div>

            {/* Productos de la Sección */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Productos ({section?.products?.length})
                </h2>
              </div>

              <div className="space-y-4">
                {section?.products?.map((productItem: any) => (
                  <div
                    key={productItem?.productGlobalId}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <ImagePreview
                      images={productItem?.product?.imagesUrl || []}
                      alt={productItem?.product?.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {productItem?.product?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {productItem?.product?.storeName}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-lg font-semibold text-green-600">
                          ${productItem?.product?.price}
                        </span>
                        <span className="text-xs text-gray-500">
                          Orden: {productItem?.displayOrder}
                        </span>
                        {productItem?.isFeatured && (
                          <span className="inline-flex items-center px-2 py-0?.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Destacado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Configuración de Segmentación */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Segmentación
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Segmento de usuarios
                  </label>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {TARGET_USER_SEGMENT_OPTIONS.find(
                        (option: any) =>
                          option.value === section?.targetUserSegment
                      )?.label || "Sin segmento"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de dispositivo
                  </label>
                  <div className="flex items-center gap-2">
                    {section?.targetDeviceType === "ALL" ? (
                      <Monitor className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-gray-900">
                      {TARGET_USER_DEVICE_OPTIONS.find(
                        (option: any) =>
                          option.value === section?.targetDeviceType
                      )?.label || "Sin dispositivo"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Programación */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Programación
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de inicio
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {formatDate(section?.startDate)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de expiración
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      {formatDate(section?.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionDetailsView;
