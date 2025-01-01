"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useTheme } from "../../hooks/useTheme";
import { themes } from "./themes";
import { Paintbrush } from "lucide-react";

const Header = () => {
  const themeFromLocalStorage = localStorage.getItem("theme") || "primary";
  const setTheme = useTheme(themeFromLocalStorage);

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
                onClick={() => setTheme(`${theme.themeName}`)}
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
