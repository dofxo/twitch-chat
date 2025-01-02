import { NextRequest, NextResponse } from "next/server";
import tmi from "tmi.js";

const connectedChannels: Set<string> = new Set();

export async function GET(req: NextRequest) {
  const channel = req.nextUrl.searchParams.get("channel") || "naiyanaa";

  return new NextResponse(
    new ReadableStream({
      start(controller) {
        let isStreamOpen = true; // Track whether the stream is open

        // Function to send message to the client only if the stream is open
        const sendMessage = (message: string) => {
          if (isStreamOpen) {
            try {
              controller.enqueue(`data: ${message}\n\n`);
            } catch (error) {
              console.error("Error enqueuing message:", error);
            }
          }
        };

        const onMessage = (
          channelName: string,
          userstate: tmi.Userstate,
          message: string,
        ) => {
          if (channelName.slice(1) === channel && isStreamOpen) {
            sendMessage(
              JSON.stringify({
                type: "chat",
                channel: channelName,
                chatInfo: userstate,
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

          // Handle disconnect by closing the stream
          client.on("disconnected", () => {
            if (isStreamOpen) {
              isStreamOpen = false; // Mark the stream as closed
              controller.close(); // Close the stream when disconnected
            }
          });
        }
      },

      cancel() {
        console.log("Stream cancelled.");
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
