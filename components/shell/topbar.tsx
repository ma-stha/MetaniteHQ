import { signOut } from "@/features/auth/actions";
import { ROLE_LABEL, type Profile } from "@/lib/auth";
import { Badge, Button, Logo } from "@/components/ui";
import { CommandPalette } from "./command-palette";

export function Topbar({ user }: { user: Profile }) {
  const name = user.full_name || user.email;
  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-bg px-4 sm:px-6">
      <div className="flex items-center gap-3 md:hidden">
        <Logo size="sm" />
      </div>
      <div className="hidden md:block">
        <CommandPalette />
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="text-sm text-white">{name}</div>
        </div>
        <Badge tone={user.role === "owner" ? "green" : "neutral"}>{ROLE_LABEL[user.role]}</Badge>
        <form action={signOut}>
          <Button variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
