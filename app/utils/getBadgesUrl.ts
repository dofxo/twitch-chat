export type badgeDataType = { badgeName: string; badgeUrl: string | null }[];

export const scrapeBadgeData = async (channel: string) => {
  try {
    // Fetch the page content using fetch API
    const globalBadgesPage = await fetch(
      "https://www.streamdatabase.com/twitch/global-badges",
    );

    const streamerPage = await fetch(
      `https://www.streamdatabase.com/twitch/channels/${channel}`,
    );

    const globalBadgesPageData = await globalBadgesPage.text();
    const streamerPageData = await streamerPage.text();

    // Parse the HTML using DOMParser
    const parser = new DOMParser();

    const globalBadgesDoc = parser.parseFromString(
      globalBadgesPageData,
      "text/html",
    );

    const streamerPageDoc = parser.parseFromString(
      streamerPageData,
      "text/html",
    );

    const badgeData: badgeDataType = [];

    const streamerSubBadgeElements = streamerPageDoc.querySelectorAll(
      "a.text-decoration-none",
    );

    streamerSubBadgeElements.forEach((element: any) => {
      if (!element.href.includes("channel-badges")) return;
      const badgeName = element.href.split("channel-badges/")[1];
      const image = element.querySelector("img")!;

      const badgeUrl = image ? image.src : null;

      if (badgeName) {
        badgeData.push({ badgeName, badgeUrl });
      }
    });

    // Find all badge images and extract their src attribute from global badges
    const badgeElements = globalBadgesDoc.querySelectorAll(
      "a.text-decoration-none",
    );
    badgeElements.forEach((element: any) => {
      const badgeName = element.href.split("global-badges/")[1];
      const image = element.querySelector("img")!;

      const badgeUrl = image ? image.src : null;

      if (badgeName) {
        badgeData.push({ badgeName, badgeUrl });
      }
    });

    return badgeData;
  } catch (error) {
    console.error("Error scraping badge data:", error);
  }
};

export const getBadgeUrl = (badgeName: string, badgesData: badgeDataType) => {
  if (badgesData) {
    return badgesData.find((badge) => badge.badgeName === badgeName)?.badgeUrl;
  }
};
