import { Text, Title } from "@mantine/core";
import { Suspense } from "react";
import {
  AuditLogCardSkeleton,
  ConfigChangesCardSkeleton,
  RecentActivityCardSkeleton,
} from "@/sections/skeletons";
import {
  AuditLogCard,
  ConfigChangesCard,
  RecentActivityCard,
} from "@/sections/audit-history";

export default function AuditHistoryPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2 sm:space-y-3">
        <div>
          <Title
            order={2}
            className="text-gray-900 dark:text-gray-100 text-xl sm:text-2xl lg:text-4xl font-bold leading-tight"
          >
            Audit & History
          </Title>
          <Text c="dimmed" className="text-sm sm:text-base">
            Track all payment configuration changes and access logs
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[30rem_1fr] gap-4 sm:gap-6">
        <Suspense fallback={<RecentActivityCardSkeleton />}>
          <RecentActivityCard />
        </Suspense>
        <Suspense fallback={<AuditLogCardSkeleton />}>
          <AuditLogCard />
        </Suspense>
      </div>

      <Suspense fallback={<ConfigChangesCardSkeleton />}>
        <ConfigChangesCard />
      </Suspense>
    </div>
  );
}
