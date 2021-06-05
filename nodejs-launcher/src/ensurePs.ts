import * as fs from "fs";

import tar from "tar";

export const psPath = `/tmp/bin/ps`;
const psPackFile = "exodus-ps-bundle.tgz";

export default async function ensurePs(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(psPath)) {
      console.debug({ psPath }, "Already exists");
      return resolve();
    }
    console.debug({ psPath, psPackFile }, "Unpack ps");
    fs.createReadStream(psPackFile)
      .pipe(
        tar.x({ C: "/tmp", strip: 1 }).on("error", reject).on("close", resolve)
      )
      .on("error", reject);
  });
}

if (require.main === module) {
  ensurePs()
    .then(() => console.info("OK"))
    .catch((error) => console.error({ error }));
}
