import axios from "axios";

export const getUserAvatar = async (username: string) => {
  const { data: avatarUrl } = await axios.get(
    `https://decapi.me/twitch/avatar/${username}`,
  );

  return avatarUrl;
};
