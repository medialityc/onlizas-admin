import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { warehouseOriginSelectedSchema } from "../schemas/warehouse-selected-schema";

export const useWarehouseSelectForm = () => {
  const { push } = useRouter();

  const { ...form } = useForm({
    resolver: zodResolver(warehouseOriginSelectedSchema),
    defaultValues: {
      warehouseOriginId: 0,
      type: "",
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
