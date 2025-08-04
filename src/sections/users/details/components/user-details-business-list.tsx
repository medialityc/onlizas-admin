import React from "react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Business } from "@/types/users";

interface BusinessListProps {
  businesses: Business[];
}

const BusinessList: React.FC<BusinessListProps> = ({ businesses }) => {
  if (businesses.length === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Associated Businesses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.map(business => (
          <div
            key={business.id}
            className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg"
          >
            <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {business.name}
              </h3>
              <p className="text-xs text-gray-500">{business.code}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessList;
