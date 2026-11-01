import { LayoutDashboard, Inbox, Building2, BookOpen, Settings, type LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; stage?: number };

export const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Inbox, stage: 7 },
  { href: "/clients", label: "Clients", icon: Building2, stage: 2 },
  { href: "/library", label: "Library", icon: BookOpen, stage: 5 },
  { href: "/settings", label: "Settings", icon: Settings },
];
