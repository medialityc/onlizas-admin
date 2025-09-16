import { Text, Title } from "@mantine/core";
import { GatewaysTab } from "@/sections/payment-gateway/gateway-tab";

export default function PaymentgatewayPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Title
            order={1}
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold"
          >
            Payment Gateways
          </Title>
          <Text c="dimmed" className="text-sm sm:text-base">
            Configure and manage payment gateway credentials
          </Text>
        </div>
      </div>

      <GatewaysTab />
    </>
  );
}
