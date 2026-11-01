import { Logo } from "@/components/ui";
import { signOut } from "@/features/auth/actions";
import { Button } from "@/components/ui";

export default function InactivePage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-xl font-bold">Account deactivated</h1>
        <p className="mt-2 text-sm text-muted">Your access has been switched off. Contact the owner if you think this is a mistake.</p>
        <form action={signOut} className="mt-6">
          <Button variant="secondary">Sign out</Button>
        </form>
      </div>
    </main>
  );
}
