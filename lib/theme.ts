export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const listeners = new Set<() => void>();

export function setTheme(theme: Theme): void {
  document.documentElement.classList.toggle("light", theme === "light");
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage blocked (privacy mode / disabled storage) — the theme still
    // applies for this page's lifetime, it just won't survive a reload.
  }
  listeners.forEach((listener) => listener());
}

export function subscribeToTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}
