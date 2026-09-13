"use client";

import { Search } from "lucide-react";

interface AdminSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function AdminSearchInput({ value, onChange, placeholder }: AdminSearchInputProps) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b655e]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0a] border border-[#050505] rounded pl-9 pr-3 py-2 text-sm text-[#ece6d8] placeholder:text-[#6b655e] focus:outline-none focus:border-[#b6b0a2] transition-colors duration-200"
      />
    </div>
  );
}
