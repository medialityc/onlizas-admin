"use client";

import { Modal, Stack, Badge, Group } from "@mantine/core";
import { IHomeBanner } from "@/types/home-banner";
import ImagePreview from "@/components/image/image-preview";

interface Props {
  open: boolean;
  onClose: () => void;
  banner: IHomeBanner | null;
}

export default function BannerDetailsModal({ open, onClose, banner }: Props) {
  if (!banner) return null;

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Detalles del Banner"
      size="lg"
      centered
      styles={{
        content: {
          backgroundColor: 'light-dark(#ffffff, #0e1726)',
        },
        header: {
          backgroundColor: 'light-dark(#ffffff, #0e1726)',
          borderBottom: '1px solid light-dark(#e5e7eb, #1b2e4b)',
        },
        title: {
          color: 'light-dark(#000000, #ffffff)',
          fontWeight: 600,
        },
        close: {
          color: 'light-dark(#374151, #e5e7eb)',
        },
        body: {
          backgroundColor: 'light-dark(#ffffff, #0e1726)',
        },
      }}
    >
      <Stack gap="md">
        {/* Imágenes */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Banner Escritorio
          </p>
          <ImagePreview
            alt="Banner Escritorio"
            images={[banner.desktopImageThumbnail || banner.imageDesktopUrl]}
            previewEnabled
            className="w-full h-32 object-contain [&>img]:object-contain rounded border border-gray-200 dark:border-gray-700"
          />
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Banner Móvil
          </p>
          <ImagePreview
            alt="Banner Móvil"
            images={[banner.mobileImageThumbnail || banner.imageMobileUrl]}
            previewEnabled
            className="w-full h-32 object-contain [&>img]:object-contain rounded border border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* URL */}
        {banner.link && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              URL del Banner
            </p>
            <a
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {banner.link}
            </a>
          </div>
        )}

        {/* Regiones */}
        {banner.regionNames && banner.regionNames.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Regiones ({banner.regionNames.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {banner.regionNames.map((region, index) => (
                <Badge
                  key={index}
                  variant="light"
                  color="blue"
                  size="md"
                >
                  {region}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Estado */}
        <Group grow>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Estado
            </p>
            <Badge
              color={banner.active ? "green" : "red"}
              variant="filled"
              size="md"
            >
              {banner.active ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          {banner.createdDate && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Fecha de Creación
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {new Date(banner.createdDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
