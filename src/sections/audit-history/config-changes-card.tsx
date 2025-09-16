import { Card, Stack, Text, Title } from "@mantine/core";
import { changes } from "../../services/data-for-gateway-settings/mock-datas";
import { sleep } from "../../utils/sleep";

export const ConfigChangesCard = async () => {
  await sleep(3000);
  return (
    <Card
      shadow="sm"
      radius="md"
      padding="lg"
      className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100"
    >
      <Title order={4} mb="sm" className="text-base sm:text-lg">
        Configuration Changes
      </Title>
      <Text size="sm" c="dimmed" mb="md" className="text-xs sm:text-sm">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-1 sm:space-y-0">
              <Text fw={500} className="text-sm sm:text-base">
                {change.gateway} - {change.field}
              </Text>
              <Text size="sm" c="dimmed" className="text-xs sm:text-sm">
                {change.timestamp}
              </Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <Text c="dimmed" className="text-xs sm:text-sm">
                  Before:
                </Text>
                <Text className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 text-xs sm:text-sm break-all">
                  {change.oldValue}
                </Text>
              </div>
              <div>
                <Text c="dimmed" className="text-xs sm:text-sm">
                  After:
                </Text>
                <Text className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1 text-xs sm:text-sm break-all">
                  {change.newValue}
                </Text>
              </div>
            </div>
            <Text size="sm" c="dimmed" mt="sm" className="text-xs sm:text-sm">
              Changed by: {change.user}
            </Text>
          </Card>
        ))}
      </Stack>
    </Card>
  );
};
