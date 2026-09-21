"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { setTheme, subscribeToTheme, getCurrentTheme, type Theme } from "@/lib/theme";

function getServerSnapshot(): Theme {
  return "dark";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getCurrentTheme, getServerSnapshot);

  function handleToggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="text-fg-secondary hover:text-fg transition-colors duration-200"
    >
      {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
