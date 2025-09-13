import { Text, Title, Group } from "@mantine/core";
// import { Filter, Download } from "lucide-react";
import { RecentActivityCard } from "../_components/audit-history/recent-activity-card";
import { AuditLogCard } from "../_components/audit-history/audit-log-card";
import { ConfigChangesCard } from "../_components/audit-history/config-changes-card";
import { activities, changes, logs } from "../data/mock-datas";
import { Suspense } from "react";
import {
  AuditLogCardSkeleton,
  ConfigChangesCardSkeleton,
  RecentActivityCardSkeleton,
} from "../_components/skeletons";

export default function AuditHistoryPage() {
  return (
    <div className="space-y-6">
      <Group>
        <div>
          <Title
            order={2}
            className="text-gray-900 dark:text-gray-100 text-3xl font-bold"
          >
            Audit & History
          </Title>
          <Text c="dimmed">
            Track all payment configuration changes and access logs
          </Text>
        </div>
        {/* <Group gap="sm">
          <Button variant="outline">
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="outline">
            <Download size={16} /> Export
          </Button>
        </Group> */}
      </Group>

      <div className="grid grid-cols-1 lg:grid-cols-[25vw_1fr] gap-6">
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
