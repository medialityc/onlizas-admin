import SupplierProductForm from "../components/supplier-product-form";
import { SupplierProductFormData } from "../schema/supplier-product-schema";

type Props = {
  product: SupplierProductFormData;
};
const SupplierProductEditContainer = ({ product }: Props) => {
  return (
    <div className="panel">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-dark dark:text-white-light">
          Editar Product
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define el producto y sus características
        </p>
      </div>
      <SupplierProductForm initValue={product} isEdit />
    </div>
  );
};

export default SupplierProductEditContainer;
