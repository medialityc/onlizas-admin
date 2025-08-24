import IconSettings from "@/components/icon/icon-settings";
import StoreItem from "./store-item";
import { InventoryProviderStoreSettingItem } from "@/sections/inventory-provider/schemas/inventory-provider.schema";

type Props = {
  items: InventoryProviderStoreSettingItem[];
};
const StoreList = ({ items }: Props) => {
  if (items?.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 my-4 flex items-center ">
        <IconSettings className="mr-2 w-5 h-5" /> Configuración de tiendas
      </h3>
      <div className="space-y-6">
        {items?.map((item, index: number) => (
          <StoreItem key={item?.id} title={item.storeName} index={index} />
        ))}
      </div>
    </div>
  );
};

export default StoreList;
