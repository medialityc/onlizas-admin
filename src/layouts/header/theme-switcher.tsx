"use client";
import { useTheme } from "next-themes";
import IconLaptop from "@/components/icon/icon-laptop";
import IconMoon from "@/components/icon/icon-moon";
import IconSun from "@/components/icon/icon-sun";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {theme === "light" && (
        <button
          className="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
          onClick={() => setTheme("dark")}
        >
          <IconSun />
        </button>
      )}
      {theme === "dark" && (
        <button
          className="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
          onClick={() => setTheme("system")}
        >
          <IconMoon />
        </button>
      )}
      {theme === "system" && (
        <button
          className="flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
          onClick={() => setTheme("light")}
        >
          <IconLaptop />
        </button>
      )}
    </div>
  );
}
