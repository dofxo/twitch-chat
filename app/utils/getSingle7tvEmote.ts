export const getEmoteUrlByName = (
  emoteData: any,
  emoteName: string,
  size = "3x",
) => {
  // Find the emote by name
  const emote = emoteData.emote_set.emotes.find(
    (e: any) => e.name == emoteName,
  );

  if (emote) {
    // Find the file with the specified size
    const file = emote.data.host.files.find((file: any) =>
      file.name.includes(size),
    );

    if (file) {
      return `https://cdn.7tv.app/emote/${emote.id}/${file.name}`;
    }
  } else {
    console.error("Emote not found.");
    return null;
  }
};
