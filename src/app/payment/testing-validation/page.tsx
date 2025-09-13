import { Card, Text, Title } from "@mantine/core";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import { TestTransactionCard } from "../_components/testing-validation/test-transaction-card";
import { TestResultsTable } from "../_components/testing-validation/test-results-table";
import { GatewayTestGrid } from "../_components/testing-validation/gateway-test-grid";
import { Suspense } from "react";
import {
  GatewayTestGridSkeleton,
  TestResultsTableSkeleton,
} from "../_components/skeletons";

export default function TestingValidationPage() {
  return (
    <div className="space-y-6">
      <div>
        <Title
          order={2}
          className="text-gray-900 dark:text-gray-100 text-3xl font-bold"
        >
          Testing & Validation
        </Title>
        <Text className="text-gray-500 dark:text-gray-400">
          Test payment gateway connections and validate configurations
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4 shadow-lg bg-slate-200/70 dark:bg-slate-950/50 dark:text-slate-100">
          <CardHeader>
            <CardTitle>Gateway Connection Tests</CardTitle>
            <CardDescription>
              Test individual gateway connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 ">
            <Suspense fallback={<GatewayTestGridSkeleton />}>
              <GatewayTestGrid />
            </Suspense>
          </CardContent>
        </Card>

        <TestTransactionCard />
      </div>

      <Suspense fallback={<TestResultsTableSkeleton />}>
        <TestResultsTable />
      </Suspense>
    </div>
  );
}
