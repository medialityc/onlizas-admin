import { Box, Button, Text, Title } from "@mantine/core";
import { GatewaysTab } from "../_components/payment-gateway/gateway-tab";
import { Plus } from "lucide-react";

export default function PaymentgatewayPage() {
  return (
    <Box className="mx-auto max-w-[100rem]  relative">
      <div>
        <Title order={1} className="text-4xl font-semibold">
          Payment Gateways
        </Title>
        <Text c="dimmed">Configure and manage payment gateway credentials</Text>
      </div>
      <Button className="flex ml-auto items-center space-x-2 bg-green-500 hover:bg-green-600 gap-2 px-4 py-2">
        <Plus size={16} />
        <span>Add Gateway</span>
      </Button>

      <GatewaysTab />
    </Box>
  );
}
