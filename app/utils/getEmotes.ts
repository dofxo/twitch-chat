import axios from "axios";

export const get7tvEmotes = async (username: string) => {
  const { data: userId } = await axios.get(
    `https://decapi.me/twitch/id/${username}`,
  );

  const { data: emotesList } = await axios.get(
    `https://7tv.io/v3/users/twitch/${userId}`,
  );

  const avatarUrl = emotesList.user.avatar_url;

  return { emotesList, avatarUrl };
};
