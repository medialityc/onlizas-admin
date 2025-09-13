import { Text, Title, Box, Stack } from "@mantine/core";
import { GatewaysCard } from "../_components/overview/gateways-card";
import { Suspense } from "react";
import { StatCards } from "../_components/stat-cards";
import { CardsSkeleton, GatewaysCardSkeleton } from "../_components/skeletons";

export default function OverviewPage() {
  return (
    <Box className="mx-auto max-w-[100rem] ">
      <Stack gap="xs" className="mb-6">
        <Title className="tracking-tight text-gray-900 dark:text-gray-100 text-4xl font-semibold">
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
    </Box>
  );
}
