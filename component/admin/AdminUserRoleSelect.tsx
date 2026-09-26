"use client";

import { useState, useTransition } from "react";
import { confirmDialog } from "@/component/Dialog";
import { useTranslations } from "next-intl";

type Role = "reader" | "author" | "admin";

interface AdminUserRoleSelectProps {
  userId: string;
  currentRole: Role;
  userLabel: string;
}

export default function AdminUserRoleSelect({ userId, currentRole, userLabel }: AdminUserRoleSelectProps) {
  const t = useTranslations("AdminUsers");
  const [role, setRole] = useState<Role>(currentRole);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleChange(newRole: Role) {
    // A role change takes effect immediately (granting or revoking admin
    // access), so confirm it rather than trusting a stray dropdown pick.
    const confirmed = await confirmDialog({
      title: t("changeRoleTitle"),
      message: t("changeRoleMessage", { user: userLabel, from: t(`roles.${role}`), to: t(`roles.${newRole}`) }),
      confirmLabel: t("changeRoleConfirm"),
      tone: "warning",
    });
    if (!confirmed) return;

    const previous = role;
    setRole(newRole); // optimistic
    setError(null);

    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        setRole(previous); // roll back, and say why instead of silently flipping back
        const data = await res.json().catch(() => null);
        setError(data?.error ?? t("changeRoleFailed"));
      }
    });
  }

  return (
    <div>
      <select
        value={role}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as Role)}
        aria-label={t("roleFor", { user: userLabel })}
        className="bg-surface border border-border rounded px-2 py-1 text-sm text-fg disabled:opacity-50"
      >
        <option value="reader">{t("roles.reader")}</option>
        <option value="author">{t("roles.author")}</option>
        <option value="admin">{t("roles.admin")}</option>
      </select>
      {error && <p className="text-xs text-danger-text mt-1">{error}</p>}
    </div>
  );
}
