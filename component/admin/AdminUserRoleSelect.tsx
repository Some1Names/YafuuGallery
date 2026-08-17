"use client";

import { useState, useTransition } from "react";

type Role = "reader" | "author" | "admin";

interface AdminUserRoleSelectProps {
  userId: string;
  currentRole: Role;
}

export default function AdminUserRoleSelect({ userId, currentRole }: AdminUserRoleSelectProps) {
  const [role, setRole] = useState<Role>(currentRole);
  const [isPending, startTransition] = useTransition();

  function handleChange(newRole: Role) {
    const previous = role;
    setRole(newRole); // optimistic

    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) setRole(previous); // roll back on failure
    });
  }

  return (
    <select
      value={role}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as Role)}
      className="bg-[#1b1a1c] border border-[#050505] rounded px-2 py-1 text-sm text-[#ece6d8] disabled:opacity-50"
    >
      <option value="reader">Reader</option>
      <option value="author">Author</option>
      <option value="admin">Admin</option>
    </select>
  );
}
