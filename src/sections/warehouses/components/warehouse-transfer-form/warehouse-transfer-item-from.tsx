import RHFAutocompleteFetcherInfinity from "@/components/react-hook-form/rhf-autcomplete-fetcher-scroll-infinity";
import { getAllWarehouses } from "@/services/warehouses";
import { useWarehouseInventoryActions } from "../../contexts/warehouse-inventory-transfer.stote";

type Props = {
  warehouseId: number;
};
const WarehouseTransferItemForm = ({ warehouseId }: Props) => {
  const { items } = useWarehouseInventoryActions();
  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <RHFAutocompleteFetcherInfinity
          name="destinationWarehouseId"
          label="Almacén de Destino"
          placeholder="Selecciona el almacén destino..."
          onFetch={getAllWarehouses}
          exclude={[String(warehouseId)]}
          objectValueKey="id"
          objectKeyLabel="name"
          queryKey="destination-warehouse"
          multiple
        />
      </div>

      <pre> {JSON.stringify(items, null, 2)} </pre>
    </div>
  );
};

export default WarehouseTransferItemForm;
