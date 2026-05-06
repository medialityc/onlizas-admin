"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { useMemo, useState } from "react";
import { SearchParams } from "@/types/fetch/request";
import { InventoryReview, GetInventoryReviewsResponse } from "@/types/reviews";
import { RatingStars } from "@/components/ui/rating-stars";
import { ReviewDetailsModal } from "../modals/review-details-modal";
import { EyeIcon } from "@heroicons/react/24/outline";

interface ReviewsListProps {
  data?: GetInventoryReviewsResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function ReviewsList({
  data,
  searchParams,
  onSearchParamsChange,
}: ReviewsListProps) {
  const [selectedReview, setSelectedReview] = useState<InventoryReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (review: InventoryReview) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const columns = useMemo<DataTableColumn<InventoryReview>[]>(
    () => [
      {
        accessor: "userName",
        title: "Usuario",
        render: (r) => (
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {r.userName}
          </span>
        ),
      },
      {
        accessor: "averageScore",
        title: "Promedio",
        render: (r) => (
          <RatingStars value={r.averageScore} size="sm" showValue />
        ),
      },
      {
        accessor: "message",
        title: "Mensaje",
        render: (r) => {
          const text = r.message || "";
          const truncated =
            text.length > 80 ? text.slice(0, 80) + "…" : text;
          return (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {truncated || "—"}
            </span>
          );
        },
      },
      {
        accessor: "actions",
        title: "Acciones",
        width: 120,
        textAlign: "center",
        render: (r) => (
          <button
            type="button"
            onClick={() => handleOpenDetails(r)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            title="Ver detalles"
          >
            <EyeIcon className="h-3.5 w-3.5" />
            Ver detalles
          </button>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="overflow-x-auto">
        <DataGrid<InventoryReview>
          data={data}
          columns={columns}
          searchParams={searchParams}
          onSearchParamsChange={onSearchParamsChange}
          searchPlaceholder="Buscar reseñas..."
          emptyText="No hay reseñas"
          enableSorting={false}
        />
      </div>

      <ReviewDetailsModal
        review={selectedReview}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
