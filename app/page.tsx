import { cookies } from "next/headers";

import Chats from "./components/chat/Chats";
import Header from "./components/header/Header";

const page = async () => {
  // receive cookies to use it for theme
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme") ?? {
    name: "theme",
    value: "primary",
  };

  return (
    <>
      <Header theme={theme.value} />
      <main className="grid gap-[24px] mt-[20px] mb-10">
        <Chats />
      </main>
    </>
  );
};

export default page;
