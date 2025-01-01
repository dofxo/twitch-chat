"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useTheme } from "../../hooks/useTheme";
import { themes } from "./themes";

const Header = () => {
  const themeFromLocalStorage = localStorage.getItem("theme") || "primary";
  const setTheme = useTheme(themeFromLocalStorage);

  return (
    <header className="shadow p-3">
      <div className="container flex justify-between">
        <h1>Twitch Chat Overlay</h1>
        <Popover>
          <PopoverTrigger className="rounded-full bg-[var(--bg-color)] shadow-[inset_0_0_2px_0_#222000]  w-[20px] h-[20px]"></PopoverTrigger>
          <PopoverContent className="bg-[var(--bg-color)] flex gap-5 shadow shadow-gray-500 p-2 rounded right-0 top-[15px] w-[max-content] absolute">
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
