import { Card, Stack, Text, Title } from "@mantine/core";
import { sleep } from "../../utils/sleep";
import { activities } from "../../services/data-for-gateway-settings/mock-datas";

export const RecentActivityCard = async () => {
  await sleep(2000);
  return (
    <Card
      shadow="sm"
      radius="md"
      padding="lg"
      className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100"
    >
      <Title order={4} mb="md" className="text-base sm:text-lg">
        Recent Activity
      </Title>
      <Stack gap="sm">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-2 sm:gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Text fw={500} size="sm" className="text-xs sm:text-sm truncate">
                {activity.action}
              </Text>
              <Text
                size="sm"
                color="dimmed"
                className="text-xs sm:text-sm truncate"
              >
                {activity.gateway} • {activity.user}
              </Text>
              <Text size="xs" color="dimmed" className="text-xs">
                {activity.time}
              </Text>
            </div>
          </div>
        ))}
      </Stack>
    </Card>
  );
};
