import IconSettings from "@/components/icon/icon-settings";
import StoreVariant from "../inventory-provider-form/store-item/store-variants";

const InventoryEditVariantContent = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 my-4 flex items-center dark:text-gray-100">
        <IconSettings className="mr-2 w-5 h-5" /> Configuración del inventario
      </h3>
      <div className="gap-2">
        <StoreVariant name="products" />
      </div>
    </div>
  );
};

export default InventoryEditVariantContent;
