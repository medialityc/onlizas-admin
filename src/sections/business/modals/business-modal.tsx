"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Business } from "@/types/business";
import { businessSchema, CreateSchemaBusiness } from "./business-schema";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import LoaderButton from "@/components/loaders/loader-button";
import SimpleModal from "@/components/modal/modal";
import { RHFMultiImageUpload } from "@/components/react-hook-form/rhf-multi-images-upload";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllBusiness, updateBusinessData } from "@/services/business";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { isValidUrl, urlToFile } from "@/utils/format";
import { RHFSelectWithLabel } from "@/components/react-hook-form";

interface BusinessModalProps {
  open: boolean;
  onClose: () => void;
  business?: Business;
  isDetailsView?: boolean;
  loading: boolean;
  onSuccess?: () => void;
}

export default function BusinessModal({
  open,
  onClose,
  business,
  isDetailsView = false,
  loading,
  onSuccess,
}: BusinessModalProps) {
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
      /*       users: business?.users || [],
       */ /*  childBusinessIds: business?.childBusinessIds || [], */
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
          console.warn("Failed to load ?.photoObjectCodes:", error);
          setValue("photoObjectCodes", business.photoObjectCodes);
        } finally {
          setLoadingImage(false);
          console.log(business.photoObjectCodes);
        }
      }
    };

    loadImagesAsFiles();
  }, [business?.photoObjectCodes, open, setValue]);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: CreateSchemaBusiness) => {
    setError(null);
    console.log(data.parentId);
    console.log(data.locationId);
    try {
      let response;
      const formData = new FormData();

      // Mapear exactamente los nombres de campos que espera el backend
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

      // Campos adicionales que puede esperar el backend
      formData.append(
        "parentId",
        data.parentId ? data.parentId.toString() : ""
      );

      // Manejo de photoObjectCodes
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
        response = await updateBusinessData(business.id, formData);

        if (!response.error) {
          queryClient.invalidateQueries({ queryKey: ["businesses"] });
          onSuccess?.();
          reset();
          toast.success("Negocio editado exitosamente");

          handleClose();
        } else {
          if (response.status === 409) {
            toast.error("Ya existe un negocio con ese código");
          } else {
            toast.error(response.message || "No se pudo procesar este negocio");
          }
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
  console.log(methods.formState.errors);

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Primera fila: Código y Nombre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInputWithLabel
                name="code"
                label="Código"
                placeholder="Ej: NEG-001"
                required
                disabled={isDetailsView}
              />
              <RHFInputWithLabel
                name="name"
                label="Nombre"
                placeholder="Nombre del negocio"
                required
                disabled={isDetailsView}
              />
            </div>

            {/* Segunda fila: ID Ubicación y HBL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFSelectWithLabel
                name="locationId"
                options={locationOptions}
                label="ID de Ubicación"
                placeholder="Ej: 12"
                required
                disabled={isDetailsView}
                size="small"
              />
              <RHFInputWithLabel
                name="initialHbl"
                label="HBL Inicial"
                placeholder="Ej: HBL-0001"
                required
                disabled={isDetailsView}
              />
            </div>

            {/* Negocio Padre */}
            <RHFAutocompleteFetcherInfinity
              name="parentId"
              label="Negocio Padre"
              placeholder="Selecciona un negocio padre"
              onFetch={getAllBusiness}
            />

            {/* Dirección y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInputWithLabel
                name="address"
                label="Dirección"
                placeholder="Dirección física"
                disabled={isDetailsView}
              />
              <RHFInputWithLabel
                name="email"
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                disabled={isDetailsView}
              />
            </div>

            {/* Teléfono y Tarifa fija */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <RHFInputWithLabel
                name="phone"
                type="tel"
                label="Teléfono"
                placeholder="+53 555 555 555"
                disabled={isDetailsView}
              />
              <RHFInputWithLabel
                name="fixedRate"
                label="Tarifa fija"
                type="number"
                placeholder="0.00"
                disabled={isDetailsView}
              />
            </div>

            {/* Checkbox debajo */}
            <div>
              <RHFCheckbox
                name="isPrimary"
                label="Es negocio primario"
                disabled={isDetailsView}
              />
            </div>

            {/* Descripción sola */}
            <RHFInputWithLabel
              name="description"
              label="Descripción"
              placeholder="Describe el negocio"
              type="textarea"
              rows={3}
              disabled={isDetailsView}
            />

            {/* Factura sola */}
            <RHFInputWithLabel
              name="invoiceText"
              label="Texto de Factura"
              type="textarea"
              placeholder="Texto que aparecerá en las facturas"
              rows={4}
              disabled={isDetailsView}
            />

            {/* Imágenes */}
            <RHFMultiImageUpload
              name="photoObjectCodes"
              label="Fotos"
              disabled={isDetailsView}
            />

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
          </form>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
