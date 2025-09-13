import { Badge, Button } from "@mantine/core";
import { CreditCard } from "lucide-react";
import { GatewayTest } from "../../interfaces";

export const GatewayTestCard = ({ test }: { test: GatewayTest }) => (
  <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-200/70 dark:bg-slate-950/50 dark:text-slate-100">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <CreditCard className="h-4 w-4" />
      </div>
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          {test.name}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last: {test.lastTest}
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {test.latency}
      </span>
      <Badge
        color={test.status === "success" ? "green" : "red"}
        variant="filled"
      >
        {test.status}
      </Badge>
      <Button size="sm">Test</Button>
    </div>
  </div>
);
