import { Socket } from "net";

export default class BridgeConnection {
  private readonly socket: Socket;
  private currentBuffer = "";

  constructor(
    private readonly onLine: (line: string) => void,
    private readonly onDisconnect: () => void
  ) {
    this.socket = new Socket();
    this.socket.connect(7776);
    this.socket.on("data", this.onData);
    this.socket.on("close", this.onDisconnect);
    this.socket.on("error", (error) =>
      console.error({ error }, "Socket error")
    );
  }

  public onData = (data: Buffer) => {
    this.currentBuffer += data.toString("utf-8");
    const newlineIndex = this.currentBuffer.indexOf("\n");
    if (newlineIndex >= 0) {
      const line = this.currentBuffer.substring(0, newlineIndex).trim();
      console.debug({ line }, "Received");
      this.onLine(line);
    }
  };

  public send = (line: string) =>
    this.socket.write(Buffer.from(line + "\n", "utf8"));

  public disconnect = () => this.socket.destroy();
}
