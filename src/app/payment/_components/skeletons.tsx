import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import { Grid, GridCol } from "@mantine/core";
import {
  Card,
  Group,
  Table,
  TableTbody,
  TableTd,
  TableTr,
  Text,
} from "@mantine/core";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-md shadow-md py-6 px-4 bg-slate-200/50 dark:bg-slate-950/50`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col w-full">
          <div className="h-3 w-1/3 rounded bg-gray-300 dark:bg-gray-700 mb-6 animate-pulse" />
          <div className="mt-6 h-5 w-2/3 rounded bg-gray-300 dark:bg-gray-700 mb-2 animate-pulse" />
          <div className="h-2 w-1/4 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
        </div>

        <div className="h-7 w-7 rounded-md bg-gray-300 dark:bg-gray-700  animate-pulse" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <Grid gutter="md" className="mb-8">
      {[...Array(4)].map((_, i) => (
        <GridCol key={i} span={{ base: 12, sm: 6, md: 3 }}>
          <CardSkeleton />
        </GridCol>
      ))}
    </Grid>
  );
}

export const GatewaysCardSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <Card
      withBorder
      radius="lg"
      className="shadow-sm bg-slate-200/50 dark:bg-slate-950/50"
    >
      <Text fw={600} className="mb-4 text-gray-900 dark:text-gray-100">
        Gateway Status
      </Text>

      <Table withTableBorder className="bg-white dark:bg-gray-800">
        <TableTbody>
          {[...Array(rows)].map((_, idx) => (
            <TableTr
              key={idx}
              className={
                idx % 2 === 0
                  ? "bg-slate-200/20 dark:bg-slate-950/80"
                  : "bg-slate-200/50 dark:bg-slate-950/70"
              }
            >
              <TableTd>
                <Group gap="md">
                  <div className="h-8 w-8 rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                    <div className="h-2 w-32 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  </div>
                </Group>
              </TableTd>

              <TableTd>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                  <div className="flex flex-col sm:items-end gap-1">
                    <div className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                    <div className="h-2 w-20 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  </div>
                  <div className="h-6 w-16 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                </div>
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </Card>
  );
};

export const GatewayTestCardSkeleton = () => (
  <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-200/50 dark:bg-gray-700/30 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 rounded-md bg-gray-300 dark:bg-gray-600" />
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-600" />
        <div className="h-2 w-20 rounded bg-gray-300 dark:bg-gray-600" />
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="h-3 w-12 rounded bg-gray-300 dark:bg-gray-600" />
      <div className="h-5 w-16 rounded bg-gray-300 dark:bg-gray-600" />
      <div className="h-7 w-16 rounded bg-gray-300 dark:bg-gray-600" />
    </div>
  </div>
);

export const GatewayTestGridSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <GatewayTestCardSkeleton key={i} />
      ))}
    </div>
  );
};

import React from "react";

export const TestResultsTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <Card
      padding="lg"
      className="bg-slate-200/70 dark:bg-slate-950/50 dark:text-slate-100 shadow-lg rounded-md animate-pulse"
    >
      <CardHeader>
        <CardTitle>Test Results History</CardTitle>
        <CardDescription>
          Recent gateway test results and performance metrics
        </CardDescription>
      </CardHeader>

      {/* Table */}
      <CardContent className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 px-3 text-gray-700 dark:text-gray-300">
                Gateway
              </th>
              <th className="py-2 px-3 text-gray-700 dark:text-gray-300">
                Test Type
              </th>
              <th className="py-2 px-3 text-gray-700 dark:text-gray-300">
                Result
              </th>
              <th className="py-2 px-3 text-gray-700 dark:text-gray-300">
                Response Time
              </th>
              <th className="py-2 px-3 text-gray-700 dark:text-gray-300">
                Timestamp
              </th>
              <th className="py-2 px-3 text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 dark:border-gray-700"
              >
                <td className="py-2 px-3">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
                </td>
                <td className="py-2 px-3">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
                </td>
                <td className="py-2 px-3">
                  <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </td>
                <td className="py-2 px-3">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded" />
                </td>
                <td className="py-2 px-3">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
                </td>
                <td className="py-2 px-3">
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

// Skeleton para RecentActivityCard
export const RecentActivityCardSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100 rounded-md p-4 animate-pulse space-y-4">
    <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded-sm mb-4" />{" "}
    {/* Title */}
    {Array.from({ length: rows }).map((_, idx) => (
      <div key={idx} className="flex space-x-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
        <div className="flex-1 space-y-1">
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-sm" />{" "}
          {/* Action */}
          <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-sm" />{" "}
          {/* Gateway • User */}
          <div className="h-2 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-sm" />{" "}
          {/* Time */}
        </div>
      </div>
    ))}
  </div>
);

// Skeleton para ConfigChangesCard
export const ConfigChangesCardSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100 rounded-md p-4 animate-pulse space-y-4">
    <div className="h-6 w-52 bg-gray-300 dark:bg-gray-700 rounded-sm" />{" "}
    {/* Title */}
    <div className="h-4 w-80 bg-gray-300 dark:bg-gray-700 rounded-sm mb-4" />{" "}
    {/* Description */}
    {Array.from({ length: rows }).map((_, idx) => (
      <div
        key={idx}
        className="bg-slate-100 dark:bg-slate-900 rounded-md p-3 space-y-2"
      >
        <div className="flex justify-between space-x-2">
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-sm" />{" "}
          {/* Gateway - Field */}
          <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded-sm" />{" "}
          {/* Timestamp */}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded-sm" />{" "}
            {/* Before label */}
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md" />{" "}
            {/* Before value */}
          </div>
          <div className="space-y-1">
            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded-sm" />{" "}
            {/* After label */}
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md" />{" "}
            {/* After value */}
          </div>
        </div>
        <div className="h-3 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-sm mt-2" />{" "}
        {/* Changed by */}
      </div>
    ))}
  </div>
);

export const AuditLogCardSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100 rounded-md p-4 animate-pulse space-y-4">
    {/* Título */}
    <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded-sm" />
    {/* Descripción */}
    <div className="h-4 w-80 bg-gray-300 dark:bg-gray-700 rounded-sm" />

    {/* Tabla */}
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            {[
              "Timestamp",
              "Action",
              "Gateway",
              "User",
              "IP Address",
              "Details",
            ].map((col, idx) => (
              <th
                key={idx}
                className="text-left text-gray-700 dark:text-gray-300 py-2 px-3"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, idx) => (
            <tr
              key={idx}
              className={
                idx % 2 === 0
                  ? "bg-slate-200/20 dark:bg-slate-950/80"
                  : "bg-slate-200/50 dark:bg-slate-950/70"
              }
            >
              <td className="py-2 px-3 h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-sm" />
              <td className="py-2 px-3 h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded-sm" />
              <td className="py-2 px-3 h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-sm" />
              <td className="py-2 px-3 h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded-sm" />
              <td className="py-2 px-3 h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-sm" />
              <td className="py-2 px-3 h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded-sm" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
