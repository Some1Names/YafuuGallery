"use client";

import { useTranslations } from "next-intl";
import type en from "@/messages/en.json";
import { MAX_DISPLAY_NAME_LENGTH } from "@/lib/signup-schema";

type ValidationKey = keyof typeof en.Validation;
type AuthErrorKey = keyof typeof en.Auth.errors;

// Schema/API validation errors arrive as Validation keys
// (lib/signup-schema.ts); anything else is shown as it came.
export function useValidationMessage() {
  const t = useTranslations("Validation");
  return (message: string): string =>
    t.has(message as ValidationKey) ? t(message as ValidationKey, { max: MAX_DISPLAY_NAME_LENGTH }) : message;
}

// Turns a Better Auth error (signup, sign-in, password reset) into text in
// the reader's language: its `code` when we have a translation for it
// (Auth.errors.*), else a Validation key our own signup hook sent as the
// message (lib/auth.ts reuses lib/signup-schema.ts), else Better Auth's own
// English message, else a generic line.
export function useAuthErrorMessage() {
  const t = useTranslations("Auth.errors");
  const validationMessage = useValidationMessage();
  return (error: { code?: string; message?: string } | null | undefined): string => {
    if (error?.code && t.has(error.code as AuthErrorKey)) return t(error.code as AuthErrorKey);
    if (error?.message) return validationMessage(error.message);
    return t("generic");
  };
}
