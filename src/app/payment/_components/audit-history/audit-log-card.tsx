import { Badge, Card, ScrollArea, Table, Text, Title } from "@mantine/core";
import { sleep } from "../../_utils/sleep";
import { logs } from "../../data/mock-datas";

export const AuditLogCard = async () => {
  await sleep(2500);
  return (
    <Card
      shadow="sm"
      radius="md"
      padding="lg"
      className="bg-slate-200/70 dark:bg-slate-950/50 shadow-lg dark:text-slate-100"
    >
      <Title order={4} mb="sm">
        Audit Log
      </Title>
      <Text size="sm" color="dimmed" mb="md">
        Detailed audit trail of all system changes
      </Text>
      <ScrollArea>
        <Table highlightOnHover verticalSpacing="sm" striped>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Gateway</th>
              <th>User</th>
              <th>IP Address</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="font-mono text-sm">{log.timestamp}</td>
                <td>
                  <Badge variant="outline">{log.action}</Badge>
                </td>
                <td>{log.gateway}</td>
                <td>{log.user}</td>
                <td className="font-mono text-sm">{log.ip}</td>
                <td>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </Card>
  );
};
