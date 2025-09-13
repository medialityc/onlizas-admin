import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import { Box, Button } from "@mantine/core";
import { PaymentMethodsContent } from "./ui/payment-methods-content";
import { sleep } from "../_utils/sleep";

export default async function PaymentMethodsPage() {
  await sleep(3000);
  return (
    <Box className="mx-auto max-w-[100rem] ">
      <div>
        <h2 className="text-3xl font-bold">Payment Methods</h2>
        <p>Configure which payment methods are available to customers</p>
      </div>

      <Card className="bg-slate-200/70 dark:bg-slate-950/50 dark:text-slate-100 shadow-lg">
        <CardHeader>
          <CardTitle>Store Payment Configuration</CardTitle>
          <CardDescription>
            Enable and prioritize payment methods for your store
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <PaymentMethodsContent />

          <Button className="w-full bg-green-500 hover:bg-green-600 ">
            Save Payment Method Configuration
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
