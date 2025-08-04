import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

interface StatusBadgeProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  isActive,
  activeText = "Verified",
  inactiveText = "Unverified",
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      } ${className}`}
    >
      {isActive ? (
        <CheckCircleIcon className="w-4 h-4 mr-1" />
      ) : (
        <XCircleIcon className="w-4 h-4 mr-1" />
      )}
      {isActive ? activeText : inactiveText}
    </span>
  );
};

export default StatusBadge;
