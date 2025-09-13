import { Card, Group, Stack, Text, Title } from "@mantine/core";
import { sleep } from "../../_utils/sleep";
import { activities } from "../../data/mock-datas";

export const RecentActivityCard = async () => {
  await sleep(2000);
  return (
    <Card
      shadow="sm"
      radius="md"
      padding="lg"
      className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100"
    >
      <Title order={4} mb="md">
        Recent Activity
      </Title>
      <Stack gap="sm">
        {activities.map((activity, index) => (
          <Group key={index} align="flex-start" gap="sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div className="flex-1">
              <Text fw={500} size="sm">
                {activity.action}
              </Text>
              <Text size="sm" color="dimmed">
                {activity.gateway} • {activity.user}
              </Text>
              <Text size="xs" color="dimmed">
                {activity.time}
              </Text>
            </div>
          </Group>
        ))}
      </Stack>
    </Card>
  );
};
