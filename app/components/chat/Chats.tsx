"use client";

import { useEffect, useState } from "react";

interface Message {
  channel: string;
  displayName: string;
  content: string;
}

const Chats: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const channel = "subroza";

  useEffect(() => {
    const eventSource = new EventSource(`/api/twitchChat?channel=${channel}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data.chatInfo);

        if (data.type === "chat") {
          setMessages((prev) => [...prev, data]);
        }
      } catch (error) {
        console.error("Error processing SSE:", error);
      }
    };
  }, [channel]);

  return (
    <section>
      <div className="container flex flex-col gap-4">
        <div className="chat-box border p-4 rounded bg-gray-100 shadow">
          <h2 className="font-bold mb-2 text-lg text-purple-600">
            Channel: {channel}
          </h2>
          <div className="messages space-y-2 max-h-64 overflow-y-auto">
            {messages.map((msg: any, index) => (
              <div key={index} className="message p-2 bg-white rounded shadow">
                <span
                  className="font-semibold"
                  style={{ color: msg.chatInfo.color ?? "gray" }}
                >
                  {msg.chatInfo["display-name"]}:
                </span>
                <span className="text-gray-800"> {msg.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chats;
