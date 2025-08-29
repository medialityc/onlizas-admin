import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const WarehouseTransferItemForm = () => {
  const { control, getValues } = useFormContext();
  const { fields } = useFieldArray({ control, name: "items" });

  console.log(getValues(), 'getValues')
  return (
    <div>
      <pre> {JSON.stringify(fields, null, 2)}</pre>
    </div>
  );
};

export default WarehouseTransferItemForm;
