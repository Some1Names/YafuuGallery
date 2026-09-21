"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    setThemeState(getStoredTheme() ?? "dark");
  }, []);

  function handleToggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
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
