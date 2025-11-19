"use client";
import { useState, useCallback } from "react";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/button/button";
import { Separator } from "@/components/ui/separator";
import { GeneralInfo } from "./general-info";
import { EditableAddress } from "./editable-address";
import { SubOrdersSection } from "./sub-orders-section";
import SimpleModal from "@/components/modal/modal";

interface OrderDetailsProps {
  onOpen: boolean;
  order: Order;
  onClose: () => void;
  onUpdateSubOrderStatus?: (subOrderId: string, status: OrderStatus) => void;
  onUpdateAddress?: (type: "sender" | "receiver", address: string) => void;
  isSupplier?: boolean;
}

export function OrderDetails({
  onOpen,
  order,
  onClose,
  onUpdateSubOrderStatus,
  onUpdateAddress,
  isSupplier = false,
}: OrderDetailsProps) {
  const [editingAddress, setEditingAddress] = useState<
    "sender" | "receiver" | null
  >(null);
  const [addressValues, setAddressValues] = useState({
    sender: order.senderAddress,
    receiver: order.receiverAddress,
  });

  const handleAddressSave = useCallback(
    (type: "sender" | "receiver") => {
      onUpdateAddress?.(type, addressValues[type]);
      setEditingAddress(null);
    },
    [onUpdateAddress, addressValues]
  );

  const handleAddressCancel = useCallback(() => {
    setAddressValues({
      sender: order.senderAddress,
      receiver: order.receiverAddress,
    });
    setEditingAddress(null);
  }, [order.senderAddress, order.receiverAddress]);

  return (
    <SimpleModal
      open={onOpen}
      onClose={onClose}
      title={`Detalles de Orden - ${order.orderNumber}`}
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose}>Guardar</Button>
        </div>
      }
      className="max-w-4xl"
    >
      <div className="space-y-6">
        <GeneralInfo order={order} />
        <Separator />
        <EditableAddress
          title="Dirección de Entrega (Destinatario)"
          address={order.receiverAddress}
          isEditing={editingAddress === "receiver"}
          onEdit={() => setEditingAddress("receiver")}
          onSave={() => handleAddressSave("receiver")}
          onCancel={handleAddressCancel}
          onChange={(value) =>
            setAddressValues((prev) => ({ ...prev, receiver: value }))
          }
          value={addressValues.receiver}
        />
        <Separator />
        <SubOrdersSection
          subOrders={order.subOrders}
          onUpdateStatus={onUpdateSubOrderStatus}
          isSupplier={isSupplier}
        />
      </div>
    </SimpleModal>
  );
}
