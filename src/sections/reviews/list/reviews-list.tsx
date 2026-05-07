"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { useMemo, useState } from "react";
import { SearchParams } from "@/types/fetch/request";
import { InventoryReview, GetInventoryReviewsResponse } from "@/types/reviews";
import { RatingStars } from "@/components/ui/rating-stars";
import { ReviewDetailsModal } from "../modals/review-details-modal";
import ActionsMenu from "@/components/menu/actions-menu";

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
        width: 280,
        render: (r) => {
          const text = r.message || "";
          const truncated =
            text.length > 80 ? text.slice(0, 80) + "…" : text;
          return (
            <span className="text-sm text-gray-600 dark:text-gray-400 truncate block max-w-[260px]">
              {truncated || "—"}
            </span>
          );
        },
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (r) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleOpenDetails(r)}
            />
          </div>
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
