"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Business } from "@/types/business";
import {
  businessSchema,
  CreateSchemaBusiness,
} from "@/sections/business/modals/business-schema";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import { RHFMultiImageUpload } from "@/components/react-hook-form/rhf-multi-images-upload";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import {
  getAllBusiness,
  updateBusinessData,
  createBusiness,
} from "@/services/business";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { isValidUrl, urlToFile } from "@/utils/format";
import { RHFSelectWithLabel } from "@/components/react-hook-form";

interface ProviderBusinessModalProps {
  open: boolean;
  onClose: () => void;
  business?: Business;
  userId?: number;
  loading: boolean;
  onSuccess?: (data?: Business) => void;
}

export default function ProviderBusinessModal({
  open,
  onClose,
  business,
  userId,
  loading,
  onSuccess,
}: ProviderBusinessModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const queryClient = useQueryClient();

  const methods = useForm<CreateSchemaBusiness>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: business?.name || "",
      code: business?.code || "",
      parentId: business?.parentBusiness?.id || 0,
      description: business?.description || "",
      locationId: business?.locationId || 0,
      hblInitial: business?.hblInitial || "",
      address: business?.address || "",
      email: business?.email || "",
      phone: business?.phone || "",
      isPrimary: business?.isPrimary || false,
      fixedRate: business?.fixedRate || 0,
      invoiceText: business?.invoiceText || "",
      photoObjectCodes: business?.photoObjectCodes,
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  useEffect(() => {
    const loadImagesAsFiles = async () => {
      if (business?.photoObjectCodes && open) {
        try {
          setLoadingImage(true);
        } catch (error) {
          console.warn("Failed to load photoObjectCodes:", error);
          setValue("photoObjectCodes", business.photoObjectCodes);
        } finally {
          setLoadingImage(false);
        }
      }
    };

    loadImagesAsFiles();
  }, [business?.photoObjectCodes, open, setValue]);

  // Reset form when business changes or modal opens/closes
  useEffect(() => {
    if (open) {
      reset({
        name: business?.name || "",
        code: business?.code || "",
        parentId: business?.parentBusiness?.id || 0,
        description: business?.description || "",
        locationId: business?.locationId || 0,
        hblInitial: business?.hblInitial || "",
        address: business?.address || "",
        email: business?.email || "",
        phone: business?.phone || "",
        isPrimary: business?.isPrimary || false,
        fixedRate: business?.fixedRate || 0,
        invoiceText: business?.invoiceText || "",
        photoObjectCodes: business?.photoObjectCodes,
      });
      setError(null);
    }
  }, [business, open, reset]);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: CreateSchemaBusiness) => {
    setError(null);

    // Validación específica para provider: si no hay userId, mostrar error
    if (!userId && !business) {
      setError("No se puede crear un negocio sin asociar a un usuario");
      toast.error("Error: Usuario no identificado");
      return;
    }

    try {
      let response;
      const formData = new FormData();

      // Mapear campos base
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("description", data.description || "");
      formData.append("hblInitial", data.hblInitial);
      formData.append("address", data.address || "");
      formData.append("email", data.email || "");
      formData.append("phone", data.phone || "");
      formData.append("isPrimary", data.isPrimary ? "true" : "false");
      formData.append("fixedRate", data.fixedRate?.toString() || "0");
      formData.append("invoiceText", data.invoiceText || "");
      formData.append("locationId", data.locationId.toString());
      formData.append(
        "parentId",
        data.parentId ? data.parentId.toString() : ""
      );

      // Manejo de imágenes
      if (data.photoObjectCodes && data.photoObjectCodes.length > 0) {
        await Promise.all(
          data.photoObjectCodes.map(async (photo, index) => {
            if (typeof photo === "string" && isValidUrl(photo)) {
              try {
                const imageFile = await urlToFile(photo);
                formData.append(`photoObjectCodes[${index}]`, imageFile);
              } catch {
                toast.error(`Error al procesar la imagen desde URL (${photo})`);
              }
            } else if (photo instanceof File) {
              formData.append(`photoObjectCodes[${index}]`, photo);
            }
          })
        );
      }

      if (business) {
        // Editando business existente
        response = await updateBusinessData(business.id, formData);

        if (!response.error) {
          // Invalidar queries relacionadas con business y user específico
          queryClient.invalidateQueries({ queryKey: ["businesses"] });
          if (userId) {
            queryClient.invalidateQueries({
              queryKey: ["user", "businesses", userId],
            });
            queryClient.invalidateQueries({
              queryKey: ["business", "user", userId],
            });
          }
          queryClient.invalidateQueries({
            queryKey: ["user", "profile", "me"],
          });

          onSuccess?.(response.data);
          toast.success("Negocio editado exitosamente");
          handleClose();
        } else {
          const errorMsg =
            response.status === 409
              ? "Ya existe un negocio con ese código"
              : response.message || "No se pudo procesar este negocio";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        // Creando nuevo business
        response = await createBusiness(formData);

        if (!response.error) {
          // Invalidar queries relacionadas específicamente para provider context
          queryClient.invalidateQueries({ queryKey: ["businesses"] });
          if (userId) {
            queryClient.invalidateQueries({
              queryKey: ["user", "businesses", userId],
            });
            queryClient.invalidateQueries({
              queryKey: ["business", "user", userId],
            });
          }
          queryClient.invalidateQueries({
            queryKey: ["user", "profile", "me"],
          });

          // Para nuevos business, response.data es ApiStatusResponse, no Business
          // Llamamos onSuccess sin data específica para forzar refetch
          onSuccess?.();
          toast.success("Negocio creado exitosamente");
          handleClose();
        } else {
          const errorMsg =
            response.status === 409
              ? "Ya existe un negocio con ese código"
              : response.message || "No se pudo crear este negocio";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar el negocio";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (!open) return null;

  const locationOptions = [
    { value: 1, label: "La Habana" },
    { value: 2, label: "Santiago de Cuba" },
    { value: 3, label: "Camagüey" },
    { value: 4, label: "Holguín" },
    { value: 5, label: "Santa Clara" },
    { value: 6, label: "Cienfuegos" },
    { value: 7, label: "Matanzas" },
    { value: 8, label: "Pinar del Río" },
    { value: 9, label: "Sancti Spíritus" },
    { value: 10, label: "Guantánamo" },
  ];

  return (
    <SimpleModal
      open={open}
      onClose={handleClose}
      loading={loading || loadingImage}
      title={business ? "Editar Negocio" : "Crear Negocio"}
    >
      <div className="p-5">
        {error && (
          <div className="mb-4">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        <FormProvider {...methods}>
          {/* Primera fila: Código y Nombre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInputWithLabel
              name="code"
              label="Código"
              placeholder="Ej: NEG-001"
              required
            />
            <RHFInputWithLabel
              name="name"
              label="Nombre"
              placeholder="Nombre del negocio"
              required
            />
          </div>

          {/* Segunda fila: ID Ubicación y HBL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSelectWithLabel
              name="locationId"
              options={locationOptions}
              label="ID de Ubicación"
              placeholder="Selecciona ubicación"
              required
              size="small"
            />
            <RHFInputWithLabel
              name="hblInitial"
              label="HBL Inicial"
              placeholder="Ej: HBL-0001"
              required
            />
          </div>

          {/* Negocio Padre */}
          <RHFAutocompleteFetcherInfinity
            name="parentId"
            label="Negocio Padre (opcional)"
            placeholder="Selecciona un negocio padre"
            onFetch={getAllBusiness}
          />

          {/* Dirección y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInputWithLabel
              name="address"
              label="Dirección"
              placeholder="Dirección física"
            />
            <RHFInputWithLabel
              name="email"
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
            />
          </div>

          {/* Teléfono y Tarifa fija */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <RHFInputWithLabel
              name="phone"
              type="tel"
              label="Teléfono"
              placeholder="+53 555 555 555"
            />
            <RHFInputWithLabel
              name="fixedRate"
              label="Tarifa fija"
              type="number"
              placeholder="0.00"
            />
          </div>

          {/* Checkbox */}
          <div>
            <RHFCheckbox name="isPrimary" label="Es negocio primario" />
          </div>

          {/* Descripción */}
          <RHFInputWithLabel
            name="description"
            label="Descripción"
            placeholder="Describe el negocio"
            type="textarea"
            rows={3}
          />

          {/* Texto de factura */}
          <RHFInputWithLabel
            name="invoiceText"
            label="Texto de Factura"
            type="textarea"
            placeholder="Texto que aparecerá en las facturas"
            rows={4}
          />

          {/* Imágenes */}
          <RHFMultiImageUpload name="photoObjectCodes" label="Fotos" />

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <LoaderButton
              type="submit"
              loading={isSubmitting}
              className="btn btn-primary text-textColor"
              disabled={isSubmitting}
            >
              {business ? "Guardar Cambios" : "Crear Negocio"}
            </LoaderButton>
          </div>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
