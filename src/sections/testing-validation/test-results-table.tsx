import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";

import { Badge, Button, Card } from "@mantine/core";
import { Eye } from "lucide-react";
import { testResults } from "../../services/data-for-gateway-settings/mock-datas";
import { sleep } from "../../utils/sleep";

export const TestResultsTable = async () => {
  await sleep(3000);
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="bg-slate-200/70 dark:bg-slate-950/50 dark:text-slate-100 shadow-lg px-0"
    >
      <CardHeader>
        <CardTitle>Test Results History</CardTitle>
        <CardDescription>
          Recent gateway test results and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Gateway
                </th>
                <th className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Test Type
                </th>
                <th className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Result
                </th>
                <th className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Response Time
                </th>
                <th className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                  Timestamp
                </th>
                <th className="py-2 px-2 sm:px-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="py-2 px-2 sm:px-3 font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                    {test.gateway}
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                    {test.type}
                  </td>
                  <td className="py-2 px-2 sm:px-3">
                    <Badge
                      color={test.result === "Success" ? "green" : "red"}
                      variant="filled"
                      size="xs"
                      className="sm:size-sm"
                    >
                      {test.result}
                    </Badge>
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                    {test.time}
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-gray-700 dark:text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                    {test.timestamp}
                  </td>
                  <td className="py-2 px-2 sm:px-3">
                    <Button variant="subtle" size="xs">
                      <Eye className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
