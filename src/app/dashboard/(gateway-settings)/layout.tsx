import { Box } from "@mantine/core";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box className="p-2 mx-auto max-w-[100rem]">{children}</Box>;
}
