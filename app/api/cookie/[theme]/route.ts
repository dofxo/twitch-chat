import { cookies } from "next/headers";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ theme: string }> },
) {
  // get theme name from url
  const { theme } = await params;

  const cookieStore = await cookies();

  // set cookie
  cookieStore.set("theme", theme);

  return new Response(`${theme} theme has been set!`, { status: 200 });
}
