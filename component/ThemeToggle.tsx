"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { setTheme, subscribeToTheme, getCurrentTheme, type Theme } from "@/lib/theme";

function getServerSnapshot(): Theme {
  return "dark";
}

interface ThemeToggleProps {
  // When true, renders as a full labeled row (icon + text) suitable for
  // a menu list, matching the sibling menu items' exact styling and
  // carrying role="menuitem". When false/omitted, renders as the bare
  // icon-only button used in the desktop nav row (unchanged behavior).
  variant?: "icon" | "menuitem";
}

export default function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribeToTheme, getCurrentTheme, getServerSnapshot);

  function handleToggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const Icon = theme === "dark" ? Moon : Sun;
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  if (variant === "menuitem") {
    return (
      <button
        type="button"
        role="menuitem"
        onClick={handleToggle}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-fg-secondary hover:bg-surface-hover hover:text-fg transition-colors duration-200"
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      className="text-fg-secondary hover:text-fg transition-colors duration-200"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
