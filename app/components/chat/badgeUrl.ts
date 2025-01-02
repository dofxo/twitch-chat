const badgeURLs = {
  broadcaster:
    "https://static-cdn.jtvnw.net/badges/v1/4f974488-5ff6-44b4-9f4d-838000022a82/3",
  moderator:
    "https://static-cdn.jtvnw.net/badges/v1/6f56718d-b15a-49c7-836f-f8b31e86dc6d/3",
  vip: "https://static-cdn.jtvnw.net/badges/v1/7d86044c-717e-4555-9e94-bfe7bba0047d/3",
  subscriber:
    "https://static-cdn.jtvnw.net/badges/v1/1c0ca3df-9139-42b8-b258-ec01cc0b5bca/3",
  founder:
    "https://static-cdn.jtvnw.net/badges/v1/626fc509-97c0-441b-afd9-3fe0f2d5fbf8/3",
  premium:
    "https://static-cdn.jtvnw.net/badges/v1/75a156c6-b31c-463c-bd18-68dbbbc29b0f/3",
  bits: "https://static-cdn.jtvnw.net/badges/v1/f8e9b04e-9a3e-4bf7-9af7-83e2e34df034/3",
  staff:
    "https://static-cdn.jtvnw.net/badges/v1/01ac3eb0-067c-4d06-badc-eaeb2f66f10d/3",
  partner:
    "https://static-cdn.jtvnw.net/badges/v1/30c3647c-bf4c-4c3d-b899-bf22c3f722c6/3",
  glhf: "https://static-cdn.jtvnw.net/badges/v1/7a7cc3ec-12c8-42b1-a179-0ef50bd84c3b/3",
  recap:
    "https://static-cdn.jtvnw.net/badges/v1/9c35db80-2684-11eb-adc1-0242ac120002/3",
};

type BadgeType = keyof typeof badgeURLs;

export const getBadgeURL = (badgeType: BadgeType) => badgeURLs[badgeType];
