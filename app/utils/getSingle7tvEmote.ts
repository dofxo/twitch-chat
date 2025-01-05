type EmoteFile = {
  name: string;
  url: string;
};

type Emote = {
  id: string;
  name: string;
  data: {
    host: {
      files: EmoteFile[];
    };
  };
};

type EmoteSet = {
  emotes: Emote[];
};

type EmoteData = {
  emote_set: EmoteSet;
};

export const getEmoteUrlByName = (
  emoteData: EmoteData,
  emoteName: string,
  size = "3x",
): string | null => {
  // Find the emote by name
  const emote = emoteData.emote_set.emotes.find((e) => e.name === emoteName);

  if (emote) {
    // Find the file with the specified size
    const file = emote.data.host.files.find((file) => file.name.includes(size));

    if (file) {
      return `https://cdn.7tv.app/emote/${emote.id}/${file.name}`;
    }
  }

  return null;
};
