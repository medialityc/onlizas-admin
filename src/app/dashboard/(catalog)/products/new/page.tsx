import ProductCreateContainer from "@/sections/products/containers/product-create-container";
import SupplierProductCreateContainer from "@/sections/products/containers/supplier-product-create-container";
import ServerPermissionWrapper from "@/components/permission/server-permission-wrapper";

export const metadata = {
  title: "Crear Producto - Onlizas",
};

export default function NewProductPage() {
  return (
    <ServerPermissionWrapper
      module="products"
      adminComponent={<ProductCreateContainer />}
      supplierComponent={<SupplierProductCreateContainer />}
    />
  );
}
