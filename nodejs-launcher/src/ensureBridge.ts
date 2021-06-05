import * as fs from "fs";

import tar from "tar";

export const bridgeName = "dotnet-bridge";
export const bridgePath = `/tmp/${bridgeName}`;
const bridgePackFile = "dotnet-bridge.tar.gz";

export default async function ensureBridge(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(bridgePath)) {
      console.debug({ bridgePath }, "Already exists");
      return resolve();
    }
    console.debug({ bridgePath, bridgePackFile }, "Unpack bridge");
    fs.createReadStream(bridgePackFile)
      .pipe(tar.x({ C: "/tmp" }).on("error", reject).on("close", resolve))
      .on("error", reject);
  });
}

if (require.main === module) {
  ensureBridge()
    .then(() => console.info("OK"))
    .catch((error) => console.error({ error }));
}
