"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { CircleHelp, CircleX, Trash2, TriangleAlert, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// Site-styled replacements for the browser's confirm() and alert():
//
//   if (!(await confirmDialog({ title: "Delete chapter?", tone: "danger" }))) return;
//   await alertDialog({ title: "Couldn't delete user", message: err });
//
// Requests queue up in this module and <DialogHost /> (mounted once in the
// root layout) shows them one at a time in a native <dialog>, which gives
// focus trapping, Esc and an inert page behind it for free.

export type DialogMessageKey = "offline" | "notSignedIn" | "noPermission" | "serverError";

export type DialogTone = "danger" | "warning" | "question" | "error";

export interface DialogOptions {
  title: string;
  message?: string;
  // a standard message by key (Dialog.errors.* in messages/), for callers
  // outside React that can't translate themselves — alertRequestFailed
  messageKey?: DialogMessageKey;
  // monospace block under the message, e.g. a storage key
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: DialogTone;
}

interface DialogRequest extends DialogOptions {
  id: number;
  kind: "confirm" | "alert";
  resolve: (confirmed: boolean) => void;
}

let queue: DialogRequest[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getCurrent = () => queue[0] ?? null;
const getServerCurrent = () => null;

function request(kind: DialogRequest["kind"], options: DialogOptions): Promise<boolean> {
  // no host mounted (shouldn't happen — it's in the root layout): fall back
  // to the browser's own dialogs rather than hanging forever
  if (listeners.size === 0) {
    const text = [options.title, options.message, options.detail].filter(Boolean).join("\n\n");
    if (kind === "alert") {
      window.alert(text);
      return Promise.resolve(true);
    }
    return Promise.resolve(window.confirm(text));
  }
  return new Promise((resolve) => {
    queue = [...queue, { ...options, id: nextId++, kind, resolve }];
    emit();
  });
}

export function confirmDialog(options: DialogOptions): Promise<boolean> {
  return request("confirm", options);
}

export async function alertDialog(options: DialogOptions): Promise<void> {
  await request("alert", { tone: "error", ...options });
}

// For a request that failed:
//
//   const res = await fetch(url, { method: "DELETE" }).catch(() => null);
//   if (!res?.ok) return alertRequestFailed("Couldn't delete chapter", res);
//
// Shows the API's own { error } message when it sent one ("You can't delete
// your own account"), except for the terse "Not signed in"/"Forbidden" of
// a 401/403, which get a plain-words version. With no response at all
// (offline, server down) it says to check the connection.
export async function alertRequestFailed(title: string, res: Response | null): Promise<void> {
  const data = res ? await res.json().catch(() => null) : null;
  const messageKey: DialogMessageKey | null = !res
    ? "offline"
    : res.status === 401
      ? "notSignedIn"
      : res.status === 403
        ? "noPermission"
        : typeof data?.error === "string"
          ? null
          : "serverError";
  await alertDialog(messageKey ? { title, messageKey } : { title, message: data.error });
}

const TONES: Record<DialogTone, { icon: LucideIcon; ring: string }> = {
  danger: { icon: Trash2, ring: "bg-danger/15 text-danger-text" },
  error: { icon: CircleX, ring: "bg-danger/15 text-danger-text" },
  warning: { icon: TriangleAlert, ring: "bg-warning/15 text-warning" },
  question: { icon: CircleHelp, ring: "bg-fg/10 text-fg" },
};

export default function DialogHost() {
  const t = useTranslations("Dialog");
  const tCommon = useTranslations("Common");
  const current = useSyncExternalStore(subscribe, getCurrent, getServerCurrent);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const focusRef = useRef<HTMLButtonElement>(null);

  // open/close the native dialog to follow the queue, and lock the page's
  // scroll meanwhile (the gutter stays reserved so nothing shifts sideways)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current && !dialog.open) {
      dialog.showModal();
      const root = document.documentElement.style;
      root.setProperty("overflow", "hidden");
      root.setProperty("scrollbar-gutter", "stable");
    } else if (!current && dialog.open) {
      dialog.close();
      const root = document.documentElement.style;
      root.removeProperty("overflow");
      root.removeProperty("scrollbar-gutter");
    }
    // Destructive confirms start on Cancel so a stray Enter can't delete
    // anything; everything else starts on the main button.
    focusRef.current?.focus();
  }, [current]);

  function settle(confirmed: boolean) {
    const [first, ...rest] = queue;
    if (!first) return;
    queue = rest;
    emit();
    first.resolve(confirmed);
  }

  const tone = TONES[current?.tone ?? "question"];
  const Icon = tone.icon;
  const isConfirm = current?.kind === "confirm";
  const isDestructive = current?.tone === "danger" || current?.tone === "error";

  return (
    <dialog
      ref={dialogRef}
      // Lenis (smooth scroll) would otherwise keep scrolling the page behind
      data-lenis-prevent
      aria-labelledby="app-dialog-title"
      aria-describedby={current?.message || current?.messageKey ? "app-dialog-message" : undefined}
      onCancel={(e) => {
        // Esc: close through the queue, not the browser, so the promise settles
        e.preventDefault();
        settle(false);
      }}
      onClick={(e) => {
        // a click on the dimmed backdrop lands on the <dialog> itself
        if (e.target === e.currentTarget) settle(false);
      }}
      className="app-dialog m-auto w-[calc(100%-2rem)] max-w-sm max-h-[calc(100dvh-2rem)] p-0 bg-transparent text-fg overflow-visible backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {current && (
        <div
          key={current.id}
          className="app-dialog-panel max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl px-6 pt-7 pb-6 text-center"
        >
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${tone.ring}`}>
            <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
          </div>

          <h2 id="app-dialog-title" className="text-xl text-fg font-(family-name:--font-display) wrap-anywhere">
            {current.title}
          </h2>
          {(current.message || current.messageKey) && (
            <p id="app-dialog-message" className="mt-2 text-sm text-fg-secondary whitespace-pre-line wrap-anywhere">
              {current.message ?? (current.messageKey && t(`errors.${current.messageKey}`))}
            </p>
          )}
          {current.detail && (
            <p className="mt-3 rounded-md bg-bg/60 px-3 py-2 text-left font-mono text-xs text-fg-muted wrap-anywhere">
              {current.detail}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            {isConfirm && (
              <button
                ref={isDestructive ? focusRef : undefined}
                type="button"
                onClick={() => settle(false)}
                className="h-11 flex-1 rounded-md border border-fg/20 text-sm font-medium text-fg hover:border-fg/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg transition-colors duration-200"
              >
                {current.cancelLabel ?? tCommon("cancel")}
              </button>
            )}
            <button
              ref={isConfirm && isDestructive ? undefined : focusRef}
              type="button"
              onClick={() => settle(true)}
              className={`h-11 flex-1 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors duration-200 ${
                isConfirm && current.tone === "danger"
                  ? "bg-danger text-white hover:bg-danger/85 focus-visible:outline-danger-text"
                  : "bg-fg text-bg hover:bg-fg-hover focus-visible:outline-fg"
              }`}
            >
              {current.confirmLabel ?? (isConfirm ? t("confirm") : t("ok"))}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
