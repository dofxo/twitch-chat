"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { changeTheme } from "../../utils/changeTheme";
import { themes } from "./themes";
import { Paintbrush } from "lucide-react";
import { useEffect } from "react";

const Header = ({ theme }: { theme: string }) => {
  useEffect(() => {
    changeTheme(theme);
  }, []);

  return (
    <header className="shadow p-3">
      <div className="container flex justify-between items-center">
        <h1 className="font-bold text-2xl text-[--text-color]">Twitch Chat</h1>
        <Popover>
          <PopoverTrigger>
            <Paintbrush color="var(--text-color)" />
          </PopoverTrigger>
          <PopoverContent className="bg-[var(--bg-color)] flex max-w-[200px] flex-wrap gap-5 shadow shadow-gray-500 p-2 rounded right-[100%] top-2  w-[max-content] absolute">
            {themes.map((theme) => (
              <div
                key={theme.colorScheme}
                onClick={() => changeTheme(theme.themeName)}
                style={{ backgroundColor: theme.colorScheme }}
                className={`w-[20px] h-[20px] shadow-[inset_0_0_2px_0_#222000] rounded-full cursor-pointer`}
              />
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
