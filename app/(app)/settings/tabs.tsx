"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/settings/users", label: "Users" },
  { href: "/settings/system", label: "System" },
];

export function SettingsTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 border-b border-line">
      {TABS.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm",
              active ? "border-green text-white" : "border-transparent text-muted hover:text-white",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
