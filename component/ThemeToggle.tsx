"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { setTheme, subscribeToTheme, getCurrentTheme, type Theme } from "@/lib/theme";
import { useTranslations } from "next-intl";

function getServerSnapshot(): Theme {
  return "dark";
}

interface ThemeToggleProps {
  // When true, renders as a full labeled row (icon + text + switch)
  // suitable for the mobile dropdown, matching the sibling rows' styling.
  // When false/omitted, renders as the bare
  // icon-only button used in the desktop nav row (unchanged behavior).
  variant?: "icon" | "menuitem";
}

export default function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const t = useTranslations("Theme");
  const theme = useSyncExternalStore(subscribeToTheme, getCurrentTheme, getServerSnapshot);

  function handleToggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const Icon = theme === "dark" ? Moon : Sun;
  const label = theme === "dark" ? t("toLight") : t("toDark");

  if (variant === "menuitem") {
    // A fixed "Light mode" label with an on/off switch, rather than a
    // label that flips between "Switch to light/dark theme" — the switch
    // position already says which mode is active, and role="switch" +
    // aria-checked tells screen readers the same. The dropdown
    // deliberately stays open on click (only outside clicks, Escape and
    // route changes close it), so the knob visibly slides across.
    const isLight = theme === "light";
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        onClick={handleToggle}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-fg-secondary hover:text-fg transition-colors duration-200"
      >
        <Sun className="w-4 h-4 shrink-0" />
        <span className="whitespace-nowrap">{t("lightMode")}</span>
        <span
          aria-hidden="true"
          className={`ml-auto relative w-8 h-4.5 shrink-0 rounded-full transition-colors duration-200 ${
            isLight ? "bg-fg" : "bg-texture"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full transition-transform duration-200 motion-reduce:transition-none ${
              isLight ? "translate-x-3.5 bg-surface" : "translate-x-0 bg-fg-secondary"
            }`}
          />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center text-fg-secondary hover:text-fg transition-colors duration-200"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
