"use client";

import { useState, useTransition } from "react";

type Role = "reader" | "author" | "admin";

const ROLE_LABELS: Record<Role, string> = { reader: "Reader", author: "Author", admin: "Admin" };

interface AdminUserRoleSelectProps {
  userId: string;
  currentRole: Role;
  userLabel: string;
}

export default function AdminUserRoleSelect({ userId, currentRole, userLabel }: AdminUserRoleSelectProps) {
  const [role, setRole] = useState<Role>(currentRole);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(newRole: Role) {
    // A role change takes effect immediately (granting or revoking admin
    // access), so confirm it rather than trusting a stray dropdown pick.
    if (!confirm(`Change ${userLabel} from ${ROLE_LABELS[role]} to ${ROLE_LABELS[newRole]}?`)) return;

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
        setError(data?.error ?? "Couldn't change role.");
      }
    });
  }

  return (
    <div>
      <select
        value={role}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as Role)}
        aria-label={`Role for ${userLabel}`}
        className="bg-surface border border-border rounded px-2 py-1 text-sm text-fg disabled:opacity-50"
      >
        <option value="reader">Reader</option>
        <option value="author">Author</option>
        <option value="admin">Admin</option>
      </select>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}
