import { Card, Grid, GridCol, Group, Text, ThemeIcon } from "@mantine/core";
import { mockStats } from "../data/mock-datas";
import { sleep } from "../_utils/sleep";

export const StatCards = async () => {
  await sleep(1000);
  return (
    <Grid gutter="md" className="mb-8">
      {mockStats.map(({ title, value, subtitle, icon: Icon }) => (
        <GridCol key={title} span={{ base: 12, sm: 6, md: 3 }}>
          <Card
            withBorder
            radius="md"
            className="shadow-md dark:text-white hover:shadow-lg transition-shadow py-6 px-4 bg-slate-200/50 dark:bg-slate-950/50"
          >
            <Group align="flex-start" justify="space-between">
              <div className="flex flex-col ">
                <Text
                  size="sm"
                  fw={500}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {title}
                </Text>
                <Text
                  fw={700}
                  className="text-lg text-gray-900 dark:text-white mt-6"
                >
                  {value}
                </Text>
                <Text size="xs" c="cyan" fw={500}>
                  {subtitle}
                </Text>
              </div>
              <ThemeIcon
                size={28}
                radius="md"
                variant="light"
                color={title.toLowerCase().includes("failed") ? "red" : "green"}
              >
                <Icon size={16} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>
      ))}
    </Grid>
  );
};
