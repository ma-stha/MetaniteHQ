import { requireUser } from "@/lib/auth";
import { Sidebar, MobileNav } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 px-4 py-6 pb-20 sm:px-6 md:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
