import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const channel = searchParams.get("channel");

  let url: string | undefined;

  // Determine the URL to fetch based on the type and channel
  if (type === "global-badges") {
    url = "https://www.streamdatabase.com/twitch/global-badges";
  } else if (type === "streamer" && channel) {
    url = `https://www.streamdatabase.com/twitch/channels/${channel}`;
  }

  if (!url) {
    return NextResponse.json(
      { error: "Invalid type or missing channel parameter" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}`);
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
