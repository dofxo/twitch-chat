import { NextRequest, NextResponse } from "next/server";
import tmi from "tmi.js";

const connectedChannels: Set<string> = new Set();

export async function GET(req: NextRequest) {
  const channel = req.nextUrl.searchParams.get("channel") || "naiyanaa";

  return new NextResponse(
    new ReadableStream({
      start(controller) {
        const sendMessage = (message: string) => {
          controller.enqueue(`data: ${message}\n\n`);
        };

        sendMessage(
          JSON.stringify({
            type: "info",
            message: `Connected to ${channel} chat`,
          }),
        );

        const onMessage = (
          channelName: string,
          userstate: tmi.Userstate,
          message: string,
        ) => {
          if (channelName.slice(1) === channel) {
            sendMessage(
              JSON.stringify({
                type: "chat",
                channel: channelName,
                displayName: (userstate as any)["display-name"],
                content: message,
              }),
            );
          }
        };

        if (!connectedChannels.has(channel)) {
          connectedChannels.add(channel);

          const client = new tmi.Client({
            connection: { reconnect: true },
            channels: [channel],
          });

          client.connect();
          client.on("message", onMessage);
        }
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    },
  );
}
