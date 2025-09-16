import { sleep } from "../../utils/sleep";
import { gatewayTests } from "../../services/data-for-gateway-settings/mock-datas";
import { GatewayTestCard } from "./gateway-test-card";

export const GatewayTestList = async () => {
  await sleep(2000);
  return (
    <>
      {gatewayTests.map((test) => (
        <GatewayTestCard key={test.name} test={test} />
      ))}
    </>
  );
};
