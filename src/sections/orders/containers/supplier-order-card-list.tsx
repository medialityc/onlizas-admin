import { SearchParams } from "@/types/fetch/request";
import React, { useId } from "react";
import { Order } from "@/types/order";
import { OrderGroupCard } from "@/components/orders/order-group-card";

type Props = {
  data?: Order[];
  onPrintLabel?: (subOrderId: string, status: any) => void;
};

const SupplierOrderCardList = ({ data, onPrintLabel }: Props) => {
  const id = useId();

  return (
    <section className="grid grid-cols-1 gap-3 md:gap-6 mb-4">
      {data?.map((order: Order, idx) => (
        <div className="col-span-1" key={`${id}-${order?.id}${idx}`}>
          <OrderGroupCard order={order} onPrintLabel={onPrintLabel} />
        </div>
      ))}
    </section>
  );
};

export default SupplierOrderCardList;
