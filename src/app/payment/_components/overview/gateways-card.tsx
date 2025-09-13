import {
  Badge,
  Card,
  Group,
  Table,
  TableTbody,
  TableTd,
  TableTr,
  Text,
  ThemeIcon,
} from "@mantine/core";
import React from "react";
import { cn } from "@/lib/utils";
import { mockGateways } from "../../data/mock-datas";
import { sleep } from "../../_utils/sleep";
import { CreditCard } from "lucide-react";

export const GatewaysCard = async () => {
  await sleep(2000);
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
          {mockGateways.map(({ name, lastTest, transactions, status }, idx) => (
            <TableTr
              key={name}
              className={cn(
                idx % 2 === 0
                  ? "bg-slate-200/20 dark:bg-slate-950/80"
                  : "bg-slate-200/50 dark:bg-slate-950/70"
              )}
            >
              <TableTd>
                <Group gap="md">
                  <ThemeIcon size={32} radius="md" variant="light">
                    <CreditCard size={18} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} className="text-gray-900 dark:text-gray-100">
                      {name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Last test: {lastTest}
                    </Text>
                  </div>
                </Group>
              </TableTd>

              <TableTd>
                <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-end gap-2">
                  <div className="flex flex-col  sm:items-end">
                    <Text
                      fw={700}
                      className="text-slate-950 dark:text-slate-300"
                    >
                      {transactions}
                    </Text>
                    <Text
                      size="sm"
                      className="text-slate-800 dark:text-slate-300"
                    >
                      Transactions
                    </Text>
                  </div>
                  <Badge
                    color={status === "active" ? "green" : "red"}
                    variant="filled"
                    radius="sm"
                  >
                    {status}
                  </Badge>
                </div>
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </Card>
  );
};
