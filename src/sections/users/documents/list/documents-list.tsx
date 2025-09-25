"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { downloadUserDocument } from "@/services/users";
import { ApiResponse } from "@/types/fetch/api";
import { IDocument } from "@/types/users";
import { DataTableColumn } from "mantine-datatable";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useCallback, useMemo } from "react";

interface Props {
  userId: number;
  documentsPromise: Promise<ApiResponse<IDocument[]>>;
}

export function UserDocumentsList({ documentsPromise, userId }: Props) {
  const response = use(documentsPromise);
  const data = useMemo(() => response.data || [], [response.data]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCreate = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("modal", "create");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleEdit = useCallback(
    (document: IDocument) => {
      const params = new URLSearchParams(searchParams);
      params.set("modal", "edit");
      params.set("documentId", document.id.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

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
            editPermissions={["DOCUMENT_VALIDATE"]}
            downloadPermissions={["READ_ALL"]}
          />
        ),
      },
    ],
    [handleEdit, handleDownload]
  );

  return (
    <>
      <div className="panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-dark dark:text-white-light">
              Gestión de Documentos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administra los documentos del usuario
            </p>
          </div>
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
    </>
  );
}
