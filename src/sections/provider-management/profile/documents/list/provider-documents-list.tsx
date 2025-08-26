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
import { EnhancedDocument } from "@/types/suppliers";
import Link from "next/link";

interface Props {
  userId: number;
  documents: EnhancedDocument[];
}

export function ProviderDocumentsList({ documents, userId }: Props) {
  const router = useRouter();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<
    IDocument | undefined
  >(undefined);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setSelectedDocument(undefined);
  }, []);

  const handleModalSuccess = useCallback(() => {
    // Refresh the page to show updated data
    router.refresh();
  }, [router]);

  const columns = useMemo<DataTableColumn<EnhancedDocument>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (document) => (
          <div className="font-medium">{document.fileName}</div>
        ),
      },
      {
        accessor: "Razón de rechazo",
        title: "Razón de rechazo",
        sortable: true,
        render: (document) => (
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px] block">
            {document.rejectionReason || "En revisión"}
          </p>
        ),
      },
      {
        accessor: "Estado de Aprobación",
        title: "Estado de Aprobación",
        sortable: true,
        render: (document) => (
          <div className="font-mono text-sm">
            {document.beApproved ? "Aprobado" : "No Aprobado"}
          </div>
        ),
      },
      {
        accessor: "Contenido",
        title: "Contenido",
        sortable: true,
        render: (document) => (
          <Link
            className="font-mono text-sm hover:text-blue-400"
            href={document.content}
            target="_blank"
          >
            {document.content ? "Ver Documento" : "No disponible"}
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <>
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
        </div>
        <DataGrid
          simpleData={documents}
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
