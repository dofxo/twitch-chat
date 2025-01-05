"use client";

import { useEffect, useRef, useState } from "react";
import { get7tvEmotes } from "@/app/utils/getEmotes";
import { getEmoteUrlByName } from "@/app/utils/getSingle7tvEmote";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getUserAvatar } from "@/app/utils/getUserAvatar";
import {
  badgeDataType,
  getBadgeUrl,
  scrapeBadgeData,
} from "@/app/utils/getBadgesUrl";

interface Message {
  channel: string;
  displayName: string;
  content: string;
  time: string;
  type: string;
  chatInfo: {
    badges: Record<string, string>;
    "display-name": string;
    color: string;
  };
  "first-msg"?: boolean;
}

const Chats: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [channel, setChannel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [badgeData, setBadgeData] = useState<badgeDataType | null>(null);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // makes sure to disconnect from twitch chat if there is any.
    if (eventSourceRef.current) eventSourceRef.current = null;

    if (!channel) return;
    (async () => {
      setLoading(true);

      try {
        const badgesData = await scrapeBadgeData(channel);
        if (badgesData) setBadgeData(badgesData);

        const emotesList = await get7tvEmotes(channel);

        const eventSource = new EventSource(
          `/api/twitchChat?channel=${channel}`,
        );

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.chatInfo) {
              const emotesRaw = data.chatInfo["emotes-raw"];
              if (emotesRaw) {
                const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${emotesRaw.split(":")[0]}/static/light/3.0`;
                const emotePlaces = emotesRaw.split(":")[1].split(",");

                let result = data.content;

                // Sort ranges in descending order by start index to avoid index shifting
                const sortedRanges = [...emotePlaces].sort((a, b) => {
                  const [startA] = a.split("-").map(Number);
                  const [startB] = b.split("-").map(Number);
                  return startB - startA;
                });

                sortedRanges.forEach((range) => {
                  const [start, end] = range.split("-").map(Number);
                  const before = result.slice(0, start);
                  const after = result.slice(end + 1);
                  result = before + emoteUrl + after;
                });

                data.content = result;
              }
            }

            // convert data and replace emotes with their image url for 7tv
            if (emotesList) {
              data.content = data.content
                .split(" ")
                .map((msg: string) => {
                  const emote = getEmoteUrlByName(emotesList.emotesList, msg);
                  if (emote) {
                    return emote;
                  } else {
                    return msg;
                  }
                })
                .join(" ");
            }

            // add time to chats
            data.time = new Date().toLocaleTimeString();

            if (data.type === "chat") {
              setMessages((prev) => [...prev, data]);
            }

            eventSourceRef.current = eventSource;
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

  useEffect(() => {
    if (isUserScrolling) return;

    const chatEndElement = chatContainerRef.current?.querySelector(".chat-end");
    chatEndElement?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isUserScrolling]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;

    // Check if the user has scrolled near the bottom
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

    setIsUserScrolling(!isAtBottom);
  };

  const disconnectChat = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setChannel("");
    setMessages([]);
    setAvatar(null);
  };

  return (
    <section>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="container flex flex-col gap-4">
        {!channel ? (
          <div className="input-wrapper flex gap-2">
            <Input
              placeholder="enter your streamer channel name"
              className="w-[200px]"
              ref={inputRef}
            />

            <Button
              disabled={buttonLoading}
              onClick={async () => {
                if (!inputRef.current) return;

                try {
                  setButtonLoading(true);
                  const channelName = inputRef.current.value;
                  setChannel(channelName);

                  const avatarUrl = await getUserAvatar(channelName);
                  setAvatar(avatarUrl);
                } catch {
                  toast.error("channel does not exist");
                } finally {
                  setButtonLoading(false);
                }
              }}
            >
              {buttonLoading && <Loader2 className="animate-spin" />}
              submit channel name
            </Button>
          </div>
        ) : (
          <div className="chat-box border p-4 rounded bg-gray-100 shadow grid">
            {!loading ? (
              <>
                <Button className="w-fit mb-10" onClick={disconnectChat}>
                  <ArrowLeft />
                </Button>
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
                <div
                  className="messages space-y-2 max-h-[75vh] overflow-y-auto"
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                >
                  {messages.map((msg: Message, index) => (
                    <div
                      key={index}
                      className="message p-2 bg-white rounded shadow flex items-center gap-2 relative flex-wrap"
                    >
                      <span className="text-gray-400 text-[12px]">
                        {msg.time}
                      </span>
                      <div className="badges flex items-center gap-2">
                        {msg.chatInfo.badges &&
                          Object.entries(msg.chatInfo.badges).map(
                            (badge, idx) => {
                              const combinedBadge = `${badge[0]}/${badge[1]}`;
                              const badgeUrl = getBadgeUrl(
                                combinedBadge,
                                badgeData as badgeDataType,
                              );

                              if (!badgeUrl) return null;
                              return (
                                <Image
                                  width={20}
                                  height={20}
                                  alt={badge[0]}
                                  key={idx}
                                  src={badgeUrl}
                                />
                              );
                            },
                          )}
                      </div>
                      <span
                        className="font-semibold"
                        style={{ color: msg?.chatInfo?.color ?? "gray" }}
                      >
                        {msg.chatInfo["display-name"]}:
                      </span>
                      <span className="messages text-gray-800 flex items-center gap-2 flex-wrap">
                        {msg["first-msg"] && (
                          <span className="absolute top-2 p-1 rounded right-2 first-message bg-[#8f24f2] text-gray-200 text-[12px]">
                            first message
                          </span>
                        )}
                        {msg.content
                          .split(" ")
                          .map((msg: string, idx: number) => {
                            if (
                              msg.startsWith("https://cdn.7tv.app/") ||
                              msg.startsWith("https://static-cdn.jtvnw.net/")
                            ) {
                              return (
                                <Image
                                  key={idx}
                                  width={40}
                                  height={40}
                                  alt="7tvEmote"
                                  src={msg}
                                  className="!w-max h-[50px]"
                                />
                              );
                            } else {
                              return msg + " ";
                            }
                          })}
                      </span>
                    </div>
                  ))}
                  <span className="chat-end"></span>
                </div>
              </>
            ) : (
              <div className="loader justify-self-center"></div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Chats;
