import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { warehouseOriginSelectedSchema } from "../schemas/warehouse-selected-schema";
import { WAREHOUSE_TYPE_ENUM } from "../constants/warehouse-type";

export const useWarehouseSelectForm = () => {
  const { push } = useRouter();

  const { ...form } = useForm({
    resolver: zodResolver(warehouseOriginSelectedSchema),
    defaultValues: {
      warehouseOriginId: 0,
      type: WAREHOUSE_TYPE_ENUM.warehouse,
    },
  });

  const type = form.watch("type");

  return {
    form: form,
    onSubmit: form.handleSubmit((values) => {
      push(`warehouses/${type}/${values?.warehouseOriginId}/edit/transfers`);
    }),
  };
};
