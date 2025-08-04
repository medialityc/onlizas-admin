
import { OrderProvider } from "@/sections/order/create/order-context"
import { OrderFlow } from "@/sections/order/create/order-flow"

export default function Home() {
  return (
    <div className="min-h-screen">
      <OrderProvider>
        <OrderFlow />
      </OrderProvider>
    </div>
  )
}
