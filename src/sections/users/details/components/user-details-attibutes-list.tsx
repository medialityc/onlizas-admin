import React from "react";

import { TagIcon } from "@heroicons/react/24/outline";
import { Attributes } from "@/types/common";

interface AttributesListProps {
  attributes: Attributes;
}

const AttributesList: React.FC<AttributesListProps> = ({ attributes }) => {
  const attributeEntries = Object.entries(attributes ?? []);
  
  if (attributeEntries.length === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Additional Attributes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attributeEntries.map(([key, value]) => (
          <div
            key={key}
            className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg"
          >
            <TagIcon className="w-5 h-5 text-gray-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-700">{key}</h3>
              <p className="text-sm text-gray-600">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributesList;
