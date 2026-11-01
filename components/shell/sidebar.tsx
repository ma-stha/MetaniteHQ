"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui";
import { NAV } from "./nav";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-bg-2 md:flex">
      <div className="flex h-14 items-center border-b border-line px-4">
        <Link href="/dashboard" aria-label="Dashboard">
          <Logo size="sm" />
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                active ? "bg-green-dim text-green" : "text-text hover:bg-bg-3 hover:text-white",
              )}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line px-4 py-3 text-[11px] text-muted">
        <kbd className="rounded-sm border border-line bg-bg-3 px-1 py-0.5 font-sans">⌘K</kbd> to jump anywhere
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-bg-2 md:hidden">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn("flex flex-1 flex-col items-center gap-1 py-2 text-[11px]", active ? "text-green" : "text-muted")}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
