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

const Header = ({ theme }: { theme: { name: string; value: string } }) => {
  useEffect(() => {
    changeTheme(theme.value ?? "primary");
  }, []);

  return (
    <header className="shadow p-3">
      <div className="container flex justify-between items-center">
        <h1>Twitch Chat Overlay</h1>
        <Popover>
          <PopoverTrigger>
            <Paintbrush />
          </PopoverTrigger>
          <PopoverContent className="bg-[var(--bg-color)] flex gap-5 shadow shadow-gray-500 p-2 rounded right-[50%] translate-x-[50%] top-2  w-[max-content] absolute">
            {themes.map((theme) => (
              <div
                key={theme.colorScheme}
                onClick={() => changeTheme(`${theme.themeName}`)}
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
