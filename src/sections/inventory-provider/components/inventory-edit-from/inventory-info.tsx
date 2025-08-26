import { Package, Store, Warehouse, Truck, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { InventoryStoreFormData } from "../../schemas/inventory-edit.schema";

type IconProps = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

const InventoryHeader = ({
  inventory,
}: {
  inventory: InventoryStoreFormData;
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard
          icon={Package}
          label="Producto"
          value={inventory?.parentProductName || "Sin Nombre"}
        />
        <InfoCard
          icon={Store}
          label="Tienda"
          value={inventory?.storeName ?? ""}
        />
        <InfoCard
          icon={Warehouse}
          label="Almacén"
          value={inventory?.warehouseName ?? ""}
        />
        <InfoCard
          icon={Truck}
          label="Proveedor"
          value={inventory?.supplierName ?? ""}
        />
      </div>
    </div>
  );
};

export default InventoryHeader;

type InfoCardProps = {
  icon: IconProps;
  label: string;
  value: string;
};

const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 flex-1 w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 col-span-2 xl:col-span-1">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        {label}
      </span>
    </div>
    <p
      className="text-base font-bold text-gray-800 dark:text-gray-100 truncate"
      title={value}
    >
      {value}
    </p>
  </div>
);
