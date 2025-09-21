"use client";

import { GatewayTest } from "@/types";
import { Badge, Button } from "@mantine/core";
import { CreditCard } from "lucide-react";
import { usePermissions } from "@/auth-sso/permissions-control/hooks";

export const GatewayTestCard = ({ test }: { test: GatewayTest }) => {
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every(perm => permissions.some(p => p.code === perm));
  };
  const hasUpdatePermission = hasPermission(["UPDATE_ALL"]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg bg-slate-200/70 dark:bg-slate-950/50 dark:text-slate-100 space-y-3 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <CreditCard className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
            {test.name}
          </h4>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
            Last: {test.lastTest}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end space-x-2 flex-shrink-0">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {test.latency}
        </span>
        <div className="flex items-center space-x-2">
          <Badge
            color={test.status === "success" ? "green" : "red"}
            variant="filled"
            size="sm"
          >
            {test.status}
          </Badge>
          {hasUpdatePermission && (
            <Button size="xs" className="sm:size-sm">
              Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
