"use client";

import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllProductsBySupplier } from "@/services/products";
import { Product } from "@/types/products";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect } from "react";
import { useFindFeatureCategory } from "../../hooks/use-find-feature-category";
import { useFormContext } from "react-hook-form";
import { getCategoryFeature } from "../../constants/category-feature";
import { FeatureFormData } from "@/sections/categories/schemas/category-schema";

type Props = {
  supplierId: number;
};
function ProductSupplierSection({ supplierId }: Props) {
  const { mutate: getFeatures, data } = useFindFeatureCategory();
  const { setValue } = useFormContext();
  const handleOptionSelect = useCallback(
    (op: Product) => {
      const categories = op?.categories?.map((c) => c.id);
      return getFeatures(categories);
    },
    [getFeatures]
  );

  useEffect(() => {
    if (data) {
      const sortFeature = getCategoryFeature(
        data?.data?.features as unknown as FeatureFormData[]
      );
      if (sortFeature?.length > 0) {
        setValue("categoryFeature", sortFeature);
      }
    }
  }, [data, setValue]);

  console.log(data);

  return (
    <div className="bg-white rounded-lg border p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ShoppingBagIcon className="mr-2 w-5 h-5" /> Productos del proveedor
      </h3>
      <div className="space-y-6">
        <div>
          <RHFAutocompleteFetcherInfinity
            name="productId"
            placeholder="Seleccionar un producto"
            onFetch={(params) => getAllProductsBySupplier(supplierId, params)}
            objectValueKey="id"
            objectKeyLabel="name"
            queryKey="product"
            onOptionSelected={handleOptionSelect}
            required
          />
        </div>
      </div>
    </div>
  );
}

export default ProductSupplierSection;
