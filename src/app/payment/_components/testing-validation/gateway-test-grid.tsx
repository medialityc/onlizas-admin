import { sleep } from "../../_utils/sleep";
import { gatewayTests } from "../../data/mock-datas";
import { GatewayTestCard } from "./gateway-test-card";

export const GatewayTestGrid = async () => {
  await sleep(2000);
  return (
    <>
      {gatewayTests.map((test) => (
        <GatewayTestCard key={test.name} test={test} />
      ))}
    </>
  );
};
