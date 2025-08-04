import React from "react";
import { ShieldCheckIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import StatusBadge from "@/components/badge/status-badge";
import { IUser } from "@/types/users";

interface UserHeaderProps {
  user: IUser;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          {user.photoUrl ? (
            <Image
              src={user.photoUrl}
              alt={user.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full border-2 border-white"
            />
          ) : (
            <UserCircleIcon className="w-16 h-16 text-white" />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <StatusBadge
                isActive={user.isVerified}
                activeText="Verified"
                inactiveText="Unverified"
                className="bg-opacity-20 text-white"
              />
              {user.apiRole && (
                <div className="flex items-center text-blue-100">
                  <ShieldCheckIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{user.apiRole}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
