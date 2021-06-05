import ensurePs, { psPath } from "./ensurePs";

import execa from "execa";

export default async function findProcess({
  processName = "dotnet-bridge",
}: { processName?: string } = {}): Promise<number | null> {
  await ensurePs();
  const { stdout } = await execa(psPath, ["-A"]);
  const first = stdout.split(/\n/).find((line) => line.includes(processName));
  if (!first) {
    return null;
  }
  return +first.trim().split(/\s+/)[0];
}

if (require.main == module) {
  findProcess().then(console.info).catch(console.error);
}
