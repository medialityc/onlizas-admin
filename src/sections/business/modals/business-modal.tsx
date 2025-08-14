"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Business, CreateBusiness } from "@/types/business";
import { businessSchema, CreateSchemaBusiness } from "./business-schema";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import { RHFFileUpload } from "@/components/react-hook-form/rhf-file-upload";
import LoaderButton from "@/components/loaders/loader-button";
import showToast from "@/config/toast/toastConfig";
import SimpleModal from "@/components/modal/modal";
import { RHFMultiImageUpload } from "@/components/react-hook-form/rhf-multi-images-upload";
import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { createBusiness, getAllBusiness, updateBusinessData } from "@/services/business";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

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
      parentBusiness: business?.parentBusiness
        ? {
            id: business?.parentBusiness.id ?? 0,
            name: business?.parentBusiness.name ?? "",
          }
        : undefined,
      description: business?.description || "",
      locationId: business?.locationId || "",
      initialHbl: business?.initialHbl || "",
      address: business?.address || "",
      email: business?.email || "",
      phone: business?.phone || "",
      isPrimary: business?.isPrimary || false,
      fixedRate: business?.fixedRate || 0,
      invoiceText: business?.invoiceText || "",
      users: business?.users || [],
      childBusinessIds: business?.childBusinessIds || [],
      photos: business?.photos,
      
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
      if (business?.photos && open) {
        try {
          setLoadingImage(true);         
        } catch (error) {
          console.warn("Failed to load photos:", error);
          setValue("photos", business.photos);
        } finally {
          setLoadingImage(false);
        }
      }
    };

    loadImagesAsFiles();
  }, [business?.photos, open, setValue]);

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  const onSubmit = async (data: CreateSchemaBusiness) => {
    setError(null);
    try {
      let response;
      const formData = new FormData();
      
      // Mapear exactamente los nombres de campos que espera el backend
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("description", data.description || "");
      formData.append("hblInitial", data.initialHbl);
      formData.append("address", data.address || "");
      formData.append("email", data.email || "");
      formData.append("phone", data.phone || "");
      formData.append("isPrimary", data.isPrimary ? "true" : "false");
      formData.append("fixedRate", data.fixedRate?.toString() || "0");
      formData.append("invoiceText", data.invoiceText || "");
      formData.append("locationId", data.locationId);
      
      // Campos adicionales que puede esperar el backend
      formData.append("parentId", data.parentBusiness ? data.parentBusiness.id.toString() : "0");
      
      // Manejo de photoObjectCodes
      if (data.photos && data.photos.length > 0) {
        data.photos.forEach((photo, index) => {
          formData.append(`photoObjectCodes[${index}]`, photo);
        });
      }
      
     

      if (business) {
        response = await updateBusinessData(business.id, formData);
      } else {
        response = await createBusiness(formData);
      }

      if (!response.error) {
        queryClient.invalidateQueries({ queryKey: ["businesses"] });
        onSuccess?.();
        reset();
        toast.success(
          business
            ? "Negocio editado exitosamente"
            : "Negocio creado exitosamente"
        );
        handleClose();
      } else {
        if (response.status === 409) {
          toast.error("Ya existe un negocio con ese código");
        } else {
          toast.error(response.message || "No se pudo procesar este negocio");
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <RHFInputWithLabel
              name="code"
              label="Code"
              required
              disabled={isDetailsView}
            />
            <RHFInputWithLabel
              name="name"
              label="Name"
              required
              disabled={isDetailsView}
            />
            <RHFInputWithLabel
              name="description"
              label="Description"
              disabled={isDetailsView}
            />
            <RHFInputWithLabel
              name="locationId"
              label="Location ID"
              disabled={isDetailsView}
            />
            <RHFInputWithLabel
              name="initialHbl"
              label="Initial HBL"
              disabled={isDetailsView}
            />

            <RHFAutocompleteFetcherInfinity
              name="parent"
              label="Negocio Padre"
              onFetch={getAllBusiness}
            />

            <RHFInputWithLabel
              name="address"
              label="Address"
              disabled={isDetailsView}
            />
            <RHFInputWithLabel
              name="email"
              label="Email"
              type="email"
              disabled={isDetailsView}
            />
            <RHFInputWithLabel
              name="phone"
              label="Phone"
              disabled={isDetailsView}
            />
            <RHFCheckbox
              name="isPrimary"
              label="Is Primary"
              disabled={isDetailsView}
            />
            <RHFInputWithLabel
              name="fixedRate"
              label="Fixed Rate"
              type="number"
              disabled={isDetailsView}
            />
            <RHFInputWithLabel
              name="invoiceText"
              label="Invoice Text"
              disabled={isDetailsView}
            />
            <RHFMultiImageUpload
              name="photos"
              label="Photos"
              disabled={isDetailsView}
            />

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <LoaderButton
                type="submit"
                loading={isSubmitting}
                className="btn btn-primary text-textColor"
                disabled={isSubmitting}
              >
                {business ? "Edit" : "Create"} Business
              </LoaderButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </SimpleModal>
  );
}
