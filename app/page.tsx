import { cookies } from "next/headers";

import Chats from "./components/chat/Chats";
import Header from "./components/header/Header";

const page = async () => {
  // receive cookies to use it for theme
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme");

  return (
    <>
      <Header theme={theme} />
      <main className="grid gap-[24px] mt-[20px]">
        <Chats />
      </main>
    </>
  );
};

export default page;
