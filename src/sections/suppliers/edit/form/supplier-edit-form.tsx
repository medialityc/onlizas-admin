"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Paper } from "@mantine/core";

import { SupplierDetails } from "@/types/suppliers";
import {
  updateExpirationDate, 
  addImporterContracts, 
  removeImporterContracts,
  addRequestedCategories,
  removeRequestedCategories,
  getImporterContracts,
  updateSupplierBasicInfo,
} from "@/services/supplier";
import { toast } from "react-toastify";
import SupplierBasicInfo from "./supplier-basic-info";
import SupplierImporters from "./supplier-importers";
import SupplierPendingDocuments from "./documents/supplier-pending-documents";
import SupplierApprovedDocuments from "./documents/supplier-approved-documents";
import SupplierEditActions from "./supplier-edit-actions";
import SupplierCategories from "./supplier-categories";
import {
  UpdateSupplierFormData,
  updateSupplierSchemaWithRules,
} from "./schema";
import {
  SUPPLIER_NATIONALITY,
  SUPPLIER_TYPE,
  SUPPLIER_TYPE_SELLER,
} from "../../constants/supplier.options";

export default function SupplierEditForm({
  supplierDetails,
}: {
  supplierDetails: SupplierDetails;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [contractMap, setContractMap] = useState<Record<string, string>>({}); // Map de importerId -> contractId
  const [initialImporterIds, setInitialImporterIds] = useState<string[]>([]); // IDs iniciales de importadoras
  const router = useRouter();

  const initValue = useMemo(() => {
    // Validar y sanitizar la fecha de expiración
    let validExpirationDate = new Date();
    if (supplierDetails.expirationDate) {
      const parsedDate = new Date(supplierDetails.expirationDate);
      // Verificar que la fecha sea válida
      if (!isNaN(parsedDate.getTime())) {
        validExpirationDate = parsedDate;
      }
    }

    return {
      name: supplierDetails.name,
      email: supplierDetails.email,
      phone: supplierDetails.phone,
      countryCode: supplierDetails.countryCode ?? "",
      address: supplierDetails.address,
      message: supplierDetails.message || "",
      active: supplierDetails.active,
      sellerType: supplierDetails.sellerType
        ? Number(SUPPLIER_TYPE_SELLER[supplierDetails.sellerType])
        : 0,
      nacionalityType: supplierDetails.nacionality
        ? Number(SUPPLIER_NATIONALITY[supplierDetails.nacionality])
        : 0,
      mincexCode: supplierDetails.mincexCode ?? "",
      supplierType: supplierDetails.type
        ? Number(SUPPLIER_TYPE[supplierDetails.type])
        : 0,
      expirationDate: validExpirationDate,
      importersIds: (supplierDetails as any).importersIds || [],
      pendingCategories:
        supplierDetails.pendingCategories?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          departmentName: cat.departmentName ?? "",
        })) || [],
      approvedCategories:
        supplierDetails.approvedCategories?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          departmentName: cat.departmentName ?? "",
        })) || [],
    };
  }, [supplierDetails]);
  const methods = useForm<UpdateSupplierFormData>({
    resolver: zodResolver(updateSupplierSchemaWithRules) as any,
    defaultValues: initValue,
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const { handleSubmit, reset, setValue, trigger, getValues } = methods;

  // Cargar importadoras existentes
  useEffect(() => {
    const loadImporterContracts = async () => {
      try {
        const response = await getImporterContracts(supplierDetails.id);
        if (!response.error && response.data) {
          // El endpoint retorna { data: [...], page, pageSize, totalCount, hasNext, hasPrevious }
          const contracts = Array.isArray(response.data) ? response.data : response.data?.data || [];
          const importerIds = contracts.map((contract: any) => contract.importerId).filter(Boolean);
          
          // Crear mapeo de importerId -> contractId
          const map: Record<string, string> = {};
          contracts.forEach((contract: any) => {
            if (contract.importerId && contract.id) {
              map[contract.importerId] = contract.id;
            }
          });
          setContractMap(map);
          
          // Guardar los IDs iniciales para comparar luego
          setInitialImporterIds(importerIds);
          
          if (importerIds.length > 0) {
            setValue("importersIds", importerIds);
          }
        }
      } catch (error) {
        // Error loading importer contracts - silently continue
      }
    };

    loadImporterContracts();
  }, [supplierDetails.id, setValue]);

  const onSubmit = async (data: UpdateSupplierFormData) => {
    setIsLoading(true);
    try {
      const approvalProcessId = supplierDetails.id;
      const previousImporters = initialImporterIds;
      const newImporters = data.importersIds || [];
      const previousCategories = supplierDetails.pendingCategories?.map(c => c.id) || [];
      const newCategories = data.pendingCategories?.map(c => c.id) || [];

      // 1. Actualizar información básica si está en modo edición
      if (isEditingBasicInfo) {
        const basicInfoData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          phoneCountryCode: data.phoneCountryCode,
          address: data.address,
          supplierType: data.supplierType,
          sellerType: data.sellerType,
          nacionalityType: data.nacionalityType,
          mincexCode: data.mincexCode || "",
          countryId: data.countryId,
        };

        const basicInfoResponse = await updateSupplierBasicInfo(approvalProcessId, basicInfoData);
        if (basicInfoResponse.error) {
          toast.error(basicInfoResponse.message || "Error al actualizar la información básica");
          return;
        } else {
          toast.success("Información básica actualizada correctamente");
          setIsEditingBasicInfo(false); // Salir del modo edición
          // Redireccionar después del guardado exitoso de información básica
          router.push("/dashboard/suppliers");
          return;
        }
      }

      // 2. Actualizar fecha de expiración
      const expirationDateResponse = await updateExpirationDate(
        approvalProcessId,
        data?.expirationDate?.toISOString() || new Date().toISOString()
      );
      if (expirationDateResponse.error) {
        toast.error("Error al actualizar la fecha de expiración");
      }

      // 3. Manejar cambios en importadoras
      const addedImporters = newImporters.filter(
        (id: string) => !previousImporters.includes(id)
      );
      const removedImporters = previousImporters.filter(
        (id: string) => !newImporters.includes(id)
      );

      if (addedImporters.length > 0) {
        const addResponse = await addImporterContracts(approvalProcessId, addedImporters);
        if (addResponse.error) {
          toast.warning("Hubo un problema al agregar los contratos de importadores");
        }
      }

      if (removedImporters.length > 0) {
        // Mapear importerIds a contractIds
        const contractIdsToRemove = removedImporters
          .map((importerId: string) => contractMap[importerId])
          .filter(Boolean);

        if (contractIdsToRemove.length > 0) {
          const removeResponse = await removeImporterContracts(approvalProcessId, contractIdsToRemove);
          if (removeResponse.error) {
            toast.warning("Hubo un problema al remover los contratos de importadores");
          }
        }
      }

      // 4. Manejar cambios en categorías solicitadas
      const addedCategories = newCategories.filter(
        (id: string) => !previousCategories.includes(id)
      );
      const removedCategories = previousCategories.filter(
        (id: string) => !newCategories.includes(id)
      );

      if (addedCategories.length > 0) {
        const addCatResponse = await addRequestedCategories(approvalProcessId, addedCategories);
        if (addCatResponse.error) {
          toast.warning("Hubo un problema al agregar las categorías");
        }
      }

      if (removedCategories.length > 0) {
        const removeCatResponse = await removeRequestedCategories(approvalProcessId, removedCategories);
        if (removeCatResponse.error) {
          toast.warning("Hubo un problema al remover las categorías");
        }
      }

      // Actualizar el estado de los IDs iniciales de importadoras para la próxima edición
      setInitialImporterIds(newImporters);

      // Solo mostrar mensaje general y redireccionar si no es solo información básica
      if (!isEditingBasicInfo) {
        toast.success("Proveedor actualizado correctamente");
        router.push("/dashboard/suppliers");
      }
    } catch (error) {
      toast.error("Error al actualizar proveedor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
  };

  const onError = (errors: any) => {
    // Form validation errors
  };

  return (
    <>
      <FormProvider {...methods}>
        <form noValidate onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* Sección de Información Básica */}
          <Paper p="md" radius="md" withBorder styles={{
            root: {
              backgroundColor: "light-dark(#ffffff, #1b2e4b)",
              borderColor: "light-dark(#e5e7eb, #253a54)",
            },
          }}>
            <SupplierBasicInfo 
              approvalProcessId={supplierDetails.id}
              isEditMode={isEditingBasicInfo}
              onToggleEditMode={() => setIsEditingBasicInfo(!isEditingBasicInfo)}
            />
          </Paper>

          {Number(methods.watch("nacionalityType")) !== SUPPLIER_NATIONALITY.Nacional && (
            <SupplierImporters initialImporterIds={(supplierDetails as any).importersIds} />
          )}

          <SupplierCategories state={supplierDetails.state} />

          {/* Botones de Acciones */}
          <SupplierEditActions isLoading={isLoading} onCancel={handleCancel} />
        </form>
      </FormProvider>

      {/* Gestión de Documentos */}
      <div className="space-y-6 mt-6">
        <SupplierPendingDocuments
          approvalProcessId={supplierDetails.id}
          initialDocuments={(supplierDetails.pendingDocuments as any) || []}
        />
        {supplierDetails.state !== "Pending" && (
          <SupplierApprovedDocuments
            initialDocuments={(supplierDetails.approvedDocuments as any) || []}
          />
        )}
      </div>
    </>
  );
}
