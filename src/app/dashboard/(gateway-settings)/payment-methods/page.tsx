import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import { PaymentMethodsContent } from "@/sections/payment-methods/payment-methods-content";
import { sleep } from "@/utils/sleep";

export default async function PaymentMethodsPage() {
  await sleep(3000);

  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold leading-tight">
          Métodos de Pago
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Configure qué métodos de pago están disponibles para los clientes
        </p>
      </div>

      <Card className="bg-slate-200/70 mt-4 sm:mt-6  sm:p-6 dark:bg-slate-950/50 dark:text-slate-100 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Configuración de Métodos de Pago
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Active, desactive y reordene los métodos de pago disponibles para sus clientes en el proceso de pago.
          </CardDescription>
        </CardHeader>

        <PaymentMethodsContent />
      </Card>
    </>
  );
}
