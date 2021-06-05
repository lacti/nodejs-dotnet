import * as childProcess from "child_process";

import ensureBridge, { bridgeName, bridgePath } from "./ensureBridge";

import findProcess from "./findProcess";
import sleep from "./sleep";

export default async function renewBridge() {
  const pid = await findProcess({ processName: bridgeName });
  if (pid) {
    console.debug({ pid }, "Kill old bridge");
    process.kill(pid);
  }
  await ensureBridge();

  console.info({ bridgePath }, "Spawn new bridge");

  const bridgeProcess = childProcess.spawn(bridgePath, [], {
    detached: true,
    stdio: "ignore",
  });
  bridgeProcess.unref();
  await sleep(1000);

  const newPid = await findProcess({ processName: bridgeName });
  console.info({ newPid }, "OK");
}

if (require.main === module) {
  renewBridge()
    .then((result) => console.info({ result }))
    .catch((error) => console.error({ error }));
}
