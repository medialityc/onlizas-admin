"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import SectionProductFrom from "./section-product-from";
import { ArrowDown, ArrowUp, PackageOpen } from "lucide-react";
import ImagePreview from "@/components/image/image-preview";
import LongText from "@/components/long-text/long-text";
import SimpleModal from "@/components/modal/modal";
import { useCallback, useState } from "react";
import Badge from "@/components/badge/badge";
import { AlertBox } from "@/components/alert/alert-box";
import { isValidUrl } from "@/utils/format";
import { deleteSectionProduct } from "@/services/section";
import { toast } from "react-toastify";
import LoaderButton from "@/components/loaders/loader-button";

export default function SectionProducts() {
  const { control, formState, getValues } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "products",
  });
  const sectionId = getValues("id");

  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const handleDeleteExisting = useCallback(
    async (index: string) => {
      try {
        setDeletingId(index);
        await deleteSectionProduct(sectionId, index);
        toast.success("Producto eliminado de la sección");
      } catch (e: any) {
        toast.error(e?.message || "No se pudo eliminar el producto");
      } finally {
        setDeletingId(null);
      }
    },
    [fields, remove, sectionId]
  );

  return (
    <>
      <section className="w-full ">
        {formState?.errors?.products?.message && (
          <AlertBox
            title="Error"
            variant="danger"
            message={formState?.errors?.products?.message as string}
          />
        )}
        <div className="mb-4 mt-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold ">Productos de la sección</h2>
          <button
            className="btn btn-primary px-4 py-2 rounded-lg text-white"
            type="button"
            onClick={() => setModalOpen(true)}
          >
            Añadir producto
          </button>
        </div>

        {/* Lista moderna y responsive de productos añadidos */}
        {fields?.length > 0 ? (
          <ul className="mt-4 w-full   mx-auto flex flex-col gap-3">
            {fields?.map((item: any, idx) => (
              <li
                key={item?.id}
                className="flex items-center justify-between gap-4 px-4 py-4 rounded-xl shadow-sm bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Preview color */}
                  <span
                    className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 shrink-0"
                    style={{
                      background: item?.customBackgroundColor || "#f3f4f6",
                    }}
                    title={item?.customBackgroundColor}
                  />
                  {/* Info producto */}
                  <div className="flex flex-row items-center gap-4 min-w-0">
                    <div className="flex flex-row gap-2 items-center max-w-96">
                      <ImagePreview
                        images={
                          (
                            item?.product?.images || item?.product?.imagesUrl
                          )?.map((image: string) =>
                            isValidUrl(image) ? image : ""
                          ) || []
                        }
                        alt={
                          item?.product?.productName ||
                          item?.product?.name ||
                          "product"
                        }
                        className="w-12 h-12"
                      />
                      <div>
                        <LongText
                          className="text-base"
                          text={
                            item?.product?.productName ||
                            item?.product?.name ||
                            "product"
                          }
                          lineClamp={1}
                        />
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item?.product?.storeName && (
                            <Badge>{item?.product?.storeName}</Badge>
                          )}
                          {item?.product?.price && (
                            <Badge>${item?.product?.price}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge>Orden: {idx + 1}</Badge>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 rounded-lg text-gray-600 hover:bg-gray-100 border border-gray-200 text-xs font-semibold transition"
                    type="button"
                    onClick={() => {
                      if (idx > 0) {
                        move(idx, idx - 1);
                      }
                    }}
                    aria-label="Subir producto"
                    disabled={idx === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    className="px-2 py-1 rounded-lg text-gray-600 hover:bg-gray-100 border border-gray-200 text-xs font-semibold transition"
                    type="button"
                    onClick={() => {
                      if (idx < fields?.length - 1) {
                        move(idx, idx + 1);
                      }
                    }}
                    aria-label="Bajar producto"
                    disabled={idx === fields?.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  {item?.id ? (
                    <LoaderButton
                      type="button"
                      loading={deletingId === item.productGlobalId}
                      disabled={deletingId === item.productGlobalId}
                      className="px-3 py-1 rounded-lg text-red-600 bg-red-50 dark:hover:bg-red-900 border border-red-200 dark:border-red-700 text-xs font-semibold transition"
                      onClick={() => handleDeleteExisting(item.productGlobalId)}
                      aria-label="Eliminar producto existente"
                    >
                      <span className="hidden md:inline">Eliminar</span>
                      <span className="md:hidden">✕</span>
                    </LoaderButton>
                  ) : (
                    <button
                      className="px-3 py-1 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900 border border-red-200 dark:border-red-700 text-xs font-semibold transition"
                      type="button"
                      onClick={() => remove(idx)}
                      aria-label="Eliminar producto nuevo"
                    >
                      <span className="hidden md:inline">Quitar</span>
                      <span className="md:hidden">✕</span>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="w-full   mx-auto flex flex-col items-center justify-center gap-2 py-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
            <PackageOpen className="w-10 h-10 text-gray-400" />
            <span className="text-gray-400 dark:text-gray-500 text-base">
              No hay productos añadidos
            </span>
          </div>
        )}
      </section>
      {/* Modal para agregar producto */}
      <SimpleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Agregar producto a la sección"
      >
        <SectionProductFrom
          append={(item: any) => {
            append(item);
            setModalOpen(false);
          }}
        />
      </SimpleModal>
    </>
  );
}
