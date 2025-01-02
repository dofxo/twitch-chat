"use client";

import { useEffect, useState } from "react";
import { getBadgeURL } from "./badgeUrl";
import { get7tvEmotes } from "@/app/utils/getEmotes";
import { getEmoteUrlByName } from "@/app/utils/getSingle7tvEmote";

import Image from "next/image";

interface Message {
  channel: string;
  displayName: string;
  content: string;
}

const Chats: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [avatar, setAvatar] = useState(null);

  const [loading, setLoading] = useState(false);
  const channel = "gorgc";

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const { emotesList, avatarUrl } = await get7tvEmotes(channel);
        setAvatar(avatarUrl);

        const eventSource = new EventSource(
          `/api/twitchChat?channel=${channel}`,
        );

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // convert data and replace emotes with their image url
            data.content = data.content
              .split(" ")
              .map((msg: string) => {
                const emote = getEmoteUrlByName(emotesList, msg);
                if (emote) {
                  return emote;
                } else {
                  return msg;
                }
              })
              .join(" ");

            if (data.type === "chat") {
              setMessages((prev) => [...prev, data]);
            }
          } catch (error) {
            console.error("Error processing SSE:", error);
          }
        };
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [channel]);

  return (
    <section>
      <div className="container flex flex-col gap-4">
        <div className="chat-box border p-4 rounded bg-gray-100 shadow grid">
          {!loading ? (
            <>
              <h2 className="font-bold mb-2 text-lg text-purple-600 flex items-center gap-2">
                <Image
                  width={100}
                  height={100}
                  className="rounded-full"
                  alt={channel}
                  src={avatar ?? "/images/default-avatar.png"}
                />
                <span>{channel}</span>
              </h2>
              <div className="messages space-y-2 max-h-[75vh] overflow-y-auto">
                {messages.map((msg: any, index) => (
                  <div
                    key={index}
                    className="message p-2 bg-white rounded shadow flex items-center gap-2"
                  >
                    <div className="badges flex items-center gap-2">
                      {/* {msg.chatInfo.badges && */}
                      {/*   Object.keys(msg.chatInfo.badges).map((badge, idx) => ( */}
                      {/*     <Image */}
                      {/*       width={20} */}
                      {/*       height={20} */}
                      {/*       alt={badge} */}
                      {/*       key={idx} */}
                      {/*       src={getBadgeURL(badge)} */}
                      {/*     /> */}
                      {/*   ))} */}
                    </div>
                    <span
                      className="font-semibold"
                      style={{ color: msg?.chatInfo?.color ?? "gray" }}
                    >
                      {msg.chatInfo["display-name"]}:
                    </span>
                    <span className="text-gray-800 flex items-center gap-2">
                      {msg.content.split(" ").map((msg: string) => {
                        if (msg.startsWith("https://cdn.7tv.app/")) {
                          return (
                            <Image
                              width={60}
                              height={60}
                              alt="7tvEmote"
                              src={msg}
                            />
                          );
                        } else {
                          return msg + " ";
                        }
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="loader justify-self-center"></div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Chats;
