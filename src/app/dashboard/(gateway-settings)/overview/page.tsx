import { Text, Title, Stack } from "@mantine/core";
import { GatewaysCard } from "../../../../sections/overview/gateways-card";
import { Suspense } from "react";
import { StatCards } from "../../../../sections/overview/stat-cards";
import {
  CardsSkeleton,
  GatewaysCardSkeleton,
} from "../../../../sections/skeletons";

export default function OverviewPage() {
  return (
    <>
      <Stack gap="xs" className="mb-6">
        <Title className="tracking-tight text-gray-900 dark:text-gray-100 text-2xl lg:text-4xl font-semibold">
          Payment Gateway Overview
        </Title>
        <Text c="dimmed">Monitor and manage your payment infrastructure</Text>
      </Stack>

      <Suspense fallback={<CardsSkeleton />}>
        <StatCards />
      </Suspense>
      <Suspense fallback={<GatewaysCardSkeleton />}>
        <GatewaysCard />
      </Suspense>
    </>
  );
}
