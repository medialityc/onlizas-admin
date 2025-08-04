import React from "react";
import { KeyIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { IRole } from "@/types/roles";

interface RolesListProps {
  roles: IRole[];
}

const RolesList: React.FC<RolesListProps> = ({ roles }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Roles & Permissions
      </h2>
      <div className="space-y-4">
        {roles.map(role => (
          <div
            key={role.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <KeyIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="text-md font-medium text-gray-900">
                    {role.name}
                  </h3>
                </div>
                <span className="text-sm text-gray-500">{role.code}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{role.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {role.subSystemName} ({role.subSystemCode})
              </div>
            </div>

            {role.permissions.length > 0 && (
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {role.permissions.map(permission => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded"
                    >
                      <LockClosedIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{permission.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesList;
