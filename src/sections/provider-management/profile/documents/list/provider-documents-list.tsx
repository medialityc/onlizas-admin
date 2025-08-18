"use client";

import { SessionExpiredAlert } from "@/auth-sso/components/session-expired-alert";
import { useFetchError } from "@/auth-sso/hooks/use-fetch-error";
import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { downloadUserDocument } from "@/services/users";
import { ApiResponse } from "@/types/fetch/api";
import { IDocument } from "@/types/users";
import { DataTableColumn } from "mantine-datatable";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useMemo, useState } from "react";
import { DocumentModal } from "../edit/document-modal";
import { Button } from "@/components/button/button";
import { PlusIcon } from "@heroicons/react/24/outline";

interface Props {
  userId: number;
  documentsPromise: Promise<ApiResponse<IDocument[]>>;
}

export function ProviderDocumentsList({ documentsPromise, userId }: Props) {
  const response = use(documentsPromise);
  useFetchError(response);
  const data = useMemo(() => response.data || [], [response.data]);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<
    IDocument | undefined
  >(undefined);

  /* const handleCreate = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("modal", "create");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]); */

  const handleEdit = useCallback(
    (document: IDocument) => {
      const params = new URLSearchParams(searchParams);
      params.set("modal", "edit");
      params.set("documentId", document.id.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );
  /*
  const handleDownload = useCallback(
    async (doc: IDocument) => {
      try {
        const response = await downloadUserDocument(userId, doc.id);
        if (response.error || !response.data) {
          showToast(
            "Error al descargar el documento. Intente nuevamente.",
            "error"
          );
        } else {
          // response.data is the download link
          console.log("D:", doc);

          const link = document.createElement("a");
          link.href = response.data;
          link.download = doc.name || "documento";
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          showToast("Comenzando descarga", "success");
        }
      } catch (error) {
        console.error(error);
        showToast(
          "Error al descargar el documento. Intente nuevamente.",
          "error"
        );
      }
    },
    [userId]
  );*/

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedDocument(undefined);
  }, []);
  const handleCreate = useCallback(() => {
    setModalOpen(true);
    setSelectedDocument(undefined);
  }, []);

  const handleModalSuccess = useCallback(() => {
    // Refresh the page to show updated data
    router.refresh();
  }, [router]);

  const handleDownload = useCallback(
    async (doc: IDocument) => {
      try {
        const response = await downloadUserDocument(userId, doc.id);
        if (response.error || !response.data) {
          showToast(
            "Error al descargar el documento. Intente nuevamente.",
            "error"
          );
        } else {
          const link = document.createElement("a");
          link.href = response.data;
          link.download = doc.name || "documento";
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          showToast("Comenzando descarga", "success");
        }
      } catch (error) {
        console.error(error);
        showToast(
          "Error al descargar el documento. Intente nuevamente.",
          "error"
        );
      }
    },
    [userId]
  );

  const columns = useMemo<DataTableColumn<IDocument>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (document) => (
          <div className="font-medium">{document.name}</div>
        ),
      },
      {
        accessor: "description",
        title: "Descripción",
        sortable: true,
        render: (document) => (
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px] block">
            {document.description || "Sin descripción"}
          </p>
        ),
      },
      {
        accessor: "objectCode",
        title: "Código de Objeto",
        sortable: true,
        render: (document) => (
          <div className="font-mono text-sm">{document.objectCode}</div>
        ),
      },
      {
        accessor: "actions",
        width: 100,
        render: (document) => (
          <ActionsMenu
            onEdit={() => handleEdit(document)}
            onDownload={() => handleDownload(document)}
          />
        ),
      },
    ],
    [handleEdit, handleDownload]
  );

  return (
    <>
      {response.status == 401 && <SessionExpiredAlert />}
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Mis Documentos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestiona tus documentos personales
            </p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Subir Documento
          </Button>
        </div>
        <DataGrid
          onCreate={handleCreate}
          simpleData={data}
          columns={columns}
          enablePagination={false}
          enableSearch={false}
          enableSorting={false}
          className="mt-6"
        />
      </div>

      <DocumentModal
        open={modalOpen}
        onClose={handleModalClose}
        document={selectedDocument}
        userId={userId}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
