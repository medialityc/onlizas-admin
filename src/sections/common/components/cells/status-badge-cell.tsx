import Badge from "@/components/badge/badge";
import React from "react";

type Props = {
  value: boolean;
  status?: {
    active: string;
    inactive: string;
  };
};
const StatusBadgeCell = ({ value, status }: Props) => {
  return (
    <div>
      {value ? (
        <Badge rounded variant="success">
          {status?.active || "Activo"}
        </Badge>
      ) : (
        <Badge rounded variant="danger">
          {status?.inactive || "Inactivo"}
        </Badge>
      )}
    </div>
  );
};

export default StatusBadgeCell;
