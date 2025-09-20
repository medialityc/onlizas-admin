"use client";

import { Card, Text, Title } from "@mantine/core";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";

import { Suspense } from "react";
import {
  GatewayTestGridSkeleton,
  TestResultsTableSkeleton,
} from "@/sections/skeletons";
import {
  GatewayTestList,
  TestResultsTable,
  TestTransactionCard,
} from "@/sections/testing-validation";

export default function TestingValidationPage() {
  return (
    <div className="space-y-6">
      <div>
        <Title
          order={2}
          className="text-gray-900 dark:text-gray-100 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold"
        >
          Testing & Validation
        </Title>
        <Text className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Test payment gateway connections and validate configurations
        </Text>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card className="space-y-4 shadow-lg bg-slate-200/70 dark:bg-slate-950/50 dark:text-slate-100">
          <CardHeader>
            <CardTitle>Gateway Connection Tests</CardTitle>
            <CardDescription>
              Test individual gateway connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 ">
            <Suspense fallback={<GatewayTestGridSkeleton />}>
              <GatewayTestList />
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
