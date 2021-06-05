import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import BridgeConnection from "./BridgeConnection";
import renewBridge from "./renewBridge";

export const runBridge: APIGatewayProxyHandlerV2 = async (event) => {
  const recv = await bridgeOne({
    message: event.queryStringParameters?.message ?? "Hi",
  });
  return { statusCode: 200, body: JSON.stringify({ recv }) };
};

async function bridgeOne({ message }: { message: string }): Promise<string> {
  await renewBridge();
  return new Promise<string>((resolve, reject) => {
    const connection = new BridgeConnection(
      (line) => {
        console.info({ line }, "OK!");
        resolve(line);
        connection.disconnect();
      },
      () => {
        console.info({}, "Disconneced");
        reject();
      }
    );
    connection.send(message);
  });
}

if (require.main === module) {
  (async () => {
    const recv = await bridgeOne({ message: "HI THERE" });
    console.info(recv);
  })().catch(console.error);
}
