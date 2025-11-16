import { SearchParams } from "@/types/fetch/request";
import React, { useId } from "react";
import { Order } from "@/types/order";
import { OrderCard } from "../components/order-card";

type Props = {
  data?: Order[];
};
const OrderList = ({ data }: Props) => {
  const id = useId();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6 mb-4">
      {data?.map((order: Order, idx) => (
        <div className="col-span-1" key={`${id}-${order?.id}${idx}`}>
          <OrderCard order={order} isAdmin onViewDetails={() => {}} />
        </div>
      ))}
    </section>
  );
};

export default OrderList;
