"use client";

import { useEffect, useState } from "react";

interface Message {
  channel: string;
  displayName: string;
  content: string;
}

const Chats: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const channel = "dofxo";

  useEffect(() => {
    const eventSource = new EventSource(`/api/twitchChat?channel=${channel}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "chat") {
          setMessages((prev) => [...prev, data]);
        }
      } catch (error) {
        console.error("Error processing SSE:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Error receiving SSE:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [channel]);

  return (
    <section>
      <div className="container flex flex-col gap-4">
        <div className="chat-box border p-4 rounded bg-gray-100 shadow">
          <h2 className="font-bold mb-2 text-lg text-purple-600">
            Channel: {channel}
          </h2>
          <div className="messages space-y-2 max-h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="message p-2 bg-white rounded shadow">
                <span className="font-semibold text-blue-500">
                  {msg.displayName}:
                </span>
                <span className="text-gray-800">{msg.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chats;
