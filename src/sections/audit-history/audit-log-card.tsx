import { Badge, Card, ScrollArea, Table, Text, Title } from "@mantine/core";
import { sleep } from "../../utils/sleep";
import { logs } from "../../services/data-for-gateway-settings/mock-datas";

export const AuditLogCard = async () => {
  await sleep(2500);
  return (
    <Card
      shadow="sm"
      radius="md"
      padding="lg"
      className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100"
    >
      <Title order={4} mb="sm" className="text-base sm:text-lg">
        Audit Log
      </Title>
      <Text size="sm" color="dimmed" mb="md" className="text-xs sm:text-sm">
        Detailed audit trail of all system changes
      </Text>
      <ScrollArea>
        <div className="min-w-[800px]">
          <Table highlightOnHover verticalSpacing="sm" striped>
            <thead>
              <tr>
                <th className="text-xs sm:text-sm">Timestamp</th>
                <th className="text-xs sm:text-sm">Action</th>
                <th className="text-xs sm:text-sm">Gateway</th>
                <th className="text-xs sm:text-sm">User</th>
                <th className="text-xs sm:text-sm hidden sm:table-cell">
                  IP Address
                </th>
                <th className="text-xs sm:text-sm">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td className="font-mono text-xs">{log.timestamp}</td>
                  <td>
                    <Badge variant="outline" size="xs">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="text-xs sm:text-sm">{log.gateway}</td>
                  <td className="text-xs sm:text-sm">{log.user}</td>
                  <td className="font-mono text-xs hidden sm:table-cell">
                    {log.ip}
                  </td>
                  <td className="text-xs sm:text-sm max-w-[200px] truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </ScrollArea>
    </Card>
  );
};
