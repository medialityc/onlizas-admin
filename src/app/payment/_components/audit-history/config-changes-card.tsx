import { Card, Group, Stack, Text, Title } from "@mantine/core";
import { changes } from "../../data/mock-datas";
import { sleep } from "../../_utils/sleep";

export const ConfigChangesCard = async () => {
  await sleep(3000);
  return (
    <Card
      shadow="sm"
      radius="md"
      padding="lg"
      className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100"
    >
      <Title order={4} mb="sm">
        Configuration Changes
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Track changes to gateway configurations with before/after comparisons
      </Text>
      <Stack gap="md">
        {changes.map((change, index) => (
          <Card
            key={index}
            radius="md"
            padding="md"
            withBorder
            className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100"
          >
            <Group mb="sm">
              <Text fw={500}>
                {change.gateway} - {change.field}
              </Text>
              <Text size="sm" c="dimmed">
                {change.timestamp}
              </Text>
            </Group>
            <div className="grid grid-cols-2 gap-4 text-sm ">
              <div className="">
                <Text c="dimmed">Before:</Text>
                <Text className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
                  {change.oldValue}
                </Text>
              </div>
              <div>
                <Text c="dimmed">After:</Text>
                <Text className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
                  {change.newValue}
                </Text>
              </div>
            </div>
            <Text size="sm" c="dimmed" mt="sm">
              Changed by: {change.user}
            </Text>
          </Card>
        ))}
      </Stack>
    </Card>
  );
};
